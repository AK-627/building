# Implementation Plan: LODHA SADAHALLI Website

## Overview

Implement the LODHA SADAHALLI single-property real estate marketing website using Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, Framer Motion, and the supporting services defined in the design document. Tasks are ordered to build foundational infrastructure first, then public sections, then the admin panel, and finally wire everything together with tests.

## Tasks

- [ ] 1. Project scaffolding and environment setup
  - Initialise a new Next.js 14 project with TypeScript and App Router (`npx create-next-app@latest`)
  - Install all required dependencies: `tailwindcss`, `framer-motion`, `@supabase/supabase-js`, `iron-session`, `bcryptjs`, `resend`, `zod`, `yet-another-react-lightbox`, `fast-check`, `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/bcryptjs`
  - Configure Tailwind CSS with the navy blue / black / white / grey design tokens and a green accent token for the Green Campus section
  - Create `.env.local` with all required environment variable keys (empty values): `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
  - Configure Jest with `jest.config.ts`, `jest.setup.ts`, and `tsconfig` path aliases
  - _Requirements: 13.1, 13.2, 14.1_

- [ ] 2. Supabase schema and shared data layer
  - [ ] 2.1 Create Supabase tables via SQL migration file
    - Write `supabase/migrations/001_initial_schema.sql` containing all 8 table definitions: `carousel_images`, `key_stats`, `amenities`, `unit_types`, `project_photos`, `location_config`, `green_features`, `contact_config` exactly as specified in the design
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

  - [ ] 2.2 Create Supabase client utility
    - Write `lib/supabase.ts` exporting a server-side-only `supabase` client using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
    - _Requirements: 12.1_

  - [ ] 2.3 Create shared TypeScript interfaces
    - Write `lib/types.ts` defining all interfaces: `SiteContent`, `CarouselImage`, `KeyStat`, `Amenity`, `UnitType`, `ProjectPhoto`, `LocationConfig`, `GreenFeature`, `ContactConfig`, `SessionData`
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

  - [ ] 2.4 Create content-fetching server utilities
    - Write `lib/content.ts` with individual async fetch functions for each table (e.g. `getCarouselImages()`, `getKeyStats()`, `getAmenities()`, `getUnitTypes()`, `getProjectPhotos()`, `getLocationConfig()`, `getGreenFeatures()`, `getContactConfig()`)
    - Each function queries Supabase ordered by the `order` column where applicable
    - _Requirements: 1.6, 2.1, 7.1, 8.1, 9.1, 10.1, 12.1–12.7_

  - [ ]* 2.5 Write property test for content store round-trip (Property 1)
    - **Property 1: Content Store Round-Trip**
    - **Validates: Requirements 2.5, 4.5, 6.5, 7.5, 7.6, 8.5, 9.4, 10.4, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7**
    - File: `__tests__/content-store.property.test.ts`
    - Use `fc.record(...)` arbitraries matching each Supabase table row shape; insert via Supabase client, fetch back, assert deep equality
    - Tag: `// Feature: lodha-sadahalli-website, Property 1: Content store round-trip`

- [ ] 3. Enquiry validation schema and iron-session config
  - [ ] 3.1 Create Zod validation schema
    - Write `lib/validation.ts` exporting `enquirySchema` with rules for `name`, `email`, `phone`, and `message` exactly as specified in the design
    - _Requirements: 5.3, 5.4_

  - [ ] 3.2 Create iron-session configuration
    - Write `lib/session.ts` exporting `sessionOptions` (cookie name `lodha_admin_session`, 8-hour maxAge, HTTP-only, secure in production) and the `SessionData` type
    - _Requirements: 11.5_

  - [ ]* 3.3 Write property tests for enquiry form validation (Properties 5 and 6)
    - **Property 5: Enquiry Form Required Field Validation**
    - **Validates: Requirements 5.3**
    - **Property 6: Email Format Validation**
    - **Validates: Requirements 5.4**
    - File: `__tests__/enquiry-validation.property.test.ts`
    - Use `fc.subarray(['name','email','phone','message'])` for P5; `fc.emailAddress()` and `fc.string()` for P6
    - Tag: `// Feature: lodha-sadahalli-website, Property 5: Enquiry required field validation`
    - Tag: `// Feature: lodha-sadahalli-website, Property 6: Email format validation`

