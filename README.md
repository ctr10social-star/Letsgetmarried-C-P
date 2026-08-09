# Chirag & Priya — Wedding Invitation

A single-page, scroll-driven wedding invitation. Vanilla HTML/CSS/JS,
no build step, no framework, no bundler.

**v4 note:** rebuilt around the actual copy and links already live at
your `CP-wedding-invite` GitHub Pages site — the seal intro, live
countdown, S/o · D/o parent lineage lines, and the exact Map / Add-to-
calendar / WhatsApp RSVP links are all carried over unchanged. Visual
style now uses the real painted illustrations (temple, garden, marbled
texture, floral wreath) as full-bleed backgrounds rather than framed
cards — see "Image assets" below.

## 1. Deploy to GitHub Pages

You already have a live repo at `CP-wedding-invite`, so this is an
update, not a fresh setup:

1. Unzip this package fully — you should get `index.html`,
   `styles.css`, `main.js`, `404.html`, `.nojekyll`, and an `assets/`
   folder.
2. **Important:** your existing repo has an `assets/wedding-music.mp3`
   file that isn't included in this package (I don't have your audio
   file). When you copy these files into your repo, keep that existing
   file in place — don't let the new `assets/` folder overwrite it.
   Everything else in `assets/` here is new and safe to add.
3. Upload/commit these files to the `main` branch at the repo root,
   the same way you did last time (GitHub's "Upload files" page, or
   `git add . && git commit && git push` if you're using the command
   line).
4. GitHub Pages will redeploy automatically within a minute or two at
   your existing URL: `https://ctr10social-star.github.io/CP-wedding-invite/`

## 2. Where each personalized value lives

| What | File | Where |
|---|---|---|
| Seal monogram + tap label | `index.html` | `#scene-seal` |
| Couple's names (casual, countdown hero) | `index.html` | `#scene-countdown` → `.hero-names` |
| Wedding date | `index.html` | `#scene-seal` (in the seal SVG) and `#scene-countdown` → `.countdown-date` |
| Countdown target time | `main.js` | `MUHURTAM_UTC` constant near the top |
| Full names + parent lineage (formal) | `index.html` | `#scene-blessing` |
| Muhurtam / Reception date, time, venue | `index.html` | `#scene-events` → each `.wreath-card` |
| Map links | `index.html` | `.maps-link href` in `#scene-events` |
| Add-to-calendar links | `index.html` | `.maps-link--outline href` — these are direct Google Calendar URLs, no JS needed |
| RSVP WhatsApp number & message | `index.html` | `#whatsapp-rsvp href` |
| Footer line | `index.html` | `#scene-rsvp` → `footer.site-footer` |
| Colour palette | `styles.css` | `:root` custom properties at the top |
| Fonts | `index.html` `<head>` + `styles.css` `--font-display` / `--font-script` |
| Page title / share preview text | `index.html` `<head>` |
| Share preview image | `assets/og.jpg` (regenerate if you change the design) |
| Background music file | `assets/wedding-music.mp3` — keep your existing file; wired up in `index.html`'s `<audio>` tag |

## 3. Adding or removing an event card

Each event is an `<article class="wreath-card reveal">` inside
`#scene-events`. To add one, duplicate a block, update the `<h2>`,
the `<dl class="event-details">` fields, and the two links in
`.event-links` (Map + Add to calendar — build the calendar link at
https://calendar.google.com/calendar/render?action=TEMPLATE with your
own `text`, `dates`, `details`, and `location` query params).

## 4. Image assets — prompts used, and how to regenerate

Four images were generated with Bing Image Creator (free, Microsoft
account, MAI-Image-2.5-Flash model), sharing one style phrase so they
read as one cohesive set:

> Digital watercolor illustration, soft painterly brushwork, warm
> earthy palette of terracotta, marigold gold, temple green and
> peacock blue, storybook South Indian wedding invitation style.

