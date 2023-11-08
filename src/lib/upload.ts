import { Token } from "everpay";
import { SendAndPayResult, getInstance, uploadFile } from "./arseeding";
import { getSymbolFirstTag } from "./everpay";
import { stripExtension } from "./utils";
import { ucmTags } from "./ucm";

const getTitle = (file: File) => stripExtension(file.name);

const fileTags = (file: File) => ({
  "Content-Type": file.type,
  "File-Name": file.name,
});

const discoverabilityTags = (title: string) => ({
  Type: "video",
  Title: title,
  Description: "Arseeding UDL Video Uploader",
});

export const uploadVideos = async (
  mainVideo: File,
  everpayTokens: Token[],
  symbol: string,
  udlTags?: Record<string, string>,
  trailerVideo?: File,
  log?: (message: string) => void
) => {
  const tag = getSymbolFirstTag(everpayTokens, symbol)!;

  log?.("Connecting to Arweave Wallet...");
  const { instance, address } = await getInstance();
  log?.(`Connected to Arweave Wallet: ${address}`);

  let trailerVideoResult: SendAndPayResult | undefined;
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

  log?.("Uploading main video...");
  const mainVideoTitle = getTitle(mainVideo);
  const mainVideoTags = {
    ...fileTags(mainVideo),
    ...discoverabilityTags(mainVideoTitle),
    ...(udlTags != undefined
      ? {
          ...udlTags,
          ...ucmTags(address, mainVideoTitle),
        }
      : {}),
    ...(trailerVideoResult !== undefined
      ? { Trailer: trailerVideoResult.order.itemId }
      : {}),
  };
  const mainVideoResult = await uploadFile(
    instance,
    tag,
    mainVideo,
    mainVideoTags
  );

  log?.("Done!");

  return {
    mainVideoResult,
    trailerVideoResult,
  };
};