- [ ] 4. Root layout, global styles, and fonts
  - Write `app/layout.tsx` with root HTML structure, Google Fonts import (or `next/font`), Tailwind base styles, and metadata for LODHA SADAHALLI
  - Apply the navy blue / black / white / grey color scheme via Tailwind CSS custom properties
  - Ensure consistent typography hierarchy (headings, subheadings, body) is defined in Tailwind config
  - _Requirements: 14.1, 14.4_

- [ ] 5. ScrollReveal wrapper component
  - Write `components/ScrollReveal.tsx` as a client component using Framer Motion `useInView` and `motion.div` to apply scroll-triggered entry animations (fade-up or fade-in) to wrapped children
  - _Requirements: 14.3_

- [ ] 6. Hero Section — HeroCarousel
  - [ ] 6.1 Implement HeroCarousel client component
    - Write `components/HeroCarousel.tsx` as a client component
    - Accept `images: CarouselImage[]` prop
    - Implement auto-advance every 5 seconds using `useEffect` and `clearInterval` on unmount
    - Implement swipe navigation via touch events (`onTouchStart` / `onTouchEnd`)
    - Implement arrow button navigation (previous / next)
    - Render navigation dots; active dot reflects current index
    - Render each image with `<img>` and an `onError` handler that swaps `src` to `/images/placeholder.jpg`
    - Ensure full viewport width and responsive height
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 6.2 Write property test for carousel dot count (Property 2)
    - **Property 2: Carousel Dot Count Matches Image Count**
    - **Validates: Requirements 1.4**
    - File: `__tests__/carousel.property.test.ts`
    - Use `fc.array(carouselImageArb, { minLength: 1 })` to generate image lists; render `HeroCarousel` and assert dot count equals image count and active dot is marked
    - Tag: `// Feature: lodha-sadahalli-website, Property 2: Carousel dot count matches image count`

  - [ ]* 6.3 Write unit tests for HeroCarousel
    - Test swipe navigation, arrow navigation, auto-advance with fake timers, and image fallback on error
    - File: `__tests__/hero-carousel.test.tsx`

- [ ] 7. Key Statistics section
  - Write `components/KeyStatistics.tsx` as a server component accepting `stats: KeyStat[]`
  - Render each stat as a card with a large bold value and a label beneath it
  - Apply responsive grid layout (2-col mobile, 4-col desktop)
  - Wrap with `ScrollReveal` for entry animation
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 8. Navigation Buttons component
  - Write `components/NavigationButtons.tsx` as a client component
  - Render buttons for: Floor Blueprints, Amenities, Location, Green Campus
  - Implement smooth-scroll to section anchors (`scrollIntoView({ behavior: 'smooth' })`) or `next/link` navigation to `/unit-types`
  - Style with minimalist navy blue / white / grey palette
  - Ensure no horizontal overflow on mobile (wrap or scroll)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. Contact Section — WhatsApp, Call, and EnquiryForm
  - [ ] 9.1 Implement contact URL utility functions
    - Write `lib/contact-urls.ts` exporting `buildWhatsAppUrl(phone: string, message: string): string` and `buildTelUrl(phone: string): string`
    - WhatsApp URL: strip non-digit characters (except leading `+`), URL-encode message, format as `https://wa.me/{phone}?text={encodedMessage}`
    - Tel URL: format as `tel:{phoneNumber}`
    - _Requirements: 4.2, 4.3_

  - [ ]* 9.2 Write property tests for contact URL construction (Properties 3 and 4)
    - **Property 3: WhatsApp URL Construction**
    - **Validates: Requirements 4.2**
    - **Property 4: Tel URL Construction**
    - **Validates: Requirements 4.3**
    - File: `__tests__/contact-urls.property.test.ts`
    - Use `fc.string()` arbitraries for phone and message; assert URL structure and encoding
    - Tag: `// Feature: lodha-sadahalli-website, Property 3: WhatsApp URL construction`
    - Tag: `// Feature: lodha-sadahalli-website, Property 4: Tel URL construction`

  - [ ] 9.3 Implement POST `/api/enquiry` route
    - Write `app/api/enquiry/route.ts`
    - Parse and validate request body with `enquirySchema`; return 400 with field errors on validation failure
    - On valid input, call Resend API to send email to `ADMIN_EMAIL` with enquiry details
    - Return `{ success: true }` on success; return `{ success: false, error: string }` on Resend error
    - _Requirements: 5.2, 5.6_

  - [ ]* 9.4 Write unit tests for enquiry API route
    - Mock Resend; assert email sent with correct fields on valid input; assert 400 on invalid input; assert error response on Resend failure
    - File: `__tests__/api/enquiry.test.ts`

  - [ ] 9.5 Implement EnquiryForm client component
    - Write `components/EnquiryForm.tsx` as a client component
    - Controlled form with fields: Full Name, Email Address, Phone Number, Message
    - Client-side validation using `enquirySchema` via Zod `safeParse`; display inline errors below each field
    - On submit, POST to `/api/enquiry`; show confirmation message and reset fields on success; show error banner with WhatsApp fallback suggestion on failure
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 9.6 Write unit tests for EnquiryForm
    - Test: submit success → confirmation shown + fields reset; submit failure (Resend error) → error banner shown; missing fields → inline errors shown; invalid email → email field error
    - File: `__tests__/enquiry-form.test.tsx`

  - [ ] 9.7 Implement ContactSection component
    - Write `components/ContactSection.tsx` as a mixed server/client component
    - Accept `contact: ContactConfig` prop
    - Render WhatsApp button (using `buildWhatsAppUrl`) and Call button (using `buildTelUrl`) prominently above `EnquiryForm`
    - Ensure buttons are visually distinct and meet 44×44px touch target requirement
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 13.4_

