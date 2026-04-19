import 'server-only';

import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

export function hasCloudinaryConfig(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function ensureConfigured() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Cloudinary is not configured (missing CLOUDINARY_* env vars).');
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
}

/** Upload image bytes to Cloudinary; returns HTTPS URL (suitable for Supabase / img src). */
export async function uploadImageBuffer(buffer: Buffer): Promise<string> {
  ensureConfigured();
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || 'lodha-mirabelle';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error('Cloudinary returned no secure_url'));
          return;
        }
        resolve(result.secure_url);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
