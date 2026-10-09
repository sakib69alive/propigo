# Propigo — NFC Digital Business Card & Bio Website: Approved-for-Review Plan

> Handoff note for the next session: this is the PLANNING output. Implementation has NOT started.
> **All decisions are RESOLVED (see "Final decisions" at bottom) — the user approved implementation
> with full design freedom; they will modify afterwards.** Hosting = GitHub (GitHub Pages), no custom domain.
> The original master brief is summarised in §0. The supplied logo is at `assets/source/logo-original.png`
> (1213×864 RGB PNG, white background, no transparency — navy + gold, hexagon "PG" mark).

## 0. Brief summary (from the user's master prompt)
- Premium, mobile-first digital business card + bio page opened via NFC card tap / printed QR.
- Propigo = business collaboration & promotional platform for **real estate** and **automobiles**.
  Partners (developers, building owners, car dealers) promote properties/vehicles via Propigo's social/digital channels.
- NEVER describe Propigo as developer, owner, licensed agency, dealer or inventory owner.
  NEVER invent partners, listings, numbers, awards, founder history, contact details or URLs.
- Colours: white/off-white, deep navy, logo-derived accent, slate/grey. **Prohibited:** purple, pink, neon, rainbow gradients.
- No excessive glassmorphism, 3D, flashy animation, video backgrounds. Must be fast on budget Android.
- No analytics/trackers/forms collecting personal data. No unnecessary third-party scripts.
- Owner is not a programmer → editing must be simple; content separate from presentation.
- QR must stay valid forever even when content changes.

## 1. Project understanding
Visitors arrive face-to-face, on a phone, often budget Android on mobile data. They must understand
"what Propigo is" in ~5 s and complete one action (save contact / WhatsApp / follow) in ~15 s.
The page = Propigo identity card + founder networking profile.

Current repo state: `E:\website\Propigo` was empty. It is inside the shared `E:\website` git repo
(other projects, no remote). Recommend Propigo gets its own repo.

## 2. Creative direction — "the card, continued"
Calm, precise, geometric. The logo's hexagon and diagonal P/G strokes are the only decorative language.

| Role | Approx. value (sample exact from logo) | Use |
|---|---|---|
| Ink navy | `#0B1F45` | headings, primary buttons, QR modules |
| Deep navy | `#071633` | text on light, footer/CTA block |
| Slate | `#5B6B82` | body text, captions |
| Hairline | `#E4E2DC` | borders/dividers |
| Warm off-white | `#F7F5F0` | page background |
| White | `#FFFFFF` | card surfaces |
| Gold (logo) | `#C9A13B` | accent only: hairlines, small labels, focus ring — never body text (fails contrast) |
| Blue support | `#2C4A7E` | hover/pressed, link underline |

- Font: self-hosted variable **Manrope**, Latin subset (~30 KB), system fallback. Headings 600–700, body 400–500 ≥16px, gold letter-spaced small-caps labels.
- 8-pt spacing scale; radii 14px cards / 999px buttons / 10px chips; 1px hairlines; one soft shadow; no blur.
- Signature details: faint hex line pattern behind header (SVG, ~4% opacity); founder portrait in soft hexagon or circle with thin gold ring (mock both); diagonal-stroke section dividers.
- Motion: one fade-rise on load, press feedback only; disabled under `prefers-reduced-motion`.
- Light theme only at launch.

## 3. Page order & journey
1. **Header** (sticky, ~56px): logo mark + "Propigo" wordmark, share icon right.
2. **Identity hero card**: portrait, founder name, title, "Founder, Propigo", one-line positioning
   (e.g. "Connecting property and automotive businesses with the people looking for them."),
   primary actions: **Save contact (.vcf)**, **WhatsApp**, **Call**.
3. **QR & share panel**: styled QR card + Share / Copy link / Download QR (PNG/SVG). Used for "scan my screen" in person.
   Placed 2nd (after identity) — pending user approval since brief said "near the top".
