create extension if not exists pgcrypto;

create table if not exists carousel_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  "order" integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists key_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  "order" integer not null default 0
);

create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text not null default '',
  image_url text not null,
  "order" integer not null default 0
);

create table if not exists unit_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bedrooms integer not null,
  bathrooms integer not null,
  carpet_area text not null,
  built_up_area text,
  balcony text,
  blueprint_urls text[] not null default '{}',
  "order" integer not null default 0
);

create table if not exists project_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  "order" integer not null default 0
);

create table if not exists location_config (
  id uuid primary key default gen_random_uuid(),
  embed_url text not null,
  address text not null
);

create table if not exists green_features (
  id uuid primary key default gen_random_uuid(),
  icon text not null,
  title text not null,
  description text not null,
  "order" integer not null default 0
);

create table if not exists contact_config (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null,
  whatsapp_message text not null default 'Hi, I am interested in LODHA SADAHALLI'
);