- **Temple hero** (`temple-hero.webp` / `-900.webp`): "...A South
  Indian Dravidian temple gopuram with tapering tiers and gold
  kalasams on top, standing on a green hill, dawn sky gradient from
  blue to peach, trees flanking the base, falling flower petals,
  vertical portrait composition, no text, no watermark, no people"
- **Garden** (`garden.webp` / `-900.webp`): "...A lush blooming flower
  garden with roses, poppies and wildflowers, one peacock with tail
  feathers partly open, vertical portrait composition, no text, no
  watermark, no people"
- **Texture** (`texture.webp`): "Abstract marbled watercolor wash
  texture background, terracotta and marigold gold tones blending
  softly, no objects, no text, no watermark, seamless painterly paper
  texture, storybook South Indian wedding style"
- **Wreath** (`wreath.webp`): "...A delicate oval floral wreath frame
  made of roses and leaves with an empty center, isolated on a plain
  white background, storybook South Indian wedding style, no text, no
  watermark" — then background-removed (soft alpha ramp keyed off
  distance-from-white, plus a color-decontamination pass to strip the
  white JPEG-compression fringe a naive cutout leaves behind).

**Not yet generated:** Ganesha and Lakshmi motifs, to sit at the top
of the blessing/events scenes the way many South Indian invitations
do. Suggested prompts, using the same style phrase:

- Ganesha: "...A respectful, gentle illustration of Lord Ganesha
  seated, ornate but simple, as a blessing motif for a wedding
  invitation header, isolated on a plain white background, no text,
  no watermark"
- Lakshmi: "...A respectful, gentle illustration of Goddess Lakshmi
  seated on a lotus, ornate but simple, as a blessing motif for a
  wedding invitation header, isolated on a plain white background, no
  text, no watermark"

Generate these the same way (Bing Image Creator → download → send
them to me, or run them through the same resize + background-removal
+ WebP steps yourself), and I can drop them into `#scene-blessing` and
`#scene-events`.

## 5. Structure

```
index.html                  → semantic markup for all 6 scenes
styles.css                   → design tokens, layout, motion library
main.js                      → scroll engine, countdown timer, seal-tap scroll, controls
assets/temple-hero.webp      → hero temple illustration, full-bleed (desktop/2x)
assets/temple-hero-900.webp  → same image, 900px wide (served to phones via srcset)
assets/garden.webp           → flower garden + peacock illustration, full-bleed
assets/garden-900.webp       → same image, 900px wide (served to phones via srcset)
assets/texture.webp          → marbled watercolor background
assets/wreath.webp           → floral wreath frame (transparent)
assets/og.jpg                → 1200×630 share-preview image
assets/wedding-music.mp3     → NOT included — keep your existing file here
404.html                     → styled not-found page
.nojekyll                    → tells GitHub Pages not to run Jekyll processing
```

The temple and garden photos are edge-to-edge backgrounds
(`position: absolute; inset: 0; object-fit: cover`), not framed cards.
Both ship two sizes with `srcset`/`sizes="100vw"` so phones on a slow
connection download the 900px version; the hero image also gets
`fetchpriority="high"` and a `<link rel="preload">` since it's the
first thing a visitor sees.

## 6. Accessibility & resilience notes

- Works with CSS and JS both disabled: all content is real HTML
  (`h1`/`h2`, `time`, `address`, `dl`) in document order. The seal
  button isn't a content gate — scrolling past it reaches everything
  without tapping it.
- `prefers-reduced-motion` is respected automatically; there's also a
  manual "Reduce motion" toggle in the top-right controls.
- Skip link jumps straight to the event details for keyboard and
  screen-reader users.
- All scroll-linked animation reads a single cached `scrollY` inside
  one `requestAnimationFrame` loop, and only ever animates `transform`
  and `opacity`.

## >>> EDIT <<<

- **`assets/wedding-music.mp3`** is not included in this package —
  see section 1, step 2.
- Ganesha and Lakshmi motif images are not yet generated — see
  section 4 for prompts.