- [ ] 10. Checkpoint — core data and contact working
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Project Photos section
  - Write `components/ProjectPhotos.tsx` as a client component
  - Accept `photos: ProjectPhoto[]` prop
  - Render images in a responsive CSS grid (masonry-style or uniform grid)
  - Integrate `yet-another-react-lightbox`; clicking any photo opens the lightbox at that index
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 11.1 Write unit tests for ProjectPhotos
    - Test: photo click opens lightbox; lightbox renders correct image
    - File: `__tests__/unit-types-page.test.tsx` (shared lightbox test file)

- [ ] 12. Amenities section
  - [ ] 12.1 Implement AmenitiesSection client component
    - Write `components/AmenitiesSection.tsx` as a client component
    - Accept `amenities: Amenity[]` prop
    - Render amenity cards in a responsive grid (2-col mobile, 3–4-col desktop)
    - Each card shows the amenity image and label; on hover (desktop) or tap (mobile), overlay the description
    - Wrap section with `ScrollReveal`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 12.2 Write property test for amenities rendering completeness (Property 7 — amenities)
    - **Property 7: Section Content Rendering Completeness (amenities)**
    - **Validates: Requirements 7.1**
    - File: `__tests__/section-rendering.property.test.ts`
    - Use `fc.array(amenityArb, { minLength: 1 })` to generate amenity lists; render `AmenitiesSection` and assert every item's label and image are present in the output
    - Tag: `// Feature: lodha-sadahalli-website, Property 7: Section rendering completeness`

  - [ ]* 12.3 Write unit tests for AmenitiesSection
    - Test: hover/tap shows description overlay
    - File: `__tests__/amenities-section.test.tsx`

- [ ] 13. Unit Types page
  - [ ] 13.1 Implement UnitTypesPage client component
    - Write `components/UnitTypesPage.tsx` as a client component
    - Accept `unitTypes: UnitType[]` prop
    - Render each unit type as a card with: name, blueprint image, bedrooms, bathrooms, carpet area, built-up area (if present), balcony (if present)
    - Integrate `yet-another-react-lightbox`; clicking a blueprint image opens it in the lightbox
    - Responsive layout (1-col mobile, 2–3-col desktop)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 13.2 Write property test for unit types rendering completeness (Property 7 — unit types)
    - **Property 7: Section Content Rendering Completeness (unit types)**
    - **Validates: Requirements 8.2**
    - File: `__tests__/section-rendering.property.test.ts`
    - Use `fc.array(unitTypeArb, { minLength: 1 })`; render `UnitTypesPage` and assert every item's name, bedrooms, bathrooms, carpet area, and blueprint image are present
    - Tag: `// Feature: lodha-sadahalli-website, Property 7: Section rendering completeness`

  - [ ]* 13.3 Write unit tests for UnitTypesPage
    - Test: blueprint click opens lightbox
    - File: `__tests__/unit-types-page.test.tsx`

  - [ ] 13.4 Create Unit Types dedicated page route
    - Write `app/unit-types/page.tsx` as a server component
    - Fetch `unitTypes` via `getUnitTypes()` and render `UnitTypesPage`
    - _Requirements: 8.1_

