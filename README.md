# 🗺️ Weekend Explorer Bengaluru

A premium, map-first discovery platform for trekkers, riders, photographers, and weekend explorers around Bengaluru. Built with Next.js 15, Mapbox GL, Supabase, and Framer Motion.

---

## ✨ Features

- **Full-screen interactive Mapbox map** — fly-to animations, smooth zoom/pan, custom category markers
- **103 curated locations** — treks, forts, waterfalls, lakes, temples, museums, cafes, and more
- **Instant search** — search by name or category, flies map to result
- **Smart filters** — category, distance (5 ranges), visited/to-visit status
- **🎲 Surprise Me** — randomly picks and flies to a destination
- **Fuel cost calculator** — real-time mileage and price sliders
- **Social sharing** — WhatsApp, Telegram, X, copy link; individual OG-meta pages per place
- **My Weekend List** — save places to browser localStorage
- **Curated collections** — Best Sunrise Spots, Epic Treks, Hidden Gems, etc.
- **Admin panel** — CRUD locations, upload images, manage collections, import CSV
- **Mobile-first** — bottom sheet on mobile, side panel on desktop
- **Dark/light mode** — dark by default, remembers preference

---

## 🛠 Tech Stack

| Layer        | Tech                             |
|--------------|----------------------------------|
| Framework    | Next.js 15 (App Router, TypeScript) |
| Map          | Mapbox GL JS + react-map-gl      |
| Styling      | TailwindCSS + shadcn/ui          |
| Animations   | Framer Motion                    |
| Database     | Supabase (PostgreSQL)            |
| Auth         | Supabase Auth                    |
| Storage      | Supabase Storage                 |
| Deployment   | Vercel                           |

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/weekend-explorer-bengaluru.git
cd weekend-explorer-bengaluru
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration files in order:
   ```
   supabase/migrations/001_init.sql
   supabase/migrations/002_seed_locations.sql
   ```
3. Go to **Storage → New Bucket**:
   - Name: `location-images`
   - Public: ✅
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

4. Go to **Authentication → Users → Invite User** (or use the Supabase CLI):
   ```
   Email: aswinwrites@gmail.com
   Password: #KrackJack06
   ```

### 3. Get a Mapbox token

1. Create account at [mapbox.com](https://account.mapbox.com)
2. Create a public token with `styles:read` and `tiles:read` scopes

### 4. Set environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
weekend-explorer/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Map homepage
│   │   ├── place/[slug]/page.tsx    # Individual place page (OG meta)
│   │   ├── collections/             # Collections listing + detail
│   │   ├── admin/                   # Admin panel (auth-protected)
│   │   │   ├── login/page.tsx
│   │   │   ├── locations/           # CRUD locations
│   │   │   ├── collections/         # Manage collections
│   │   │   └── import/page.tsx      # CSV import
│   │   └── api/                     # REST API routes
│   ├── components/
│   │   ├── map/                     # MapExplorer, MapView, MapMarker
│   │   ├── location/                # LocationPanel, FuelCalculator, ShareButtons
│   │   ├── search/                  # SearchBar
│   │   ├── filters/                 # FilterPanel
│   │   ├── admin/                   # AdminNav, LocationForm, DeleteButton
│   │   └── ui/                      # NavBar, SurpriseButton, SavedListDrawer
│   ├── lib/
│   │   ├── supabase/                # client.ts, server.ts, middleware.ts
│   │   ├── hooks/useSavedList.ts    # localStorage saved list
│   │   ├── categories.ts            # Category metadata + icon mapping
│   │   └── utils.ts                 # cn, slugify, calcFuel, buildShareUrl
│   └── types/index.ts               # TypeScript types
├── supabase/
│   └── migrations/
│       ├── 001_init.sql             # Schema + RLS + categories
│       └── 002_seed_locations.sql   # 103 locations + collections
└── public/
```

---

## 🗄 Database Schema

```sql
categories          -- Trek, Fort, Lake, etc. with icon + color metadata
locations           -- 103 places with coords, categories, distance, description
collections         -- Curated sets (Best Sunrise Spots, Epic Treks, etc.)
collection_locations -- Many-to-many join with sort_order
```

Row Level Security: all public reads allowed, writes require `auth.role() = 'authenticated'`.

---

## 🔐 Admin Panel

URL: `/admin`

- Protected by Supabase Auth middleware
- Login at `/admin/login`
- Features: add/edit/delete locations, upload images to Supabase Storage, manage collections, import CSV

**Admin credentials** are set in your Supabase Authentication dashboard — never in code.

---

## 🌐 Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial Weekend Explorer Bengaluru"
git remote add origin https://github.com/YOUR_USERNAME/weekend-explorer-bengaluru.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Add these **Environment Variables**:

| Variable                          | Value                        |
|-----------------------------------|------------------------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN`        | Your Mapbox public token     |
| `NEXT_PUBLIC_SUPABASE_URL`        | Your Supabase project URL    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Your Supabase anon key       |
| `SUPABASE_SERVICE_ROLE_KEY`       | Your Supabase service role key |
| `NEXT_PUBLIC_APP_URL`             | `https://your-app.vercel.app` |

5. Click **Deploy**

### 3. Post-deployment checklist

- [ ] Visit your Vercel URL — map loads with all 103 markers
- [ ] Click a marker — location panel slides in
- [ ] Test search — type "Nandi" — flies to Nandi Hills
- [ ] Test filters — select "Waterfall" — only waterfall markers show
- [ ] Test Surprise Me — random location loads
- [ ] Open `/place/nandi-hills` — OG meta renders correctly
- [ ] Open `/collections` — all 8 collections listed
- [ ] Open `/admin/login` — sign in works
- [ ] Add a test location in admin — appears on map
- [ ] Upload an image — stores in Supabase, displays in panel
- [ ] Test on mobile — bottom sheet, touch targets
- [ ] Run Lighthouse — target 90+ across all metrics

---

## 🗺 Adding Real Coordinates

The seed data includes accurate approximate coordinates. To refine them:

1. Go to `/admin/locations`
2. Click Edit on any location
3. Update Latitude/Longitude (get from Google Maps — right-click → "What's here?")

---

## 📸 Adding Images

**Option A — Via Admin panel:**
1. Edit a location → Upload image → stored in Supabase Storage automatically

**Option B — Via Unsplash (free):**
Use `https://images.unsplash.com/photo-XXXX?w=800&q=80` as the image URL

**Option C — Bulk via SQL:**
```sql
UPDATE locations SET image_url = 'https://...' WHERE slug = 'nandi-hills';
```

---

## 🛤 Git Workflow

```bash
# Feature branches
git checkout -b feat/add-new-locations
git commit -m "feat: add 10 new waterfall locations"
git push origin feat/add-new-locations

# Merge → Vercel auto-deploys from main
```

Suggested commit convention:
- `feat:` — new features
- `fix:` — bug fixes
- `data:` — location data updates
- `style:` — UI/design changes
- `chore:` — config/dependency updates

---

## 📄 License

MIT — built for the Weekend Explorer community of Bengaluru.