4. **About Propigo**: 2–3 short sentences.
5. **What we promote**: two tiles — Real Estate (buildings, flats, apartments, houses, partner campaigns);
   Automotive (cars, dealer listings, partner campaigns). Small note: "Listings are promoted on behalf of our partners."
6. **Founder's note**: intro + vision/collaboration statement.
7. **Connect**: social buttons grouped "Propigo" and "Founder"; only configured accounts render.
8. **Collaborate**: navy block "Promote your property or vehicles with Propigo" → WhatsApp (pre-filled msg), Email, Website.
9. **Footer**: mark, "© {year} Propigo" (pending approval), back to top.

## 4. Mobile strategy
- Design at 360px, test down to 320px; content max ~440px; desktop = centred card on off-white.
- All content server-rendered HTML; ~2 KB JS only for share/copy/QR download. Works with JS off.
- Budget target (verify, don't promise): <120 KB HTML+CSS+font+icons excl. portrait; portrait AVIF/WebP ~25–40 KB.
- Explicit width/height on images, font preload + `font-display: swap`, blurred colour placeholder → CLS ≈ 0.
- Tap targets ≥48px, body ≥16px, WCAG AA.
- Fallbacks: no portrait → navy hexagon with initials; no Web Share API → copy link.

## 5. Technical architecture
**Eleventy (11ty)** static site, zero client framework. (Rejected: hand-edited HTML — content tangled with markup;
client-side JSON rendering — slower, blank link previews; Next.js/React — overkill.)

```
propigo-card/                  ← own git repo
├─ content/site.yaml           ← ALL editable content
├─ assets/
│  ├─ source/logo-original.png ← supplied logo (do not alter)
│  ├─ logo/                    ← logo.svg, logo-mark.svg, logo.png (transparent)
│  ├─ founder.jpg
│  └─ og-image.png
├─ src/
│  ├─ index.njk
│  ├─ partials/                ← header, hero, qr, about, categories, founder, socials, cta, footer
│  ├─ styles/                  ← tokens.css, base.css, components.css
│  ├─ scripts/share.js         ← ~2 KB
│  └─ icons/                   ← inline SVGs
├─ build/
│  ├─ qr.js                    ← QR SVG/PNG at build time
│  ├─ vcard.js                 ← .vcf from site.yaml
│  └─ validate.js              ← link/phone validation; FAILS BUILD on error
├─ src/c/index.njk             ← permanent QR/NFC entry → meta-refresh to site.qr_target
├─ .github/workflows/deploy.yml← build with Eleventy + deploy to GitHub Pages on every push to main
└─ README.md                   ← plain-language editing guide (Bangla + English)
```
Build-time deps only: `@11ty/eleventy`, `@11ty/eleventy-img`, `qrcode`, `yaml`.
Eleventy `pathPrefix` must match the repo path (e.g. `/propigo/`) so assets resolve on `github.io/<repo>/`; derive it from `site.url`.
Icons: Simple Icons (CC0; brands remain trademarks, used as link identifiers), Lucide (ISC). Inline, tree-shaken.

## 6. QR & permanent URL (GitHub Pages, no custom domain)
1. Site is served at `https://<github-username>.github.io/<repo>/` (or `https://<github-username>.github.io/` if the repo is named `<github-username>.github.io` — shorter URL, recommended if the account is dedicated to Propigo).
   The base URL lives in ONE place: `content/site.yaml → site.url`; QR, vCard, OG tags all read it.
2. QR + NFC encode a stable path: `<site.url>/c/`. GitHub Pages has no server redirects, so `/c/index.html`
   is a tiny generated page (`<meta http-equiv="refresh">` + `<link rel="canonical">` + JS `location.replace` + visible fallback link)
   pointing to the card page. Target is set by `site.qr_target` in `site.yaml` → change one line if destination ever moves.
3. **Permanence rules (document in README):** never rename the GitHub account or the repo, never delete the repo, keep Pages enabled.
   Any of these breaks every printed card. If a custom domain is added later, set it in Pages settings + `site.url`;
   GitHub redirects the old `github.io` URL to the custom domain automatically while the repo stays on Pages, so old cards keep working.
4. Content edits never affect the QR — same URL, latest published content.
4. QR generated at build as SVG, ECC level **Q**, square modules, navy on pure white, ≥4-module quiet zone, no gradients in modules. Decoration goes on the frame only. Optional centre mark only if it passes testing on ≥5 phones.
5. Print: SVG + 2048px PNG export; min printed size ~2×2 cm; test-scan the physical proof.
6. NFC: NDEF URI record with the same URL. Warn user: many vendors write their own redirect URL — insist on own URL. Lock tag only after testing.

## 7. Content editing workflow
Everything in `content/site.yaml` (commented, plain English). Shape:
```yaml
founder:
  name: "[Founder Name]"
  title: "Founder"
  photo: "founder.jpg"
  intro: "..."
  statement: "..."
company:
  tagline: "..."
  about: "..."
categories:
  - title: "Real Estate"
    text: "..."
  - title: "Automotive"
    text: "..."
contact:
  phone: ""            # +8801XXXXXXXXX — empty = hidden
  whatsapp: ""
  whatsapp_message: "Hi Propigo, I'd like to discuss a collaboration."
  email: ""
  website: ""
socials:
  - { owner: company, platform: facebook,  url: "" }
  - { owner: company, platform: instagram, url: "" }
  - { owner: founder, platform: linkedin,  url: "" }
```
Update: GitHub web (or local edit + `git push`) → edit `site.yaml` → Commit → GitHub Actions rebuilds (~1–2 min) → live on Pages.
Invalid entry → build fails → last good version stays live. Portrait: replace `assets/founder.jpg`.
Optional later: Pages CMS (free) for a form UI over the same file. No custom admin dashboard.

## 8. Social & contact integrations
- Platforms: Facebook, Instagram, TikTok, YouTube, LinkedIn, X, Threads, Telegram, WhatsApp, phone, email, website. New platform = one icon-map entry.
- Use canonical `https://` URLs (OS app links open the app if installed, else browser). No `fb://`-style schemes. Don't claim app-open is guaranteed.
- `tel:+880…`, `mailto:`, `https://wa.me/880XXXXXXXXXX?text=…`. Validator normalises BD numbers to E.164.
- vCard 3.0 generated from YAML (name, title, org, phone, email, URL, photo).
- Empty URL → not rendered. Unknown platform / non-https → build error.
- External links: `target="_blank" rel="noopener noreferrer"`, accessible labels ("Propigo on Instagram").

## 9. Hosting — DECIDED: GitHub Pages via GitHub Actions
- User pushes to GitHub; workflow `.github/workflows/deploy.yml` (actions/checkout → setup-node → `npm ci` → `npx @11ty/eleventy` → actions/upload-pages-artifact → actions/deploy-pages). Pages source = "GitHub Actions".
- Free for public repos, HTTPS on `github.io` by default.
- No custom domain now. Optional later (≈US$10–15/yr for .com, verify) — can be attached without breaking printed QR (see §6.3).
- Backup: GitHub repo = source of truth + local clone; output is plain static files → portable to any host.
- Ongoing cost: none.

## 10. Acceptance checklist
- [ ] QR scans first try from print AND phone screen on ≥5 devices (stock Android camera, Google Lens, iPhone camera, budget Android), bright & dim light.
- [ ] NFC tap opens `https://<domain>/c` → redirects to live page (Android NFC on, iPhone XS+).
- [ ] Every configured link opens the exact profile (manual) + automated link check passes.
- [ ] Save contact imports correctly on Android and iOS.
- [ ] WhatsApp opens correct number with pre-filled message.
- [ ] No horizontal scroll at 320/360/390/414/768/desktop.
- [ ] Lighthouse mobile ≥95 all categories (target, verified under throttling).
- [ ] CLS ≈ 0; usable with JS disabled.
- [ ] Keyboard nav + visible focus; reduced motion respected; WCAG AA contrast.
- [ ] OG previews correct in WhatsApp/Facebook/LinkedIn; favicon, apple-touch-icon, title correct.
- [ ] No analytics/trackers/forms/third-party scripts; no console errors.
- [ ] Edit dry-run: change a link via GitHub → live; a broken link fails the build.
- [ ] Tested in Chrome Android, Samsung Internet, Safari iOS, Facebook & Instagram in-app browsers.

## 11. Roadmap
| Stage | Work | Depends on |
|---|---|---|
| 0 | `git init` inside `E:\website\Propigo` as its own repo (separate from parent `E:\website`) | — |
| 1 | Logo assets: faithful SVG trace (same geometry + colours), transparent PNG, mark-only, favicon/apple-touch set | — |
| 2 | Design tokens + full page built directly with clearly marked placeholders (user approved full design freedom) | 1 |
| 3 | Eleventy build: YAML data, partials, icons, `/c/` entry page | 2 |
| 4 | Build scripts: QR, vCard, validator, images, OG image | 3 |
| 5 | GitHub Actions Pages workflow + README (editing guide, permanence rules) | 4 |
| 6 | Perf + a11y pass, local preview at 320/360/390px | 5 |
| 7 | User pushes to GitHub, enables Pages (source: GitHub Actions), sets `site.url`, fills real content | user |
| 8 | Final QA on real phones, print-ready QR export, NFC vendor writes `<site.url>/c/` | 7 |
Critical rule: **no card is printed before the github.io URL is live, `/c/` works, and repo/account names are final.**

## 12. Missing info
**Launch blockers:** final GitHub username + repo name (this becomes the permanent URL); founder name & title; ≥1 contact method (WhatsApp/phone/email); real social URLs; NFC vendor confirmation they'll write the user's URL.
**Strongly recommended:** original vector logo (SVG/AI/PDF) or transparent PNG; founder portrait (≥800×800, plain background); founder intro/statement (neutral drafts allowed, no invented facts).
**Optional:** website URL, Bangla version, address/map, preferred tagline, copyright wording.
**Assumptions:** English only at launch; no analytics; light theme; single founder; trading name "Propigo" (no legal entity shown); generic editable WhatsApp message.

## 13. Risks
| Risk | Prevention |
|---|---|
| Losing control of printed URL | Never rename GitHub account/repo, never delete repo, 2FA on GitHub; never print an NFC vendor's URL |
| Destination change breaks old cards | All print uses `/c/` → repoint via `site.qr_target` |
| QR fails | ECC Q, high contrast, quiet zone, short URL, no module styling, test physical proof |
| NFC vendor writes own URL | Specify in order; verify chip with an NFC reader app |
| Broken/wrong social links | Build-time validation, manual check, empty = hidden |
| Edit breaks site | Failing build keeps last good deploy; git rollback |
| Slow on budget phones | No framework runtime, tight budget, optimised images, one font, real-device test |
| Gold contrast | Gold only decorative/large; contrast checked |
| Implying ownership of listings | "Promote / on behalf of partners" copy + category note |
| Lost GitHub access | 2FA, offline recovery codes, local clone |

## Final decisions (user approved 2026-10-09 — "design it your way, I'll modify later")
1. **Colour:** navy-dominant + restrained **gold** accent from the logo (+ blue support tint). No purple/pink/neon.
2. **Logo:** trace the PNG into a faithful SVG (same geometry & colours); keep the original PNG untouched in `assets/source/`.
3. **QR placement:** second, right after the identity hero.
4. **Stack/hosting:** Eleventy + GitHub repo + GitHub Pages via GitHub Actions.
5. **Domain:** none. Use `github.io` URL, configured once in `site.yaml → site.url` (placeholder until user pushes). Permanent QR path `/c/`.
6. **Repo:** Propigo gets its own git repo (`git init` in `E:\website\Propigo`).
7. **Footer:** "© {year} Propigo".
8. All personal/business details = clearly marked placeholders in `site.yaml`; empty contact/social fields stay hidden. Draft copy must make no factual claims.

Implementation order: own repo → logo assets → tokens + page → Eleventy data/partials/`/c/` → QR/vCard/validator → Actions workflow + README → local preview & a11y/perf check → user pushes & fills content → real-device QA → print.
