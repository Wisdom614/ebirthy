# ebirthy
> **Architectural Swiss Brutalist Interactive Birthday Celebration Studio & Player**

**ebirthy** is a modern Next.js 16 web application that lets users compose, personalize, and share dynamic, interactive birthday celebration experiences. Designed with a high-contrast **Swiss International Typographic / Architectural Light System** (warm linen paper, deep charcoal ink, and strict 0px straight edges).

---

## [ FEATURES ]

- **[ STUDIO // CREATOR ] (`/studio`)**:
  - Customize recipient identity, VIP title, headline, and personalized wishes.
  - Choose between curated Swiss themes (*Warm Linen & Ochre*, *Bauhaus Vermillion*, *Sandstone & Sage*, *Swiss Cobalt*, *Obsidian Monolith*).
  - Physics toggles for layered cakes, geometric diamond balloons, confetti cannons, and particle fireworks.
  - Typewriter letterpress memo with seal-breaking interaction.
  - Photographic Memory Plates uploaded via Cloudinary.
  - Live desktop and mobile responsive simulator preview.

- **[ CELEBRATION STAGE ] (`/celebrate` & `/c/[slug]`)**:
  - **Interactive Cake & Candles**: Tap to blow individual candles or use **Microphone Audio Breath Detection** to blow all candles with real sound.
  - **Unboxing Secret Gift Parcel**: Tap-to-unseal surprise reward with VIP voucher code and confetti bursts.
  - **Photo Memory Reel**: Polaroid-style photo plates with pin markers and modal inspection.
  - **Cinematic Sealed Letter**: Break the wax seal to trigger typewriter message reveal.
  - **Procedural Audio Synthesizer**: Web Audio API engine with multi-track melodies (Lo-Fi, Orchestral, Synthwave, Festive) and SFX (pop, blow, horn, chime, sparkle).

- **[ SHORT SHARE LINKS ] (`/c/[slug]`)**:
  - Auto-generated short human-readable slugs persisted in **Supabase** (e.g. `/c/alex-24-x8k2`).
  - Offline standalone LZ-String compression (`?c=...`) for database-free sharing.
  - 1-click WhatsApp dispatch and clipboard sharing.

- **[ PERSISTENCE & MEDIA ]**:
  - **Supabase Database & Auth**: Cloud saving, user workspaces, and live view counters.
  - **Cloudinary**: Direct image uploads for memory photo plates.

---

## [ TECH STACK ]

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with strict `0px` border-radius Swiss design system
- **Audio Engine**: Web Audio API procedural synthesizer (`utils/audioManager.ts`)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL, RLS, Auth, RPC)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Compression / Short IDs**: `lz-string` + `nanoid`
- **Animations / VFX**: `canvas-confetti` + custom HTML5 Canvas particle physics

---

## [ GETTING STARTED ]

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Wisdom614/ebirthy.git
cd ebirthy
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase and Cloudinary credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 3. Setup Database Schema (Supabase)
Run the SQL queries found in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor to initialize the `scenes` table, RLS policies, and view count functions.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## [ REPOSITORY STRUCTURE ]

```
├── app/
│   ├── c/[slug]/page.tsx      # Dynamic short-link celebration player
│   ├── celebrate/page.tsx     # Celebration player (data/id query support)
│   ├── studio/page.tsx        # Swiss architectural studio creator
│   ├── api/upload/route.ts    # Cloudinary upload handler
│   ├── globals.css            # Swiss brutalist CSS & 0px radius rules
│   └── page.tsx               # Landing page & feature showcase
├── components/
│   ├── scene/                 # Interactive cake, gift, balloons, letter, fireworks
│   ├── studio/                # Form panels, theme pickers, share modal
│   └── auth/                  # Supabase authentication modal
├── supabase/
│   └── schema.sql             # Database tables, RLS policies & triggers
├── utils/
│   ├── audioManager.ts        # Procedural Web Audio API synthesizer
│   ├── sceneEncoder.ts        # LZ-String compressor & slug generator
│   ├── supabase/              # Supabase client & database queries
│   └── cloudinary.ts          # Media upload helper
```

---

## [ LICENSE ]
MIT License. Built for creating memorable celebrations.
