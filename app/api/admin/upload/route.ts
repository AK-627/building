import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { uploadImageBuffer, hasCloudinaryConfig } from '@/lib/cloudinary-upload';
import { getIronSessionOptions } from '@/lib/session';
import type { SessionData } from '@/lib/types';

export const runtime = 'nodejs';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function extensionFromMime(mimeType: string) {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'image/avif':
      return '.avif';
    default:
      return '';
  }
}

function sanitizeExtension(ext: string) {
  const clean = ext.toLowerCase().replace(/[^a-z0-9.]/g, '');
  if (!clean.startsWith('.') || clean.length > 10) return '';
  return clean;
}

async function saveToLocalDisk(file: File): Promise<string> {
  const mimeExt = extensionFromMime(file.type);
  const nameExt = sanitizeExtension(path.extname(file.name || ''));
  const ext = mimeExt || nameExt || '.bin';
  const fileName = `${Date.now()}-${randomUUID()}${ext}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const fullPath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, bytes);

  return `/uploads/${fileName}`;
}

export async function POST(req: NextRequest) {
  let sessionOptions;
  try {
    sessionOptions = getIronSessionOptions();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server configuration error: SESSION_SECRET must be at least 32 characters.' },
      { status: 500 },
    );
  }

  const probeRes = NextResponse.json({ success: true });
  const session = await getIronSession<SessionData>(req, probeRes, sessionOptions);
  if (!session.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ success: false, error: 'Only image uploads are allowed.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ success: false, error: 'Image size must be 10 MB or less.' }, { status: 400 });
  }

  try {
    if (hasCloudinaryConfig()) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadImageBuffer(buffer);
      return NextResponse.json({ success: true, url });
    }

    if (process.env.VERCEL === '1') {
      return NextResponse.json(
        {
          success: false,
          error:
            'Image upload on Vercel requires Cloudinary. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
        },
        { status: 503 },
      );
    }

    const url = await saveToLocalDisk(file);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Upload failed. Please try again.',
      },
      { status: 500 },
    );
  }
}
