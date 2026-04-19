export interface CarouselImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface KeyStat {
  id: string;
  label: string;
  value: string;
  order: number;
}

export interface Amenity {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface UnitType {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  carpetArea: string;
  builtUpArea?: string;
  balcony?: string;
  blueprintUrls: string[];
  order: number;
}

export interface ProjectPhoto {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface LocationConfig {
  id: string;
  embedUrl: string;
  address: string;
}

export interface GreenFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface ContactConfig {
  id: string;
  phoneNumber: string;
  whatsappMessage: string;
}

export interface SiteContent {
  carousel: CarouselImage[];
  stats: KeyStat[];
  amenities: Amenity[];
  unitTypes: UnitType[];
  projectPhotos: ProjectPhoto[];
  location: LocationConfig | null;
  greenCampus: GreenFeature[];
  contact: ContactConfig | null;
}

export interface SessionData {
  isAdmin: boolean;
}
