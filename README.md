# St Domenico Pizza Bar — Website

A modern, production-grade Next.js 14 website for St Domenico Neapolitan Pizza Bar in Richmond, Melbourne.

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + CSS variables
- **Animations**: Framer Motion
- **Fonts**: Playfair Display + Inter + Bebas Neue (Google Fonts)
- **Icons**: lucide-react
- **Images**: next/image (AVIF/WebP, lazy loading)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  layout.tsx          # Root layout, SEO metadata, JSON-LD
  page.tsx            # Main one-page site
  globals.css         # Design system, animations, custom cursor
  sitemap.ts          # Auto-generated sitemap
  robots.ts           # robots.txt

components/
  sections/
    TopBar.tsx         # Promotional banner (Nutella Calzone offer)
    Navbar.tsx         # Sticky nav with mobile drawer
    Hero.tsx           # Full-viewport hero with Ken Burns effect
    About.tsx          # Split layout story section
    Specials.tsx       # 3D tilt cards for weekly specials
    BookingWidget.tsx  # Reservation form + accordion
    Menu.tsx           # Full menu with tabs and filters
    Gallery.tsx        # Masonry grid with lightbox
    Contact.tsx        # Map + hours + contact info
    Footer.tsx         # Full footer with all links
  ui/
    Button.tsx
    Accordion.tsx
    ScrollReveal.tsx
    CustomCursor.tsx
    CookieBanner.tsx

lib/
  data/
    menu.ts            # Complete menu (pizze, pasta, drinks...)
    specials.ts        # Weekly specials data
    hours.ts           # Opening hours + restaurant info
  utils.ts             # cn() utility

public/
  images/              # Add real restaurant photos here
```

## Replacing Placeholder Images

The site uses Unsplash images as placeholders. Replace with real restaurant photography:

| Placeholder | Replace with |
|---|---|
| Hero background | Wood-fired oven or signature pizza |
| About (main) | Restaurant interior or team |
| About (floating) | Close-up of Neapolitan pizza |
| Specials cards | Dishes matching each special |
| Gallery | 7 images: pizzas, interior, wine, atmosphere |

Add images to `/public/images/` and update `src` props in each component.

## Real Booking Integration

The booking form currently opens the ResDiary URL in a new tab. To embed the widget directly:

1. Get your embed code from ResDiary (or your booking provider)
2. In `BookingWidget.tsx`, replace the `<form>` block with the iframe embed:

```tsx
<div id="reserve-container" className="w-full min-h-[400px]">
  <iframe
    src="YOUR_RESDIARY_EMBED_URL"
    width="100%"
    height="450"
    frameBorder="0"
    title="Reserve a table"
  />
</div>
```

## SEO & Structured Data

- Full Restaurant JSON-LD schema in `app/layout.tsx`
- Open Graph + Twitter Card metadata
- Auto-generated sitemap.xml and robots.txt
- Update `restaurantInfo` in `lib/data/hours.ts` with real URLs

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com).

## Design Tokens

Colors, fonts, and animations are defined in `tailwind.config.ts` and `app/globals.css`. The design system uses CSS variables for consistency:

| Variable | Value | Usage |
|---|---|---|
| `--cream` | `#F5EFE4` | Background |
| `--terracotta` | `#C04A2B` | Primary accent |
| `--deep-green` | `#1F3A2E` | Secondary accent |
| `--charcoal` | `#1A1512` | Dark sections |
| `--gold` | `#C9A96E` | Luxury details |
