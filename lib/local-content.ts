import 'server-only';

import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { SiteContent } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-content.json');

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
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, 'utf8');
  } catch {
    await writeFile(DATA_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf8');
  }
}

export async function readLocalContent(): Promise<SiteContent> {
  await ensureLocalContentFile();
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    return withDefaults(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function writeLocalContent(content: SiteContent) {
  await ensureLocalContentFile();
  await writeFile(DATA_FILE, JSON.stringify(content, null, 2), 'utf8');
}

export function createId() {
  return randomUUID();
}
