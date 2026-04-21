# Design Document — LODHA SADAHALLI Website

## Overview

LODHA SADAHALLI is a single-property real estate marketing website built with **Next.js 14 (App Router)** and **TypeScript**. The site has two distinct surfaces:

1. **Public site** — a visually rich, scroll-animated marketing page targeting prospective apartment buyers.
2. **Admin panel** — a password-protected dashboard at `/admin` for the site owner to manage all editable content without touching code.

### Goals

- Showcase the property through high-quality imagery, unit blueprints, amenities, and eco-features.
- Drive enquiries via an email form (Resend API), WhatsApp deep-link, and click-to-call.
- Allow the admin to update all content (images, stats, amenities, unit types, location, green features, contact number) through a simple UI backed by Supabase.
- Deliver a premium, mobile-first experience with scroll animations and a lightbox viewer.

### Tech Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/ISR, file-based routing, API routes, TypeScript-first |
| Language | TypeScript | Type safety across shared data models |
| Styling | Tailwind CSS | Utility-first, responsive, consistent design tokens |
| Animations | Framer Motion | Scroll-triggered entry animations, carousel transitions |
| Image hosting | Cloudinary | Optimised delivery, transformation URLs, admin upload |
| Email | Resend API | Simple transactional email, generous free tier |
| Auth session | iron-session | Lightweight HTTP-only cookie session, no DB required |
| Password hashing | bcryptjs | Secure one-way hash stored in env var |
| Database | Supabase (PostgreSQL) | Managed Postgres, real-time, generous free tier, easy Vercel integration |
| Supabase client | `@supabase/supabase-js` | Official JS client for server-side queries and Server Actions |
| Lightbox | yet-another-react-lightbox | Accessible, touch-friendly, keyboard navigable |
| Maps | Google Maps Embed API | iframe embed, no JS SDK required |
| Deployment | Vercel | Native Next.js support, environment variable management |

---

## Architecture

The application follows a **server-component-first** architecture with client components only where interactivity is required (carousel, lightbox, form, animations).

```mermaid
graph TD
    subgraph Public Site
        A[Browser] -->|HTTP GET| B[Next.js App Router]
        B --> C[Page Server Components]
        C --> D[Supabase\nPostgreSQL]
        C --> E[Client Components\nCarousel / Lightbox / Form / Animations]
        E -->|POST /api/enquiry| F[Enquiry API Route]
        F --> G[Resend API]
    end

    subgraph Admin Panel
        H[Admin Browser] -->|GET /admin| I[Admin Layout\nMiddleware auth check]
        I -->|Unauthenticated| J[/admin/login]
        I -->|Authenticated| K[Admin Dashboard]
        K -->|Server Actions / Supabase client| D
        K -->|Cloudinary Upload Widget| L[Cloudinary]
    end
```

### Request Flow — Public Page

1. Next.js server component queries Supabase (server-side, using the service role key) at request time.
2. HTML is rendered server-side and streamed to the browser.
3. Client components hydrate for interactivity (carousel auto-play, lightbox, form submission, scroll animations).
4. Enquiry form POSTs to `/api/enquiry` which calls Resend and returns a JSON response.

### Request Flow — Admin Panel

1. Middleware (`middleware.ts`) checks for a valid `iron-session` cookie on all `/admin/*` routes.
2. Unauthenticated requests are redirected to `/admin/login`.
3. Login form POSTs to `/api/admin/login`; on success, iron-session writes an HTTP-only cookie.
4. Admin dashboard uses **Next.js Server Actions** to read/write data via the Supabase client.
5. Image uploads go directly from the browser to Cloudinary via the unsigned upload widget; the returned URL is then saved via a Server Action to Supabase.

### Content Revalidation

Admin saves trigger `revalidatePath('/')` (and relevant sub-paths) via Next.js cache invalidation after each Supabase write, ensuring the public site reflects changes within seconds without a full redeploy.

---

## Components and Interfaces

### Page Structure

