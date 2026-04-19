import { readLocalContent } from './local-content';
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
} from './types';

function byOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

function logReadError(scope: string, error: unknown) {
  const code = (error as { code?: string } | null)?.code;
  if (code === 'PGRST205') {
    // Missing table in Supabase schema cache. We silently use local fallback.
    return;
  }
  console.error(`${scope} error:`, error);
}

export async function getCarouselImages(): Promise<CarouselImage[]> {
  if (supabase) {
    const { data, error } = await supabase.from('carousel_images').select('*').order('order', { ascending: true });
    if (!error) {
      return (data ?? []).map((row) => ({
        id: row.id,
        url: row.url,
        alt: row.alt,
        order: row.order,
      }));
    }
    logReadError('getCarouselImages', error);
  }

  const local = await readLocalContent();
  return byOrder(local.carousel);
}

export async function getKeyStats(): Promise<KeyStat[]> {
  if (supabase) {
    const { data, error } = await supabase.from('key_stats').select('*').order('order', { ascending: true });
    if (!error) {
      return (data ?? []).map((row) => ({
        id: row.id,
        label: row.label,
        value: row.value,
        order: row.order,
      }));
    }
    logReadError('getKeyStats', error);
  }

  const local = await readLocalContent();
  return byOrder(local.stats);
}

export async function getAmenities(): Promise<Amenity[]> {
  if (supabase) {
    const { data, error } = await supabase.from('amenities').select('*').order('order', { ascending: true });
    if (!error) {
      return (data ?? []).map((row) => ({
        id: row.id,
        label: row.label,
        description: row.description,
        imageUrl: row.image_url,
        order: row.order,
      }));
    }
    logReadError('getAmenities', error);
  }

  const local = await readLocalContent();
  return byOrder(local.amenities);
}

export async function getUnitTypes(): Promise<UnitType[]> {
  if (supabase) {
    const { data, error } = await supabase.from('unit_types').select('*').order('order', { ascending: true });
    if (!error) {
      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
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
  }

  const local = await readLocalContent();
  return byOrder(local.unitTypes);
}

export async function getProjectPhotos(): Promise<ProjectPhoto[]> {
  if (supabase) {
    const { data, error } = await supabase.from('project_photos').select('*').order('order', { ascending: true });
    if (!error) {
      return (data ?? []).map((row) => ({
        id: row.id,
        url: row.url,
        alt: row.alt,
        order: row.order,
      }));
    }
    logReadError('getProjectPhotos', error);
  }

  const local = await readLocalContent();
  return byOrder(local.projectPhotos);
}

export async function getLocationConfig(): Promise<LocationConfig | null> {
  if (supabase) {
    const { data, error } = await supabase.from('location_config').select('*').limit(1).single();
    if (!error && data) {
      return {
        id: data.id,
        embedUrl: data.embed_url,
        address: data.address,
      };
    }
    if (error) logReadError('getLocationConfig', error);
  }

  const local = await readLocalContent();
  return local.location;
}

export async function getGreenFeatures(): Promise<GreenFeature[]> {
  if (supabase) {
    const { data, error } = await supabase.from('green_features').select('*').order('order', { ascending: true });
    if (!error) {
      return (data ?? []).map((row) => ({
        id: row.id,
        icon: row.icon,
        title: row.title,
        description: row.description,
        order: row.order,
      }));
    }
    logReadError('getGreenFeatures', error);
  }

  const local = await readLocalContent();
  return byOrder(local.greenCampus);
}

export async function getContactConfig(): Promise<ContactConfig | null> {
  if (supabase) {
    const { data, error } = await supabase.from('contact_config').select('*').limit(1).single();
    if (!error && data) {
      return {
        id: data.id,
        phoneNumber: data.phone_number,
        whatsappMessage: data.whatsapp_message,
      };
    }
    if (error) logReadError('getContactConfig', error);
  }

  const local = await readLocalContent();
  return local.contact;
}
