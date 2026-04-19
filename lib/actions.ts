'use server';

import { revalidatePath } from 'next/cache';
import { normalizeGoogleMapsEmbedUrl } from '@/lib/map-url';
import { requireSupabase } from '@/lib/supabase';
import type { CarouselImage, Amenity, UnitType, ProjectPhoto, GreenFeature } from '@/lib/types';

function touchPublicPages() {
  revalidatePath('/');
  revalidatePath('/unit-types');
}

export async function saveCarouselImages(images: Omit<CarouselImage, 'id'>[]) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('carousel_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
  if (images.length > 0) {
    const { error: insertError } = await supabase.from('carousel_images').insert(
      images.map((img, i) => ({ url: img.url, alt: img.alt, order: i })),
    );
    if (insertError) throw insertError;
  }
  touchPublicPages();
}

export async function saveKeyStat(id: string, label: string, value: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('key_stats').update({ label, value }).eq('id', id);
  if (error) throw error;
  touchPublicPages();
}

export async function addKeyStat(label: string, value: string, order: number) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('key_stats').insert({ label, value, order });
  if (error) throw error;
  touchPublicPages();
}

export async function deleteKeyStat(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('key_stats').delete().eq('id', id);
  if (error) throw error;
  touchPublicPages();
}

export async function saveAmenity(amenity: Omit<Amenity, 'id'> & { id?: string }) {
  const supabase = requireSupabase();
  if (amenity.id) {
    const { error } = await supabase
      .from('amenities')
      .update({
        label: amenity.label,
        description: amenity.description,
        image_url: amenity.imageUrl,
        order: amenity.order,
      })
      .eq('id', amenity.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('amenities').insert({
      label: amenity.label,
      description: amenity.description,
      image_url: amenity.imageUrl,
      order: amenity.order,
    });
    if (error) throw error;
  }
  touchPublicPages();
}

export async function deleteAmenity(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('amenities').delete().eq('id', id);
  if (error) throw error;
  touchPublicPages();
}

export async function saveUnitType(unit: Omit<UnitType, 'id'> & { id?: string }) {
  const supabase = requireSupabase();
  const row = {
    name: unit.name,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    carpet_area: unit.carpetArea,
    built_up_area: unit.builtUpArea ?? null,
    balcony: unit.balcony ?? null,
    blueprint_urls: unit.blueprintUrls,
    order: unit.order,
  };

  if (unit.id) {
    const { error } = await supabase.from('unit_types').update(row).eq('id', unit.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('unit_types').insert(row);
    if (error) throw error;
  }
  touchPublicPages();
}

export async function deleteUnitType(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('unit_types').delete().eq('id', id);
  if (error) throw error;
  touchPublicPages();
}

export async function saveProjectPhotos(photos: Omit<ProjectPhoto, 'id'>[]) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('project_photos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
  if (photos.length > 0) {
    const { error: insertError } = await supabase.from('project_photos').insert(
      photos.map((p, i) => ({ url: p.url, alt: p.alt, order: i })),
    );
    if (insertError) throw insertError;
  }
  touchPublicPages();
}

export async function saveLocationConfig(embedUrl: string, address: string) {
  const supabase = requireSupabase();
  const normalizedEmbedUrl = normalizeGoogleMapsEmbedUrl(embedUrl);

  const { data, error: selectError } = await supabase.from('location_config').select('id').limit(1).maybeSingle();
  if (selectError) throw selectError;

  if (data) {
    const { error } = await supabase
      .from('location_config')
      .update({ embed_url: normalizedEmbedUrl, address })
      .eq('id', data.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('location_config').insert({
      embed_url: normalizedEmbedUrl,
      address,
    });
    if (error) throw error;
  }
  touchPublicPages();
}

export async function saveGreenFeature(feature: Omit<GreenFeature, 'id'> & { id?: string }) {
  const supabase = requireSupabase();
  if (feature.id) {
    const { error } = await supabase
      .from('green_features')
      .update({
        icon: feature.icon,
        title: feature.title,
        description: feature.description,
        order: feature.order,
      })
      .eq('id', feature.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('green_features').insert({
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
      order: feature.order,
    });
    if (error) throw error;
  }
  touchPublicPages();
}

export async function deleteGreenFeature(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('green_features').delete().eq('id', id);
  if (error) throw error;
  touchPublicPages();
}

export async function saveContactConfig(phoneNumber: string, whatsappMessage: string) {
  const supabase = requireSupabase();
  const { data, error: selectError } = await supabase.from('contact_config').select('id').limit(1).maybeSingle();
  if (selectError) throw selectError;

  if (data) {
    const { error } = await supabase
      .from('contact_config')
      .update({ phone_number: phoneNumber, whatsapp_message: whatsappMessage })
      .eq('id', data.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('contact_config').insert({
      phone_number: phoneNumber,
      whatsapp_message: whatsappMessage,
    });
    if (error) throw error;
  }
  touchPublicPages();
}