- [ ] 14. Location section
  - Write `components/LocationSection.tsx` as a server component
  - Accept `location: LocationConfig` prop
  - Render Google Maps `<iframe>` using `embedUrl`
  - Implement 5-second timeout fallback: if iframe does not fire `onLoad` within 5 seconds, show the `address` text instead (requires a thin client wrapper for the timeout logic)
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [ ]* 14.1 Write unit tests for LocationSection
    - Test: iframe renders with correct src; fallback address shown on iframe error
    - File: `__tests__/location-section.test.tsx`

- [ ] 15. Green Campus section
  - [ ] 15.1 Implement GreenCampusSection server component
    - Write `components/GreenCampusSection.tsx` as a server component
    - Accept `features: GreenFeature[]` prop
    - Apply a visually distinct green background block to the entire section
    - Render each feature with its icon, title, and description in a responsive grid
    - Wrap with `ScrollReveal`
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]* 15.2 Write property test for green features rendering completeness (Property 7 — green features)
    - **Property 7: Section Content Rendering Completeness (green features)**
    - **Validates: Requirements 10.3**
    - File: `__tests__/section-rendering.property.test.ts`
    - Use `fc.array(greenFeatureArb, { minLength: 1 })`; render `GreenCampusSection` and assert every item's icon, title, and description are present
    - Tag: `// Feature: lodha-sadahalli-website, Property 7: Section rendering completeness`

- [ ] 16. Homepage assembly
  - Write `app/page.tsx` as a server component
  - Fetch all content in parallel using `Promise.all([getCarouselImages(), getKeyStats(), getAmenities(), getProjectPhotos(), getLocationConfig(), getGreenFeatures(), getContactConfig()])`
  - Compose all public sections in order: `HeroCarousel` → `KeyStatistics` → `NavigationButtons` → `ContactSection` → `ProjectPhotos` → `AmenitiesSection` → `LocationSection` → `GreenCampusSection`
  - Add `id` anchor attributes to each section for smooth-scroll navigation
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 6.1, 7.1, 9.1, 10.1_

