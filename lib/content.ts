import { supabase } from './supabase';
import type {
  CarouselImage,
  KeyStat,
  Amenity,
  UnitType,
  ProjectPhoto,
  LocationConfig,
  GreenFeature,
  ContactConfig,
  AboutConfig,
} from './types';

const PROJECT_NAME_TEXT_PATTERN = /lodha\s+mirab+el+e?/gi;
const PROJECT_NAME_URL_PATTERN = /lodha(%20|\+)+mirab+el+e?/gi;

function normalizeProjectText(value: string | null | undefined): string {
  return (value ?? '').replace(PROJECT_NAME_TEXT_PATTERN, 'Lodha Sadahalli');
}

function normalizeProjectUrl(value: string | null | undefined): string {
  return (value ?? '').replace(PROJECT_NAME_URL_PATTERN, 'Lodha%20Sadahalli');
}

function logReadError(scope: string, error: unknown) {
  const code = (error as { code?: string } | null)?.code;
  if (code === 'PGRST205') {
    return;
  }
  console.error(`${scope} error:`, error);
}

export async function getCarouselImages(): Promise<CarouselImage[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from('carousel_images').select('*').order('order', { ascending: true });
  if (!error) {
    return (data ?? []).map((row) => ({
      id: row.id,
      url: row.url,
      alt: normalizeProjectText(row.alt),
      order: row.order,
    }));
  }
  logReadError('getCarouselImages', error);
  return [];
}

export async function getKeyStats(): Promise<KeyStat[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from('key_stats').select('*').order('order', { ascending: true });
  if (!error) {
    return (data ?? []).map((row) => ({
      id: row.id,
      label: normalizeProjectText(row.label),
      value: normalizeProjectText(row.value),
      order: row.order,
    }));
  }
  logReadError('getKeyStats', error);
  return [];
}

export async function getAmenities(): Promise<Amenity[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from('amenities').select('*').order('order', { ascending: true });
  if (!error) {
    return (data ?? []).map((row) => ({
      id: row.id,
      label: normalizeProjectText(row.label),
      description: normalizeProjectText(row.description),
      imageUrl: row.image_url,
      order: row.order,
    }));
  }
  logReadError('getAmenities', error);
  return [];
}

export async function getUnitTypes(): Promise<UnitType[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from('unit_types').select('*').order('order', { ascending: true });
  if (!error) {
    return (data ?? []).map((row) => ({
      id: row.id,
      name: normalizeProjectText(row.name),
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      carpetArea: row.carpet_area,
      builtUpArea: row.built_up_area ?? undefined,
      balcony: row.balcony ?? undefined,
      blueprintUrls: row.blueprint_urls ?? (row.blueprint_url ? [row.blueprint_url] : []),
      order: row.order,
    }));
  }
  logReadError('getUnitTypes', error);
  return [];
}

export async function getProjectPhotos(): Promise<ProjectPhoto[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from('project_photos').select('*').order('order', { ascending: true });
  if (!error) {
    return (data ?? []).map((row) => ({
      id: row.id,
      url: row.url,
      alt: normalizeProjectText(row.alt),
      order: row.order,
    }));
  }
  logReadError('getProjectPhotos', error);
  return [];
}

export async function getLocationConfig(): Promise<LocationConfig | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.from('location_config').select('*').limit(1).maybeSingle();
  if (error) {
    logReadError('getLocationConfig', error);
    return null;
  }
  if (!data) return null;
  return {
    id: data.id,
    embedUrl: normalizeProjectUrl(data.embed_url),
    address: normalizeProjectText(data.address),
  };
}

export async function getGreenFeatures(): Promise<GreenFeature[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from('green_features').select('*').order('order', { ascending: true });
  if (!error) {
    return (data ?? []).map((row) => ({
      id: row.id,
      icon: row.icon,
      title: normalizeProjectText(row.title),
      description: normalizeProjectText(row.description),
      order: row.order,
    }));
  }
  logReadError('getGreenFeatures', error);
  return [];
}

export async function getContactConfig(): Promise<ContactConfig | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.from('contact_config').select('*').limit(1).maybeSingle();
  if (error) {
    logReadError('getContactConfig', error);
    return null;
  }
  if (!data) return null;
  return {
    id: data.id,
    phoneNumber: data.phone_number,
    whatsappMessage: normalizeProjectText(data.whatsapp_message),
  };
}

export async function getAboutConfig(): Promise<AboutConfig | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.from('about_config').select('*').limit(1).maybeSingle();
  if (error) {
    logReadError('getAboutConfig', error);
    return null;
  }
  if (!data) return null;
  return {
    id: data.id,
    content: normalizeProjectText(data.content),
  };
}
