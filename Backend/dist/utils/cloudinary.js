"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCloudinary = configureCloudinary;
exports.uploadImage = uploadImage;
const cloudinary_1 = require("cloudinary");
let configured = false;
function configureCloudinary() {
    if (configured)
        return;
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary env vars not set: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
    }
    cloudinary_1.v2.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        secure: true,
    });
    configured = true;
}
async function uploadImage(buffer, filename) {
    configureCloudinary();
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: process.env.CLOUDINARY_FOLDER || "dlaven",
            resource_type: "image",
            use_filename: !!filename,
            filename_override: filename,
        }, (error, result) => {
            if (error || !result)
                return reject(error || new Error("Upload failed"));
            resolve({
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width || 0,
                height: result.height || 0,
                format: result.format || "",
                bytes: result.bytes || 0,
            });
        });
        uploadStream.end(buffer);
    });
}