- [ ] 17. Checkpoint — public site complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Admin authentication
  - [ ] 18.1 Implement POST `/api/admin/login` route
    - Write `app/api/admin/login/route.ts`
    - Parse `{ password }` from request body
    - Compare against `ADMIN_PASSWORD_HASH` using `bcryptjs.compare`
    - On match: write `iron-session` cookie with `{ isAdmin: true }`, return `{ success: true }`
    - On mismatch: return 401 `{ success: false, error: 'Incorrect password' }`
    - Never include the hash, raw password, or `SESSION_SECRET` in any response body
    - _Requirements: 11.3, 11.4, 11.7_

  - [ ]* 18.2 Write property test for admin password never exposed (Property 8)
    - **Property 8: Admin Password Never Exposed**
    - **Validates: Requirements 11.7**
    - File: `__tests__/admin-auth.property.test.ts`
    - Use `fc.string()` for arbitrary passwords; assert response body never contains raw password, hash, or `SESSION_SECRET`
    - Tag: `// Feature: lodha-sadahalli-website, Property 8: Admin password never exposed`

  - [ ]* 18.3 Write unit tests for admin login API
    - Test: correct password → 200 + cookie set; wrong password → 401; missing `ADMIN_PASSWORD_HASH` env var → 500 with generic error
    - File: `__tests__/api/admin-login.test.ts`

  - [ ] 18.4 Implement POST `/api/admin/logout` route
    - Write `app/api/admin/logout/route.ts`
    - Destroy the `iron-session` cookie and redirect to `/admin/login`
    - _Requirements: 11.6_

  - [ ]* 18.5 Write unit tests for admin logout API
    - Test: session cleared; redirect to `/admin/login`
    - File: `__tests__/api/admin-logout.test.ts`

  - [ ] 18.6 Implement admin middleware
    - Write `middleware.ts` at the project root
    - For all routes matching `/admin/:path*` (excluding `/admin/login`), check for a valid `iron-session` cookie with `isAdmin: true`
    - Redirect unauthenticated requests to `/admin/login`
    - Redirect expired sessions to `/admin/login?expired=1`
    - _Requirements: 11.1, 11.2, 11.5_

  - [ ]* 18.7 Write unit tests for admin middleware
    - Test: unauthenticated request → redirect to `/admin/login`; authenticated request → pass-through; expired session → redirect with `?expired=1`
    - File: `__tests__/admin-middleware.test.ts`

  - [ ] 18.8 Implement AdminLoginForm and login page
    - Write `components/admin/AdminLoginForm.tsx` as a client component with a password input and submit button
    - Display "Incorrect password" error on 401 response; display "Session expired" notice when `?expired=1` is in the URL
    - Write `app/admin/login/page.tsx` rendering `AdminLoginForm`
    - _Requirements: 11.2, 11.3, 11.4_

  - [ ]* 18.9 Write unit tests for AdminLoginForm
    - Test: correct password → redirect to `/admin`; wrong password → error message shown
    - File: `__tests__/admin-login.test.tsx`

- [ ] 19. Cloudinary upload widget
  - Write `components/admin/CloudinaryUploader.tsx` as a client component
  - Load the Cloudinary unsigned upload widget script via `next/script`
  - On upload success, call an `onUpload(url: string)` callback prop with the returned secure URL
  - Display native Cloudinary error messages on failure
  - Use `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` env vars
  - _Requirements: 12.1, 12.3, 12.4_

- [ ] 20. Admin Server Actions
  - Write `lib/actions.ts` (or co-located `actions.ts` files) with `'use server'` directive
  - Implement one Server Action per content type: `saveCarouselImages`, `saveKeyStat`, `saveAmenity`, `deleteAmenity`, `saveUnitType`, `deleteUnitType`, `saveProjectPhotos`, `saveLocationConfig`, `saveGreenFeature`, `deleteGreenFeature`, `saveContactConfig`
  - Each action writes to the corresponding Supabase table and calls `revalidatePath('/')` (and `/unit-types` where relevant) after a successful write
  - Throw a descriptive error on Supabase failure (caught by admin UI to show "Save failed" toast)
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

  - [ ]* 20.1 Write integration tests for content revalidation
    - Mock Supabase write and `revalidatePath`; call each Server Action; assert `revalidatePath('/')` was called
    - File: `__tests__/content-revalidation.test.ts`

- [ ] 21. Admin dashboard UI components
  - [ ] 21.1 Implement CarouselManager
    - Write `components/admin/CarouselManager.tsx` — list existing carousel images with reorder (drag or up/down buttons) and delete; add new image via `CloudinaryUploader`; save via `saveCarouselImages` Server Action
    - _Requirements: 12.1_

  - [ ] 21.2 Implement StatsEditor
    - Write `components/admin/StatsEditor.tsx` — inline editable fields for each `KeyStat` label and value; save via `saveKeyStat` Server Action
    - _Requirements: 12.2_

  - [ ] 21.3 Implement AmenitiesManager
    - Write `components/admin/AmenitiesManager.tsx` — list amenities with edit/delete; add new amenity (label, description, image via `CloudinaryUploader`); save via `saveAmenity` / `deleteAmenity` Server Actions
    - _Requirements: 12.3_

  - [ ] 21.4 Implement UnitTypesManager
    - Write `components/admin/UnitTypesManager.tsx` — list unit types with edit/delete; add new unit type (all fields + blueprint via `CloudinaryUploader`); save via `saveUnitType` / `deleteUnitType` Server Actions
    - _Requirements: 12.4_

  - [ ] 21.5 Implement PhotosManager
    - Write `components/admin/PhotosManager.tsx` — list project photos with reorder and delete; add new photo via `CloudinaryUploader`; save via `saveProjectPhotos` Server Action
    - _Requirements: 12.1_ (project photos)

  - [ ] 21.6 Implement LocationEditor
    - Write `components/admin/LocationEditor.tsx` — text input for Google Maps embed URL; save via `saveLocationConfig` Server Action
    - _Requirements: 12.5_

  - [ ] 21.7 Implement GreenCampusManager
    - Write `components/admin/GreenCampusManager.tsx` — list green features with edit/delete; add new feature (icon, title, description); save via `saveGreenFeature` / `deleteGreenFeature` Server Actions
    - _Requirements: 12.6_

  - [ ] 21.8 Implement ContactEditor
    - Write `components/admin/ContactEditor.tsx` — text input for phone number and WhatsApp pre-fill message; save via `saveContactConfig` Server Action
    - _Requirements: 12.7_