```
app/
├── layout.tsx                  # Root layout (fonts, global styles)
├── page.tsx                    # Homepage (all public sections)
├── unit-types/
│   └── page.tsx                # Unit Types dedicated page
├── admin/
│   ├── layout.tsx              # Admin layout (auth guard)
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── page.tsx                # Admin dashboard
└── api/
    ├── enquiry/
    │   └── route.ts            # POST — send enquiry email via Resend
    └── admin/
        ├── login/
        │   └── route.ts        # POST — authenticate admin
        └── logout/
            └── route.ts        # POST — destroy session
```

### Public Components

| Component | Type | Responsibility |
|---|---|---|
| `HeroCarousel` | Client | Full-width image carousel with auto-play, swipe, arrows, dots |
| `KeyStatistics` | Server | Bold stat cards below carousel |
| `NavigationButtons` | Client | Smooth-scroll anchor buttons |
| `ContactSection` | Mixed | WhatsApp/Call buttons + EnquiryForm |
| `EnquiryForm` | Client | Controlled form with validation, Resend API call |
| `ProjectPhotos` | Client | Responsive grid + lightbox |
| `AmenitiesSection` | Client | Hover/tap cards with description overlay |
| `UnitTypesPage` | Client | Blueprint cards with lightbox |
| `LocationSection` | Server | Google Maps iframe embed |
| `GreenCampusSection` | Server | Green block with icon+text feature list |
| `ScrollReveal` | Client | Framer Motion wrapper for scroll-triggered entry |

### Admin Components

| Component | Type | Responsibility |
|---|---|---|
| `AdminLoginForm` | Client | Password input, POST to `/api/admin/login` |
| `CarouselManager` | Client | Add/remove/reorder Cloudinary image URLs |
| `StatsEditor` | Client | Edit Key Statistics values |
| `AmenitiesManager` | Client | CRUD for amenity entries |
| `UnitTypesManager` | Client | CRUD for unit type cards |
| `LocationEditor` | Client | Update Google Maps embed URL |
| `GreenCampusManager` | Client | CRUD for green feature entries |
| `ContactEditor` | Client | Update phone number |
| `CloudinaryUploader` | Client | Unsigned upload widget wrapper |

### Key Interfaces

```typescript
// Shared content shape — mirrors the Supabase tables
interface SiteContent {
  carousel: CarouselImage[];
  stats: KeyStat[];
  amenities: Amenity[];
  unitTypes: UnitType[];
  projectPhotos: ProjectPhoto[];
  location: LocationConfig;
  greenCampus: GreenFeature[];
  contact: ContactConfig;
}

interface CarouselImage {
  id: string;
  url: string;          // Cloudinary URL
  alt: string;
  order: number;
}

interface KeyStat {
  id: string;
  label: string;        // e.g. "Year of Completion"
  value: string;        // e.g. "2026"
}

interface Amenity {
  id: string;
  label: string;
  description: string;
  imageUrl: string;     // Cloudinary URL
  order: number;
}

interface UnitType {
  id: string;
  name: string;         // e.g. "2 BHK Premium"
  bedrooms: number;
  bathrooms: number;
  carpetArea: string;   // e.g. "850 sq ft"
  builtUpArea?: string;
  balcony?: string;
  blueprintUrl: string; // Cloudinary URL
  order: number;
}

interface ProjectPhoto {
  id: string;
  url: string;          // Cloudinary URL
  alt: string;
  order: number;
}

interface LocationConfig {
  embedUrl: string;     // Google Maps embed iframe src
  address: string;      // Fallback text address
}

interface GreenFeature {
  id: string;
  icon: string;         // Icon name or SVG string
  title: string;
  description: string;
  order: number;
}

interface ContactConfig {
  phoneNumber: string;  // E.164 format, e.g. "+919876543210"
  whatsappMessage: string; // Pre-filled WhatsApp message
}
```

### API Route Contracts

**POST `/api/enquiry`**
```typescript
// Request body
interface EnquiryRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}
// Response
interface EnquiryResponse {
  success: boolean;
  error?: string;
}
```

**POST `/api/admin/login`**
```typescript
// Request body
interface LoginRequest { password: string; }
// Response: 200 OK (sets cookie) | 401 Unauthorized
interface LoginResponse { success: boolean; error?: string; }
```

