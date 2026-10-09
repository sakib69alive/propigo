# Propigo — Digital Business Card (NFC / QR)

A fast, mobile-first bio page. All text lives in **one file: `content/site.yaml`**. No programming needed to edit.
সব লেখা শুধু একটি ফাইলে: `content/site.yaml`।

## 1. First-time setup (one time) / প্রথমবার সেটআপ
1. Create a **public** GitHub repository (e.g. `propigo`). Decide the account name and repo name carefully — they become the permanent address and must **never** change.
2. Upload this folder to the repo (`git push` to the `main` branch).
3. GitHub → repo **Settings → Pages → Source: GitHub Actions**.
4. In `content/site.yaml` set both lines to your real address, e.g. `https://YOURNAME.github.io/propigo/`:
   `site.url` and `site.qr_target`.
5. Replace every `[PLACEHOLDER]` (founder name, intro, contact, social links). Commit.
6. After 1–2 minutes the site is live. Open it on a phone and test every button.

## 2. How to edit later / পরে কীভাবে এডিট করবেন
GitHub → open `content/site.yaml` → pencil icon → edit → **Commit changes**. The site rebuilds in ~1–2 minutes.
- Pages: home (`index`), full story (`about/`) and founder (`founder/`). The long "Read more" text is `about_page` in the yaml.
- Call / WhatsApp / Email and every social icon stay visible but dim and not clickable until you fill them in. Paste a full `https://` link next to a platform under `socials:` to switch its icon on.
- Phone: `01XXXXXXXXX` or `+8801XXXXXXXXX`. Links must start with `https://`.
- The QR code opens from the share icon (top right of every page).
- If you make a mistake the build **fails and the old version stays live**. See the red ✗ under the repo's **Actions** tab for the exact message.
- **Founder photo:** put a square-ish photo (≥800×800) in `assets/`, e.g. `assets/founder.jpg`, and set `founder.photo: "founder.jpg"`. Without a photo an initials badge is shown.

## 3. The QR code and NFC card
- QR + NFC must encode **`<site.url>c/`** (for example `https://YOURNAME.github.io/propigo/c/`). That address is permanent and forwards to `site.qr_target`.
- Print files (generated automatically): `qr/propigo-qr.svg` (vector, best for print) and `qr/propigo-qr.png` (2048 px). Download from the live site, e.g. `https://YOURNAME.github.io/propigo/qr/propigo-qr.svg`.
- Print at least **2 × 2 cm**, dark on white, with the blank border kept. Test-scan a printed proof on several phones before ordering a batch.
- **NFC:** tell the card vendor to write *your* URL (`…/c/`) as a plain NDEF URL record. Many vendors substitute their own redirect link — refuse that. Check the chip with a free NFC reader app, and lock it only after testing.

## 4. Rules that protect printed cards (never break these)
- Never rename the GitHub account or the repository, never delete the repo, never turn Pages off. Turn on 2FA and keep recovery codes.
- Content can change freely — the QR stays valid. If the destination ever moves, change only `site.qr_target`.
- Custom domain later (optional): add it in Pages settings and update `site.url`; GitHub keeps redirecting the old address.
- Do not print any card before the live address opens and `/c/` forwards correctly.

## 5. Developer notes
```bash
npm install
npm run build      # outputs _site/
npm start          # local preview with auto-reload (served under the path of site.url)
```
- Hero art (halo + skyline) is generated in `build/art.js`; the page background is pure CSS in `src/styles/base.css`; colours/spacing are in `src/styles/tokens.css`.
- Stack: Eleventy 3 (static), zero client frameworks, ~2 KB inline JS (share/copy only). Page works with JS off.
- `build/validate.js` checks the YAML and fails the build on errors; `build/post.js` writes the QR files, vCard, icons, OG image and font after each build.
- Logo mark geometry: `assets/logo/logo-mark.svg` (traced from `assets/source/logo-original.png`, which is kept untouched).
- No analytics, trackers, forms or third-party scripts. Icons: Simple Icons (CC0) and Lucide (ISC), inlined.
