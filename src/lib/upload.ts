import { Token } from "everpay";
import { SendAndPayResult, getInstance, uploadFile } from "./arseeding";
import { getSymbolFirstTag } from "./everpay";

export const uploadVideos = async (
  mainVideo: File,
  udlTags: Record<string, string>,
  everpayTokens: Token[],
  symbol: string,
  update: (message: string) => void,
  trailerVideo?: File
) => {
  const tag = getSymbolFirstTag(everpayTokens, symbol)!;

  update("Connecting to Arweave Wallet");
  const { instance, address } = await getInstance();
  update(`Connected to Arweave Wallet: ${address}`);

  let trailerVideoResult: SendAndPayResult | undefined;
  if (trailerVideo !== undefined) {
    update("Uploading trailer video...");
    trailerVideoResult = await uploadFile(instance, tag, trailerVideo, {
      "Content-Type": trailerVideo.type,
    });
  }

  update("Uploading main video...");
  const mainVideoResult = await uploadFile(instance, tag, mainVideo, {
    "Content-Type": mainVideo.type,
    ...udlTags,
    ...(trailerVideoResult !== undefined
      ? { Trailer: trailerVideoResult.order.itemId }
      : {}),
  });

  update("Done!");

  return {
    mainVideoResult,
    trailerVideoResult,
  };
};
