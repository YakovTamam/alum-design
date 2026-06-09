import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const FOLDER = "alum-design";

let configured = false;

function ensureConfigured() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not set");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
}

export async function uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function deleteMedia(
  publicId: string,
  fileType?: "image" | "video",
): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: fileType === "video" ? "video" : "image",
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  return deleteMedia(publicId, "image");
}

export function generateUploadSignature(): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
} {
  ensureConfigured();

  const timestamp = Math.round(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;

  const signature = cloudinary.utils.api_sign_request(
    { folder: FOLDER, timestamp },
    apiSecret,
  );

  return { signature, timestamp, apiKey, cloudName, folder: FOLDER };
}
