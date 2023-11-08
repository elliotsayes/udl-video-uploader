import { genArweaveAPI, getBundleFee } from "arseeding-js";
import { addressFromPublicKey } from "./arweave";
import { GenArweaveAPIReturn } from "arseeding-js/cjs/types";
import { config } from "@/config";

export type SendAndPayResult = {
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

export type UploadFeeResult = {
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

export const getInstance = async () => {
  const instance = await genArweaveAPI(window.arweaveWallet);
  const address = await addressFromPublicKey(instance.signer.publicKey);

  return {
    instance,
    address,
  };
};

export const uploadFile = async (
  instance: GenArweaveAPIReturn,
  tag: string,
  file: File,
  tags: Record<string, string>
): Promise<SendAndPayResult> => {
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
  const sendAndPayResult = await instance.sendAndPay(
    arseedingUrl,
    fileBuffer,
    tag,
    options
  );

  console.log({ sendAndPayResult });
  return sendAndPayResult as SendAndPayResult;
};
