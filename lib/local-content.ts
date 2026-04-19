import 'server-only';

import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { SiteContent } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-content.json');

/** Project-root writes fail on Vercel/serverless; only read bundled JSON or fall back. */
function isServerlessReadOnlyFs(): boolean {
  return (
    process.env.VERCEL === '1' ||
    process.env.NETLIFY === 'true' ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
  );
}

const DEFAULT_CONTENT: SiteContent = {
  carousel: [],
  stats: [],
  amenities: [],
  unitTypes: [],
  projectPhotos: [],
  location: null,
  greenCampus: [],
  contact: null,
};

function withDefaults(content: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    carousel: content?.carousel ?? [],
    stats: content?.stats ?? [],
    amenities: content?.amenities ?? [],
    unitTypes: content?.unitTypes ?? [],
    projectPhotos: content?.projectPhotos ?? [],
    location: content?.location ?? null,
    greenCampus: content?.greenCampus ?? [],
    contact: content?.contact ?? null,
  };
}

export async function ensureLocalContentFile() {
  if (isServerlessReadOnlyFs()) {
    return;
  }
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, 'utf8');
  } catch {
    await writeFile(DATA_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf8');
  }
}

export async function readLocalContent(): Promise<SiteContent> {
  if (isServerlessReadOnlyFs()) {
    try {
      const raw = await readFile(DATA_FILE, 'utf8');
      return withDefaults(JSON.parse(raw) as Partial<SiteContent>);
    } catch {
      return DEFAULT_CONTENT;
    }
  }

  await ensureLocalContentFile();
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    return withDefaults(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function writeLocalContent(content: SiteContent) {
  if (isServerlessReadOnlyFs()) {
    throw new Error(
      'Saving to data/site-content.json is not supported on this host. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY so the admin panel persists to Supabase.'
    );
  }
  await ensureLocalContentFile();
  await writeFile(DATA_FILE, JSON.stringify(content, null, 2), 'utf8');
}

export function createId() {
  return randomUUID();
}
