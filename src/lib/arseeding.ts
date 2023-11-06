import { genArweaveAPI } from "arseeding-js";
import { addressFromPublicKey } from "./arweave";
import { GenArweaveAPIReturn } from "arseeding-js/cjs/types";

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
  const arseedingUrl = import.meta.env.VITE_CONFIG_ARSEEDING_URL;

  const fileArrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(fileArrayBuffer);

  const options = {
    tags: Object.entries(tags).map(([name, value]) => ({
      name,
      value,
    })),
  };

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