- [ ] 22. Admin layout and dashboard page
  - Write `app/admin/layout.tsx` — server component that reads the session; if not authenticated, redirect to `/admin/login`; render admin shell with logout button
  - Write `app/admin/page.tsx` — server component that fetches all current content and renders all admin manager components in a single dashboard
  - _Requirements: 11.1, 11.2, 11.6, 12.1–12.8_

- [ ] 23. Checkpoint — admin panel complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 24. Accessibility — touch targets and focus states
  - [ ] 24.1 Audit and enforce 44×44px touch targets
    - Review all interactive elements (buttons, links, inputs, cards) and add `min-h-[44px] min-w-[44px]` Tailwind classes or equivalent padding where needed
    - _Requirements: 13.4_

  - [ ]* 24.2 Write property test for touch target minimum size (Property 9)
    - **Property 9: Touch Target Minimum Size**
    - **Validates: Requirements 13.4**
    - File: `__tests__/accessibility.property.test.ts`
    - Enumerate rendered interactive elements; assert computed touch target size ≥ 44×44 CSS pixels for each
    - Tag: `// Feature: lodha-sadahalli-website, Property 9: Touch target minimum size`

  - [ ] 24.3 Audit and enforce focus-visible states
    - Ensure all interactive elements have a visible `focus-visible` outline or equivalent via Tailwind `focus-visible:` utilities
    - _Requirements: 14.5_

  - [ ]* 24.4 Write property test for focus states (Property 10)
    - **Property 10: Interactive Element Focus States**
    - **Validates: Requirements 14.5**
    - File: `__tests__/accessibility.property.test.ts`
    - Enumerate interactive elements; assert each has a non-zero `focus-visible` outline or equivalent style defined
    - Tag: `// Feature: lodha-sadahalli-website, Property 10: Interactive element focus states`

- [ ] 25. Final wiring and integration
  - [ ] 25.1 Verify all section anchor IDs match NavigationButtons targets
    - Confirm `id` attributes on each section in `app/page.tsx` match the `href` values in `NavigationButtons`
    - _Requirements: 3.3_

  - [ ] 25.2 Verify LODHA SADAHALLI branding consistency
    - Search all source files and confirm the property name always appears as "LODHA SADAHALLI" (all caps) in rendered content, page titles, metadata, and email templates
    - _Requirements: all_

  - [ ] 25.3 Add `<head>` metadata
    - Set `title`, `description`, and Open Graph tags in `app/layout.tsx` using Next.js `Metadata` API with "LODHA SADAHALLI" as the property name
    - _Requirements: 14.1_

  - [ ] 25.4 Create Vercel deployment configuration
    - Add `vercel.json` if needed for any custom headers or rewrites
    - Confirm all environment variables are documented in `README.md` with setup instructions
    - _Requirements: 12.8_

- [ ] 26. Final checkpoint — full test suite
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with a minimum of 100 iterations (`numRuns: 100`)
- Unit and integration tests use Jest + React Testing Library
- The Supabase service role key must never be exposed to the browser — all DB access is server-side only
- `revalidatePath('/')` is called after every admin save to keep the public site fresh within seconds
- The property name "LODHA SADAHALLI" must always appear in all caps in all rendered content and code strings