---

## Data Models

### Database — Supabase (PostgreSQL)

All site content is stored in a Supabase PostgreSQL database. The Next.js app communicates with Supabase exclusively server-side using the **service role key** (never exposed to the client). The public anon key is not used — all reads and writes go through server components and Server Actions.

#### Supabase Tables

```sql
-- Carousel images
create table carousel_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,           -- Cloudinary URL
  alt text not null default '',
  "order" integer not null default 0,
  created_at timestamptz default now()
);

-- Key statistics
create table key_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,         -- e.g. "Year of Completion"
  value text not null,         -- e.g. "2026"
  "order" integer not null default 0
);

-- Amenities
create table amenities (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text not null default '',
  image_url text not null,     -- Cloudinary URL
  "order" integer not null default 0
);

-- Unit types (apartment configurations)
create table unit_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,          -- e.g. "2 BHK Premium"
  bedrooms integer not null,
  bathrooms integer not null,
  carpet_area text not null,   -- e.g. "850 sq ft"
  built_up_area text,
  balcony text,
  blueprint_url text not null, -- Cloudinary URL
  "order" integer not null default 0
);

-- Project photos gallery
create table project_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,           -- Cloudinary URL
  alt text not null default '',
  "order" integer not null default 0
);

-- Location config (single row)
create table location_config (
  id uuid primary key default gen_random_uuid(),
  embed_url text not null,     -- Google Maps embed iframe src
  address text not null        -- Fallback text address
);

-- Green campus features
create table green_features (
  id uuid primary key default gen_random_uuid(),
  icon text not null,          -- Icon name or SVG string
  title text not null,
  description text not null,
  "order" integer not null default 0
);

-- Contact config (single row)
create table contact_config (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null,  -- E.164 format, e.g. "+919876543210"
  whatsapp_message text not null default 'Hi, I am interested in LODHA SADAHALLI.'
);
```

**Supabase client utility:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Server-side only — uses service role key, never exposed to browser
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**Example read (server component):**
```typescript
// Fetch all amenities ordered by display order
const { data: amenities, error } = await supabase
  .from('amenities')
  .select('*')
  .order('order', { ascending: true });
```

**Example write (Server Action):**
```typescript
'use server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updateKeyStat(id: string, value: string) {
  const { error } = await supabase
    .from('key_stats')
    .update({ value })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
}
```

