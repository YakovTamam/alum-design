export const GALLERY_COLLECTION = "image_gallery";

export const GALLERY_DIRECTIONS = ["left", "right"] as const;
export type GalleryDirection = (typeof GALLERY_DIRECTIONS)[number];

export type GalleryImage = {
  id: string;
  mediaId: string;
  url: string;
  width: number;
  height: number;
};

export type GallerySection = {
  _id: "main";
  title: string;
  enabled: boolean;
  images: GalleryImage[];
  speed: number; // px per second
  direction: GalleryDirection;
  height: number; // px
  gap: number; // px
  updatedAt: Date;
};

export type SerializedGallerySection = Omit<GallerySection, "_id" | "updatedAt"> & {
  updatedAt: string;
};

export const DEFAULT_GALLERY_SECTION: SerializedGallerySection = {
  title: "",
  enabled: false,
  images: [],
  speed: 50,
  direction: "left",
  height: 220,
  gap: 16,
  updatedAt: new Date(0).toISOString(),
};

export function serializeGallerySection(s: GallerySection): SerializedGallerySection {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = s;
  return { ...rest, updatedAt: s.updatedAt.toISOString() };
}
