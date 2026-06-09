import type { ObjectId } from "mongodb";

export type Media = {
  _id?: ObjectId;
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  fileType?: "image" | "video";
  createdAt: Date;
};

export const MEDIA_COLLECTION = "media";

export type SerializedMedia = Omit<Media, "_id" | "createdAt"> & {
  _id: string;
  createdAt: string;
  fileType?: "image" | "video";
};

export function serializeMedia(media: Media): SerializedMedia {
  return {
    ...media,
    _id: media._id?.toString() ?? "",
    createdAt: media.createdAt.toISOString(),
  };
}
