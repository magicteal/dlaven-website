import { v2 as cloudinary } from "cloudinary";

let configured = false;
export function configureCloudinary() {
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env as Record<string, string | undefined>;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars not set: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export async function uploadImage(buffer: Buffer, filename?: string): Promise<{ url: string; public_id: string; width: number; height: number; format: string; bytes: number; }> {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "dlaven",
        resource_type: "image",
        use_filename: !!filename,
        filename_override: filename,
      },
      (error: unknown, result: any) => {
        if (error || !result) return reject(error as Error || new Error("Upload failed"));
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width || 0,
          height: result.height || 0,
          format: result.format || "",
          bytes: result.bytes || 0,
        });
      }
    );
    uploadStream.end(buffer);
  });
}
