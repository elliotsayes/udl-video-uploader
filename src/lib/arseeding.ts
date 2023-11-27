import { genArweaveAPI, getBundleFee } from "arseeding-js";
import { addressFromPublicKey } from "./arweave";
import { GenArweaveAPIReturn } from "arseeding-js/cjs/types";
import { config } from "@/config";
import { Token } from "everpay";
import { getSymbolFirstTag } from "./everpay";
import {
  UploadResult,
  UploadVideosResult,
  discoverabilityTags,
  fileTags,
  getTitle,
  rendererTags,
} from "./upload";
import { ucmTags } from "./ucm";
import { ensureRegistered } from "./warp";

type SendAndPayResult = {
  everHash?: string;
  order: {
    itemId: string;
    size: number;
    bundler: string;
    currency: string;
    decimals: number;
    fee: string;
    paymentExpiredTime: number;
    expectedBlock: number;
    tag: string;
  };
};

type UploadFeeResult = {
  currency: string;
  decimals: number;
  finalFee: string;
};

export const getUploadFee = async (
  size: number,
  symbol: string
): Promise<UploadFeeResult> => {
  const arseedingUrl = config.arseedingUrl;
  const fee = await getBundleFee(arseedingUrl, size.toString(), symbol);
  return fee;
};

const connectInstance = async () => {
  const instance = await genArweaveAPI(window.arweaveWallet);
  const address = await addressFromPublicKey(instance.signer.publicKey);

  return {
    instance,
    address,
  };
};

const uploadFile = async (
  instance: GenArweaveAPIReturn,
  tag: string,
  file: File,
  tags: Record<string, string>
): Promise<UploadResult> => {
  const fileArrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(fileArrayBuffer);

  const options = {
    tags: Object.entries(tags).map(([name, value]) => ({
      name,
      value,
    })),
  };

  const arseedingUrl = config.arseedingUrl;
  console.log({ arseedingUrl, tag, options });
  const sendAndPayResult: SendAndPayResult = await instance.sendAndPay(
    arseedingUrl,
    fileBuffer,
    tag,
    options
  );

  console.log({ sendAndPayResult });
  return {
    id: sendAndPayResult.order.itemId,
  };
};

export const uploadVideosToArseeding = async (
  mainVideo: File,
  everpayTokens: Token[],
  symbol: string,
  udlTags?: Record<string, string>,
  trailerVideo?: File,
  log?: (message: string) => void
): Promise<UploadVideosResult> => {
  const tag = getSymbolFirstTag(everpayTokens, symbol)!;

  log?.("Connecting to Arweave Wallet...");
  const { instance, address } = await connectInstance();
  log?.(`Connected to Arweave Wallet: ${address}`);

  let trailerVideoResult: UploadResult | undefined;
  if (trailerVideo !== undefined) {
    log?.("Uploading trailer video...");
    const trailerVideoTitle = getTitle(trailerVideo);
    const trailerVideoTags = {
      ...fileTags(trailerVideo),
      ...discoverabilityTags(trailerVideoTitle),
    };
    trailerVideoResult = await uploadFile(
      instance,
      tag,
      trailerVideo,
      trailerVideoTags
    );
  }

  log?.("Getting latest renderer...");
  const latestRendererTags = await rendererTags();

  log?.("Uploading main video...");
  const mainVideoTitle = getTitle(mainVideo);
  const mainVideoTags = {
    ...fileTags(mainVideo),
    ...discoverabilityTags(mainVideoTitle),
    ...(udlTags != undefined
      ? {
          ...udlTags,
          ...ucmTags(address, mainVideo.type, mainVideoTitle),
        }
      : {}),
    ...latestRendererTags,
    ...(trailerVideoResult !== undefined
      ? { Trailer: trailerVideoResult.id }
      : {}),
  };
  const mainVideoResult = await uploadFile(
    instance,
    tag,
    mainVideo,
    mainVideoTags
  );

  log?.("Registering atomic asset with Warp...");
  const result = await ensureRegistered(mainVideoResult.id, "arweave");
  log?.(`Registered with Warp: ${JSON.stringify(result)}`);

  log?.("Done!");

  return {
    mainVideoResult,
    trailerVideoResult,
  };
};
