# Changelog

## 2026-05-03 - Phase 0: Preflight Review

- Saved the execution preflight review to `docs/pre-refactor-review.md`.
- Confirmed the project is a Hugo site based on `hugo-theme-stack`.
- Confirmed current global shell was still inherited from the Stack theme before Phase 1.
- Identified missing core pages: About, Journal, Music, Contact.
- Identified the previous `assets/scss/custom.scss` as a large centralized override file and a major refactor risk.

## 2026-05-03 - Phase 1: Visual System And Global Shell

- Added a project-level `layouts/_default/baseof.html` to introduce the new global shell.
- Added a minimal top navigation partial at `layouts/partials/site-header.html`.
- Added reusable decorative music partials:
  - `layouts/partials/music-staff-bg.html`
  - `layouts/partials/music-note-decor.html`
- Added Google Fonts through `layouts/partials/head/custom.html`.
- Overrode Stack's dynamic Lato loader with `layouts/partials/footer/components/custom-font.html`.
- Replaced the previous footer custom injection with a focused mobile navigation and back-to-top script.
- Replaced the monolithic `assets/scss/custom.scss` with a modular SCSS entry.
- Added foundational SCSS modules:
  - `assets/scss/_variables.scss`
  - `assets/scss/_reset.scss`
  - `assets/scss/_typography.scss`
  - `assets/scss/_header.scss`
  - `assets/scss/_decorations.scss`
  - `assets/scss/_dark-mode.scss`
  - `assets/scss/_legacy-bridge.scss`
  - `assets/scss/_responsive.scss`
- Added `params.primaryNav` to `hugo.yaml` for the target IA: Home, About, Blog, Journal, Music, Contact.
- Stopped loading the old particles, fireworks, and avatar color extraction scripts from `footer/custom.html`.
- Added custom SVG icons under `assets/icons/` for the refactor shell and article actions.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Local Hugo server started at `http://127.0.0.1:1313/`.
- Smoke checks passed for `/`, `/post/`, and `/p/map--set/`.
- Rendered HTML includes the new `site-header` and music decoration partials.
- Rendered HTML no longer includes `particles.js` or `fireworks.js`.

## 2026-05-03 - Phase 2: Home And Blog List

Phase 1 checklist audit:

- Confirmed Phase 1 is now complete against `docs/blog-refactor-plan.md`.
- Filled the remaining Phase 1 gap by adding custom SVG icons to `assets/icons/`.

Phase 2 implementation:

- Rewrote `layouts/index.html` as a homepage with:
  - Hero section
  - Quote block
  - Latest posts grid
- Added reusable partials:
  - `layouts/partials/hero-section.html`
  - `layouts/partials/blog-card.html`
  - `layouts/partials/featured-post.html`
  - `layouts/partials/quote-block.html`
  - `layouts/partials/category-tabs.html`
- Added `layouts/_default/list.html` for the Blog list and taxonomy list views.
- Added client-side post filtering and search in `assets/ts/custom.ts`.
- Added second-stage SCSS modules:
  - `assets/scss/_hero.scss`
  - `assets/scss/_cards.scss`
- Updated `assets/scss/custom.scss` to import the new modules.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Local smoke checks passed for `/`, `/post/`, `/categories/`, and `/p/map--set/`.
- Homepage no longer renders the old Welcome jump-text block.
- Blog list renders featured post, category tabs, search input, and filterable article cards.

## 2026-05-03 - Home Concept Refinement

- Tuned the Home page against the provided `blog-home.png` concept.
- Updated the brand display to `Melody` while keeping the site title unchanged.
- Changed the Home hero copy to match the concept direction:
  - `Hi, I'm Melody.`
  - `A life in rhythm.`
- Reworked the Home hero composition toward the concept:
  - Left editorial intro
  - Central circular monochrome portrait
  - Right quote block
  - Staff-line decoration through the first viewport
- Adjusted Latest Posts spacing, heading, link label, and card proportions.
- Updated cards to use the first page bundle image as a fallback cover when front matter has no `image`.
- Overrode Stack's time-based color-scheme initializer so the default scheme follows the configured `light` default instead of switching by local time.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Desktop screenshot checked at `1920x1080`.
- Mobile smoke checked at `390x844`.
- No horizontal overflow detected in either viewport.

## 2026-05-03 - Blog Concept Refinement

- Tuned the Blog preview page against the provided `blog-blog.png` concept.
- Reworked the Blog list top area into a three-column editorial composition:
  - Left intro with `Stories in rhythm.`
  - Center featured post card with `Featured Post` label
  - Right quote block with music staff decoration
- Adjusted the featured post card to use a wide image-first layout and `Read more` action copy.
- Restyled the Blog filter/search row to match the concept direction with single-line category pills and an underline search input.
- Tightened Blog card proportions, grayscale image treatment, title note marks, and summary clamping.
- Restored the visible music-note icon inside the circular theme toggle.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- `/post/` desktop screenshot checked at `1920x1080`.
- `/post/` mobile smoke checked at `390x844`.
- No horizontal overflow detected in either viewport.

## 2026-05-03 - Phase 3: Blog Detail

- Rewrote `layouts/_default/single.html` as the Blog detail page layout.
- Added `layouts/partials/author-card.html` for the right-side author module.
- Restored and rewrote `layouts/partials/article/components/related-content.html` as a compact `More from this category` list.
- Added `assets/scss/_article.scss` and imported it from `assets/scss/custom.scss`.
- Added custom share/action icons:
  - `assets/icons/arrow-left.svg`
  - `assets/icons/brand-facebook.svg`
  - `assets/icons/brand-instagram.svg`
  - `assets/icons/mail.svg`
- Matched the provided `blog-blog详情页.png` concept direction with:
  - Back link
  - Center article header
  - Large grayscale cover image
  - Left share rail
  - Right quote, author card, and related posts
- Removed duplicate first body heading when it exactly matches the article title.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- `/p/redis-%E8%BF%9B%E9%98%B6/` desktop screenshot checked at `1920x1080`.
- `/p/redis-%E8%BF%9B%E9%98%B6/` mobile smoke checked at `390x844`.
- Detail page rendered back link, 4 share actions, cover image, author card, 3 related posts, and article content.
- No horizontal overflow detected in either viewport.
