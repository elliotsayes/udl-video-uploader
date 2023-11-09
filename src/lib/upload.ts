import { config } from "@/config";
import { stripExtension } from "./utils";

export const getTitle = (file: File) => stripExtension(file.name);

export const fileTags = (file: File) => ({
  "Content-Type": file.type,
  "File-Name": file.name,
});

export const discoverabilityTags = (title: string) => ({
  Type: "video",
  Title: title,
  Description: "Arseeding UDL Video Uploader",
});

export const rendererTags = () => {
  return config.rendererTxId ? { "Render-With": config.rendererTxId } : {};
};

export type UploadResult = {
  id: string;
};

export type UploadVideosResult = {
  mainVideoResult: UploadResult;
  trailerVideoResult?: UploadResult;
};
