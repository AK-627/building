# LODHA MIRABELLE — Website

Single-property real estate marketing website for **LODHA MIRABELLE** luxury residences.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, Framer Motion, local uploads, and Resend.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local` and fill in all values:

```env
# Admin Authentication
ADMIN_PASSWORD_HASH=        # bcrypt hash of your admin password
SESSION_SECRET=             # Random 32+ character string for iron-session

# Email (Resend)
RESEND_API_KEY=             # Your Resend API key (https://resend.com)
ADMIN_EMAIL=                # Email address to receive enquiries

# Supabase
SUPABASE_URL=               # Your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=  # Your Supabase service role key (server-side only)

```

### 3. Generate admin password hash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 12).then(h => console.log(h));"
```

Paste the output as `ADMIN_PASSWORD_HASH` in `.env.local`.

### 4. Set up Supabase

Run the SQL migration in your Supabase project:

```
supabase/migrations/001_initial_schema.sql
```

Or paste the contents into the Supabase SQL editor.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

### Fallback behavior (important)

If Supabase is misconfigured or tables are missing, the app now falls back to local file storage in:

```
data/site-content.json
```

Admin edits will still save there, so you can keep working while fixing database setup.

---

## Project Structure

```
app/
├── page.tsx                    # Homepage (public)
├── unit-types/page.tsx         # Floor plans page
├── admin/
│   ├── layout.tsx              # Admin layout (auth guard)
│   ├── login/page.tsx          # Admin login
│   └── page.tsx                # Admin dashboard
└── api/
    ├── enquiry/route.ts        # POST — send enquiry via Resend
    └── admin/
        ├── login/route.ts      # POST — admin login
        └── logout/route.ts     # POST — admin logout

components/
├── HeroCarousel.tsx            # Swipeable image carousel
├── KeyStatistics.tsx           # Bold project stats
├── NavigationButtons.tsx       # Sticky section nav
├── ContactSection.tsx          # WhatsApp + Call + Enquiry form
├── EnquiryForm.tsx             # Contact form
├── ProjectPhotos.tsx           # Photo gallery with lightbox
├── AmenitiesSection.tsx        # Amenity cards with hover overlay
├── UnitTypesGrid.tsx           # Floor plan cards with lightbox
├── LocationSection.tsx         # Google Maps embed
├── GreenCampusSection.tsx      # Eco features (green block)
├── ScrollReveal.tsx            # Framer Motion scroll animation wrapper
└── admin/                      # Admin panel components

lib/
├── supabase.ts                 # Supabase client (server-side only)
├── types.ts                    # TypeScript interfaces
├── content.ts                  # Data fetch functions
├── actions.ts                  # Next.js Server Actions
├── validation.ts               # Zod enquiry schema
├── session.ts                  # iron-session config
└── contact-urls.ts             # WhatsApp/tel URL builders

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema
```

---

## Admin Panel

Access at `/admin`. Features:
- **Hero Carousel** — Add/reorder/delete uploaded images
- **Key Statistics** — Edit Year of Completion, Acres, Completed Area, Development Area
- **Amenities** — Add/edit/delete amenity cards with photos
- **Unit Types** — Add/edit/delete floor plan cards with blueprints
- **Project Photos** — Add/reorder/delete gallery photos
- **Location** — Update Google Maps embed URL and address
- **Green Campus** — Add/edit/delete eco-feature cards
- **Contact** — Update phone number and WhatsApp pre-fill message

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local` in Vercel project settings
4. Deploy

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` is a server-side secret — never expose it to the browser.
