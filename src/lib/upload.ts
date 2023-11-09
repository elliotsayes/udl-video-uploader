import { config } from "@/config";
import { formatTagHuman, stripExtension } from "./utils";
import { getArnsRootTransaction } from "./arns";

export const getTitle = (file: File) => stripExtension(file.name);

export const fileTags = (file: File) => ({
  "Content-Type": file.type,
  "File-Name": file.name,
});

export const discoverabilityTags = (title: string) => ({
  Type: "video",
  Title: title,
  Description: `Uploaded with UDL Video Uploader via ${formatTagHuman(
    config.uploader
  )}`,
});

export const rendererTags = async (): Promise<Record<string, string>> => {
  const rendererArns = config.rendererArns;
  try {
    const arnsRendererTxId = await getArnsRootTransaction(rendererArns);
    return {
      "Render-With": arnsRendererTxId,
      "Render-With-ArNS": rendererArns,
    };
  } catch (e) {
    console.error(`Error getting ArNS for ${rendererArns}`, e);
    const rendererTxId = config.defaultRendererTxId!;
    return {
      "Render-With": rendererTxId,
    };
  }
};

export type UploadResult = {
  id: string;
};

export type UploadVideosResult = {
  mainVideoResult: UploadResult;
  trailerVideoResult?: UploadResult;
};
