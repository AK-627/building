'use server';

import { revalidatePath } from 'next/cache';
import { createId, readLocalContent, writeLocalContent } from '@/lib/local-content';
import { normalizeGoogleMapsEmbedUrl } from '@/lib/map-url';
import { supabase } from '@/lib/supabase';
import type { CarouselImage, Amenity, UnitType, ProjectPhoto, GreenFeature } from '@/lib/types';

function touchPublicPages() {
  revalidatePath('/');
  revalidatePath('/unit-types');
}

async function persistLocal<T>(updater: (content: Awaited<ReturnType<typeof readLocalContent>>) => T | Promise<T>) {
  const content = await readLocalContent();
  const result = await updater(content);
  await writeLocalContent(content);
  touchPublicPages();
  return result;
}

export async function saveCarouselImages(images: Omit<CarouselImage, 'id'>[]) {
  if (supabase) {
    try {
      const { error } = await supabase.from('carousel_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      if (images.length > 0) {
        const { error: insertError } = await supabase.from('carousel_images').insert(
          images.map((img, i) => ({ url: img.url, alt: img.alt, order: i }))
        );
        if (insertError) throw insertError;
      }
      touchPublicPages();
      return;
    } catch (error) {
      console.error('saveCarouselImages (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    content.carousel = images.map((img, i) => ({ id: createId(), url: img.url, alt: img.alt, order: i }));
  });
}

export async function saveKeyStat(id: string, label: string, value: string) {
  if (supabase) {
    try {
      const { error } = await supabase.from('key_stats').update({ label, value }).eq('id', id);
      if (error) throw error;
      touchPublicPages();
      return;
    } catch (error) {
      console.error('saveKeyStat (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    content.stats = content.stats.map((stat) => (stat.id === id ? { ...stat, label, value } : stat));
  });
}

export async function addKeyStat(label: string, value: string, order: number) {
  if (supabase) {
    try {
      const { error } = await supabase.from('key_stats').insert({ label, value, order });
      if (error) throw error;
      touchPublicPages();
      return;
    } catch (error) {
      console.error('addKeyStat (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    content.stats.push({ id: createId(), label, value, order });
  });
}

export async function deleteKeyStat(id: string) {
  if (supabase) {
    try {
      const { error } = await supabase.from('key_stats').delete().eq('id', id);
      if (error) throw error;
      touchPublicPages();
      return;
    } catch (error) {
      console.error('deleteKeyStat (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    content.stats = content.stats.filter((stat) => stat.id !== id);
  });
}

export async function saveAmenity(amenity: Omit<Amenity, 'id'> & { id?: string }) {
  if (supabase) {
    try {
      if (amenity.id) {
        const { error } = await supabase
          .from('amenities')
          .update({ label: amenity.label, description: amenity.description, image_url: amenity.imageUrl, order: amenity.order })
          .eq('id', amenity.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('amenities')
          .insert({ label: amenity.label, description: amenity.description, image_url: amenity.imageUrl, order: amenity.order });
        if (error) throw error;
      }
      touchPublicPages();
      return;
    } catch (error) {
      console.error('saveAmenity (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    if (amenity.id) {
      content.amenities = content.amenities.map((item) =>
        item.id === amenity.id
          ? { ...item, label: amenity.label, description: amenity.description, imageUrl: amenity.imageUrl, order: amenity.order }
          : item
      );
    } else {
      content.amenities.push({
        id: createId(),
        label: amenity.label,
        description: amenity.description,
        imageUrl: amenity.imageUrl,
        order: amenity.order,
      });
    }
  });
}

export async function deleteAmenity(id: string) {
  if (supabase) {
    try {
      const { error } = await supabase.from('amenities').delete().eq('id', id);
      if (error) throw error;
      touchPublicPages();
      return;
    } catch (error) {
      console.error('deleteAmenity (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    content.amenities = content.amenities.filter((item) => item.id !== id);
  });
}

export async function saveUnitType(unit: Omit<UnitType, 'id'> & { id?: string }) {
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

  if (supabase) {
    try {
      if (unit.id) {
        const { error } = await supabase.from('unit_types').update(row).eq('id', unit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('unit_types').insert(row);
        if (error) throw error;
      }
      touchPublicPages();
      return;
    } catch (error) {
      console.error('saveUnitType (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    if (unit.id) {
      content.unitTypes = content.unitTypes.map((item) =>
        item.id === unit.id
          ? {
              ...item,
              name: unit.name,
              bedrooms: unit.bedrooms,
              bathrooms: unit.bathrooms,
              carpetArea: unit.carpetArea,
              builtUpArea: unit.builtUpArea,
              balcony: unit.balcony,
              blueprintUrls: unit.blueprintUrls,
              order: unit.order,
            }
          : item
      );
    } else {
      content.unitTypes.push({
        id: createId(),
        name: unit.name,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        carpetArea: unit.carpetArea,
        builtUpArea: unit.builtUpArea,
        balcony: unit.balcony,
        blueprintUrls: unit.blueprintUrls,
        order: unit.order,
      });
    }
  });
}

export async function deleteUnitType(id: string) {
  if (supabase) {
    try {
      const { error } = await supabase.from('unit_types').delete().eq('id', id);
      if (error) throw error;
      touchPublicPages();
      return;
    } catch (error) {
      console.error('deleteUnitType (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    content.unitTypes = content.unitTypes.filter((item) => item.id !== id);
  });
}

export async function saveProjectPhotos(photos: Omit<ProjectPhoto, 'id'>[]) {
  if (supabase) {
    try {
      const { error } = await supabase.from('project_photos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      if (photos.length > 0) {
        const { error: insertError } = await supabase.from('project_photos').insert(
          photos.map((p, i) => ({ url: p.url, alt: p.alt, order: i }))
        );
        if (insertError) throw insertError;
      }
      touchPublicPages();
      return;
    } catch (error) {
      console.error('saveProjectPhotos (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    content.projectPhotos = photos.map((photo, i) => ({ id: createId(), url: photo.url, alt: photo.alt, order: i }));
  });
}

export async function saveLocationConfig(embedUrl: string, address: string) {
  const normalizedEmbedUrl = normalizeGoogleMapsEmbedUrl(embedUrl);

  if (supabase) {
    try {
      const { data } = await supabase.from('location_config').select('id').limit(1).single();
      if (data) {
        const { error } = await supabase.from('location_config').update({ embed_url: normalizedEmbedUrl, address }).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('location_config').insert({ embed_url: normalizedEmbedUrl, address });
        if (error) throw error;
      }
      touchPublicPages();
      return;
    } catch (error) {
      console.error('saveLocationConfig (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    const id = content.location?.id ?? createId();
    content.location = { id, embedUrl: normalizedEmbedUrl, address };
  });
}

export async function saveGreenFeature(feature: Omit<GreenFeature, 'id'> & { id?: string }) {
  if (supabase) {
    try {
      if (feature.id) {
        const { error } = await supabase
          .from('green_features')
          .update({ icon: feature.icon, title: feature.title, description: feature.description, order: feature.order })
          .eq('id', feature.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('green_features')
          .insert({ icon: feature.icon, title: feature.title, description: feature.description, order: feature.order });
        if (error) throw error;
      }
      touchPublicPages();
      return;
    } catch (error) {
      console.error('saveGreenFeature (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    if (feature.id) {
      content.greenCampus = content.greenCampus.map((item) =>
        item.id === feature.id
          ? { ...item, icon: feature.icon, title: feature.title, description: feature.description, order: feature.order }
          : item
      );
    } else {
      content.greenCampus.push({
        id: createId(),
        icon: feature.icon,
        title: feature.title,
        description: feature.description,
        order: feature.order,
      });
    }
  });
}

export async function deleteGreenFeature(id: string) {
  if (supabase) {
    try {
      const { error } = await supabase.from('green_features').delete().eq('id', id);
      if (error) throw error;
      touchPublicPages();
      return;
    } catch (error) {
      console.error('deleteGreenFeature (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    content.greenCampus = content.greenCampus.filter((item) => item.id !== id);
  });
}

export async function saveContactConfig(phoneNumber: string, whatsappMessage: string) {
  if (supabase) {
    try {
      const { data } = await supabase.from('contact_config').select('id').limit(1).single();
      if (data) {
        const { error } = await supabase
          .from('contact_config')
          .update({ phone_number: phoneNumber, whatsapp_message: whatsappMessage })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact_config')
          .insert({ phone_number: phoneNumber, whatsapp_message: whatsappMessage });
        if (error) throw error;
      }
      touchPublicPages();
      return;
    } catch (error) {
      console.error('saveContactConfig (supabase) failed, using local store:', error);
    }
  }

  await persistLocal((content) => {
    const id = content.contact?.id ?? createId();
    content.contact = { id, phoneNumber, whatsappMessage };
  });
}