**Design rationale:** Supabase provides a managed PostgreSQL database with a generous free tier, native Vercel integration, and a simple JS client. It eliminates file-system write concerns on serverless deployments (Vercel's read-only filesystem), supports concurrent writes safely, and makes content instantly queryable. Row-level security (RLS) is disabled for these tables since all access is server-side via the service role key.

### Session Model

iron-session stores a minimal session object in an encrypted, HTTP-only cookie:

```typescript
interface SessionData {
  isAdmin: boolean;
}

// iron-session config
const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET!, // 32+ char random string
  cookieName: 'lodha_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  },
};
```

### Environment Variables

```
# Auth
ADMIN_PASSWORD_HASH=<bcrypt hash of admin password>
SESSION_SECRET=<32+ char random string>

# Email
RESEND_API_KEY=<Resend API key>
ADMIN_EMAIL=<email address to receive enquiries>

# Supabase
SUPABASE_URL=<your Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<your Supabase service role key — server-side only, never expose to client>

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<unsigned upload preset>
```

### Enquiry Validation Schema

```typescript
// lib/validation.ts — using zod
import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .min(7, 'Phone number is required')
    .max(20)
    .regex(/^[+\d\s\-()]+$/, 'Invalid phone number'),
  message: z.string().min(1, 'Message is required').max(2000),
});
```

---
## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Content Store Round-Trip

*For any* valid content record (stat, amenity, unit type, photo, green feature, contact, carousel image), inserting or updating the record in Supabase and then fetching it back SHALL return a value that is deeply equal to the saved value.

**Validates: Requirements 2.5, 4.5, 6.5, 7.5, 7.6, 8.5, 9.4, 10.4, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7**

---

### Property 2: Carousel Dot Count Matches Image Count

*For any* list of N carousel images (where N ≥ 1), the rendered carousel SHALL display exactly N navigation dots, and the dot at the current index SHALL be marked as active.

**Validates: Requirements 1.4**

---

### Property 3: WhatsApp URL Construction

*For any* phone number string and pre-filled message string stored in the contact config, the WhatsApp button's `href` attribute SHALL be a correctly formatted `https://wa.me/{phoneNumber}?text={encodedMessage}` URL where the phone number has all non-digit characters (except leading `+`) stripped and the message is URL-encoded.

**Validates: Requirements 4.2**

---

### Property 4: Tel URL Construction

*For any* phone number string stored in the contact config, the Call button's `href` attribute SHALL be a correctly formatted `tel:{phoneNumber}` URL.

**Validates: Requirements 4.3**

---

### Property 5: Enquiry Form Required Field Validation

*For any* subset of the four required enquiry fields (name, email, phone, message) that are left empty or whitespace-only, the form validation SHALL produce at least one error for each such field and SHALL NOT submit the form.

**Validates: Requirements 5.3**

---

### Property 6: Email Format Validation

*For any* string that does not conform to a valid email address format (i.e., does not match the pattern `local@domain.tld`), the enquiry form's email field validation SHALL reject it and display an error. *For any* string that is a valid email address, the validation SHALL accept it.

**Validates: Requirements 5.4**

---

### Property 7: Section Content Rendering Completeness

*For any* non-empty list of content items (amenities, unit types, or green campus features), every item in the list SHALL be rendered in its respective section with all required display fields present (amenity: label + image; unit type: name, bedrooms, bathrooms, carpet area, blueprint image; green feature: icon + title + description).

**Validates: Requirements 7.1, 8.2, 10.3**

---

### Property 8: Admin Password Never Exposed

*For any* login attempt (correct or incorrect password), the HTTP response body from `/api/admin/login` SHALL NOT contain the raw password value, the bcrypt hash, or the `SESSION_SECRET` value.

**Validates: Requirements 11.7**

---

### Property 9: Touch Target Minimum Size

*For any* interactive element (button, link, input, card) rendered on the page, its computed touch target size SHALL be at least 44×44 CSS pixels in both width and height.

**Validates: Requirements 13.4**

---

### Property 10: Interactive Element Focus States

*For any* interactive element (button, link, input) rendered on the page, the element SHALL have a visible `focus-visible` style defined (non-zero outline or equivalent visual indicator).

**Validates: Requirements 14.5**

---

## Error Handling

### Enquiry Form Errors

| Scenario | Handling |
|---|---|
| Missing required field | Inline validation error below field; form not submitted |
| Invalid email format | Inline validation error on email field |
| Resend API error (5xx) | Toast/banner error message; suggest WhatsApp as alternative |
| Resend API rate limit (429) | Same as 5xx error message |
| Network timeout | Same as 5xx error message |

### Carousel Image Load Failure

- Each `<img>` in the carousel has an `onError` handler that swaps `src` to a local fallback placeholder (`/images/placeholder.jpg`).
- The carousel continues to function normally with the placeholder.

### Google Maps Embed Failure

- The `<iframe>` is wrapped in a container that also renders a hidden fallback `<div>` with the text address.
- An `onError` / `onLoad` handler on the iframe toggles visibility: if the iframe fails to load within 5 seconds, the fallback address is shown.

### Admin Authentication Errors

| Scenario | Handling |
|---|---|
| Wrong password | 401 response; display "Incorrect password" error on login form |
| Session expired | Middleware redirects to `/admin/login` with `?expired=1`; login page shows "Session expired" notice |
| Missing `SESSION_SECRET` env var | Server startup fails with a clear error message |
| Missing `ADMIN_PASSWORD_HASH` env var | Login endpoint returns 500 with a generic error; no hash details exposed |

### Content Store Errors

| Scenario | Handling |
|---|---|
| Supabase query returns error | Server Action throws; admin panel shows "Save failed" toast with error message |
| Supabase unreachable (network) | Server component catches error; public page shows cached/fallback content |
| Empty table on first run | `getContent()` returns empty arrays / default single-row values; admin prompted to add content |
| Supabase service role key missing | Server startup logs a clear error; all DB calls fail with a 500 |

### Cloudinary Upload Errors

- The upload widget displays Cloudinary's native error messages.
- If the upload fails, the admin form field remains empty and the admin is prompted to retry.

---

## Testing Strategy

### Overview

The testing strategy uses a **dual approach**: example-based unit/integration tests for specific behaviors and edge cases, and property-based tests for universal correctness properties.

### Property-Based Testing

**Library:** [fast-check](https://github.com/dubzzz/fast-check) (TypeScript-native, excellent arbitrary generators)

**Configuration:** Each property test runs a minimum of **100 iterations** (`numRuns: 100`).

**Tag format:** Each property test is tagged with a comment:
```
// Feature: lodha-sadahalli-website, Property {N}: {property_text}
```

**Properties to implement:**

| Property | Test File | Arbitraries |
|---|---|---|
| P1: Content store round-trip | `__tests__/content-store.property.test.ts` | `fc.record(...)` for Supabase table row shapes |
| P2: Carousel dot count | `__tests__/carousel.property.test.ts` | `fc.array(carouselImageArb, { minLength: 1 })` |
| P3: WhatsApp URL construction | `__tests__/contact-urls.property.test.ts` | `fc.string()` for phone/message |
| P4: Tel URL construction | `__tests__/contact-urls.property.test.ts` | `fc.string()` for phone |
| P5: Enquiry required field validation | `__tests__/enquiry-validation.property.test.ts` | `fc.subarray(['name','email','phone','message'])` |
| P6: Email format validation | `__tests__/enquiry-validation.property.test.ts` | `fc.emailAddress()` (valid) + `fc.string()` (invalid) |
| P7: Section rendering completeness | `__tests__/section-rendering.property.test.ts` | `fc.array(amenityArb, { minLength: 1 })` etc. |
| P8: Password never exposed | `__tests__/admin-auth.property.test.ts` | `fc.string()` for passwords |
| P9: Touch target size | `__tests__/accessibility.property.test.ts` | Enumerate rendered interactive elements |
| P10: Focus states | `__tests__/accessibility.property.test.ts` | Enumerate interactive elements |

### Unit / Example-Based Tests

**Framework:** Jest + React Testing Library

**Coverage targets:**

- `EnquiryForm`: submit success, submit failure (Resend error), field reset after success
- `HeroCarousel`: swipe navigation, arrow navigation, auto-advance (fake timers), image fallback
- `AdminLoginForm`: correct password → redirect, wrong password → error
- `AmenitiesSection`: hover/tap shows description
- `UnitTypesPage`: blueprint click opens lightbox
- `ProjectPhotos`: photo click opens lightbox
- `LocationSection`: iframe renders, fallback shown on error
- Admin middleware: unauthenticated redirect, authenticated pass-through
- Logout endpoint: session cleared, redirect

### Integration Tests

- Enquiry API route: mock Resend, assert email sent with correct fields
- Admin login API: assert cookie set on correct password, 401 on wrong password
- Content revalidation: save content via Server Action (Supabase write), assert `revalidatePath` called

### Smoke / Visual Tests

- Lighthouse CI: mobile performance score ≥ 70 (run in CI pipeline)
- Responsive layout: Playwright screenshots at 320px, 768px, 1280px, 1920px
- Color scheme: assert CSS custom properties match design tokens
- Green Campus section: assert green background class applied

### Test File Structure

```
__tests__/
├── content-store.property.test.ts
├── carousel.property.test.ts
├── contact-urls.property.test.ts
├── enquiry-validation.property.test.ts
├── section-rendering.property.test.ts
├── admin-auth.property.test.ts
├── accessibility.property.test.ts
├── enquiry-form.test.tsx
├── hero-carousel.test.tsx
├── admin-login.test.tsx
├── amenities-section.test.tsx
├── unit-types-page.test.tsx
├── location-section.test.tsx
└── api/
    ├── enquiry.test.ts
    ├── admin-login.test.ts
    └── admin-logout.test.ts
```
