import { config } from "@/config";
import { formatTagHuman, stripExtension } from "./utils";

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

export const rendererTags = (rendererTxId: string) => {
  return { "Render-With": rendererTxId };
};

export type UploadResult = {
  id: string;
};

export type UploadVideosResult = {
  mainVideoResult: UploadResult;
  trailerVideoResult?: UploadResult;
};
