# Changelog

## 2026-05-04 - Blog Detail Reading And Code Block Refinement

- Increased Blog detail title, summary, body text, headings, and reading column width for a more comfortable article page.
- Reworked article code blocks into a cleaner editorial code surface with larger monospace text and more breathing room.
- Disabled Hugo code-block line numbers in `hugo.yaml`.
- Added CSS fallback rules to hide existing Chroma line-number table/spans in rendered detail pages.
- Hid the Stack-generated copy bubble on Blog detail code blocks so the block has no floating message-style control.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Browser check on a code-heavy Blog detail page confirmed no rendered `.lnt`, `.ln`, or line-number table column is visible.
- Code block font size increased and the copy bubble no longer renders in Blog detail code blocks.

## 2026-05-04 - Blog Card Hover Motion Refinement

- Refined Blog card hover states with a clearer editorial lift, stronger but restrained shadow, subtle image push, content follow-through, bottom hairline reveal, arrow movement, and a slightly more expressive title note.
- Applied the same interaction language to featured Blog cards for consistency.
- Kept all hover transitions at or below 460ms and avoided image filters so uploaded and post images keep their original colors.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Browser hover check confirmed Blog cards and featured cards animate transform, image movement, arrow movement, and the bottom hairline reveal.
- Rendered Blog images still compute `filter: none`.

## 2026-05-04 - Phase 5: Responsive Refinements And Motion

- Added `assets/scss/_animations.scss` and wired it into `assets/scss/custom.scss`.
- Added restrained page entry, scroll reveal, title note hover, timeline node reveal, card/link hover, FAQ content, and staff-line parallax motion.
- Kept motion lightweight and below the Phase 5 500ms cap, with reduced-motion fallbacks.
- Strengthened responsive behavior in `assets/scss/_responsive.scss`, including mobile page widths, post media ratios, Music album grids, and compact form/list layouts.
- Expanded mobile navigation behavior in `layouts/partials/footer/custom.html`:
  - body scroll lock while open
  - outside-click close
  - Escape close
  - automatic close when returning to desktop width
- Deleted legacy visual scripts from `static/js/`:
  - `avatar-colors.js`
  - `fireworks.js`
  - `particles.js`

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Generated 96 pages and processed 702 images.
- Browser automation checked 7 routes across desktop, tablet, and mobile viewports.
- No horizontal overflow detected on checked routes.
- All checked rendered images computed `filter: none`.
- Rendered HTML includes no `particles.js`, `fireworks.js`, or `avatar-colors.js` script references.
- Mobile navigation opens, sets `aria-expanded="true"`, locks body scroll, and closes from outside click.
- Staff-line parallax and scroll reveal initialize in the browser.
- Music page still renders no `audio`, `video`, player, playlist, progress, or playback-control UI.

## 2026-05-04 - Global Image Color Reset

- Removed project-level grayscale filters from real image surfaces across:
  - Home and Blog cards
  - Featured Blog images
  - Blog detail cover images
  - Blog detail inline images
  - Related post thumbnails
  - Author and page portrait images
  - Journal entry images
  - Legacy list thumbnails
  - Music page image slots
- Kept non-image decorative music elements unchanged.
- Updated the image styling baseline so newly added real images render in their original colors by default.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Source search found no remaining `grayscale()` in project-level `assets`, `layouts`, or `content`.
- Browser verification checked Home, Blog, Blog detail, About, Journal, Music, and Contact.
- All rendered `<img>` elements on checked pages computed `filter: none`.
- No horizontal overflow detected.
- Music page verification found no `audio`, `video`, or player/progress UI elements.

## 2026-05-04 - Music Favorite Album Cover Ratio

- Adjusted Favorite Albums cover generation from `220x160` to `260x260` square crops.
- Updated Music page CSS so Favorite Albums covers use a stable square aspect ratio and are not stretched by generated image dimensions.
- Preserved original cover colors for uploaded album images.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Music desktop screenshot checked at `1920x1080`.
- Music mobile smoke screenshot checked at `390x844`.
- Favorite Albums covers measured as square in the rendered desktop layout.
- No horizontal overflow detected.
- Music page verification found no `audio`, `video`, or player/progress UI elements.

## 2026-05-04 - Music Album Cover Color Refinement

- Updated `assets/scss/_music.scss` so uploaded Music cover images keep their original colors.
- Kept grayscale treatment for other editorial images and code-native music panels.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Music desktop screenshot checked at `1920x1080`.
- Music mobile smoke screenshot checked at `390x844`.
- All 5 uploaded Music cover images now compute `filter: none`.
- No horizontal overflow detected.
- Music page verification found no `audio`, `video`, or player/progress UI elements.

## 2026-05-04 - Music Album Cover Upload

- Copied five supplied album images into the Music page bundle:
  - `content/page/music/album-1.jpg`
  - `content/page/music/album-2.jpg`
  - `content/page/music/album-3.jpg`
  - `content/page/music/album-4.jpg`
  - `content/page/music/album-5.jpg`
- Added `layouts/partials/music-cover.html` so Music cards can render real page-bundle images with a code-native fallback.
- Updated `content/page/music/index.md` with `image` and `alt` fields for the supplied covers.
- Updated `layouts/page/music.html` to render real images in Favorite Albums and Recommended Records.
- Kept the monochrome editorial treatment by styling the uploaded covers through the existing Music page visual system.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Generated 96 pages and processed 702 images.
- Music desktop screenshot checked at `1920x1080`.
- Music mobile smoke screenshot checked at `390x844`.
- Music page rendered 3 Favorite Album cover images and 2 Recommended Record cover images.
- No horizontal overflow detected.
- Music page verification found no `audio`, `video`, or player/progress UI elements.

## 2026-05-04 - Music Page Content Refinement

- Refined the Music page so the content no longer reuses Blog post titles, images, or links.
- Added Music-specific structured content in `content/page/music/index.md` for:
  - Original lyric fragments
  - Favorite albums and composers
  - Songwriter notes
  - Recommended records
  - Curated music inspirations
- Reworked `layouts/page/music.html` to read Music page data from front matter instead of querying regular Blog posts.
- Replaced Blog-sourced thumbnails with code-native monochrome music art tiles in `assets/scss/_music.scss`.
- Kept the page editorial and non-player-oriented: no audio, playback, progress, playlist, or streaming UI was added.

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Generated 96 pages and processed 697 images.
- Music desktop screenshot checked at `1920x1080`.
- Music mobile smoke screenshot checked at `390x844`.
- No horizontal overflow detected.
- Music content area has no `/post/` links and no Blog post images.
- Music page verification found no `audio`, `video`, or player/progress UI elements.

## 2026-05-04 - Phase 4: About, Journal, Music, And Contact

- Added lightweight content entries for the remaining primary routes:
  - `content/page/about/index.md`
  - `content/page/journal/index.md`
  - `content/page/music/index.md`
  - `content/page/contact/index.md`
- Added project-level page templates:
  - `layouts/page/about.html`
  - `layouts/page/journal.html`
  - `layouts/page/music.html`
  - `layouts/page/contact.html`
- Added `layouts/partials/page-cover.html` as a reusable cover helper with image-resource fallback support.
- Added Phase 4 SCSS modules:
  - `assets/scss/_about.scss`
  - `assets/scss/_journal.scss`
  - `assets/scss/_music.scss`
  - `assets/scss/_contact.scss`
- Imported the Phase 4 modules from `assets/scss/custom.scss`.
- Added small line icons for Phase 4 page accents:
  - `assets/icons/leaf.svg`
  - `assets/icons/heart.svg`
  - `assets/icons/pencil.svg`
  - `assets/icons/map-pin.svg`
  - `assets/icons/plus.svg`
- Matched the provided About, Journal, Music, and Contact concept directions with:
  - Editorial hero layouts
  - Circular monochrome author image treatment
  - Timeline-style Journal entries
  - Multi-column Music editorial sections without playback controls
  - Contact form, contact details, and FAQ rows

Verification:

- `.\hugo.exe -D --printI18nWarnings --printPathWarnings` passed.
- Generated 96 pages and processed 711 images.
- `/about/`, `/journal/`, `/music/`, and `/contact/` returned HTTP 200.
- Desktop screenshots checked at `1920x1080`.
- Mobile smoke screenshots checked at `390x844`.
- No horizontal overflow detected on the four Phase 4 pages.
- Music page verification found no `audio`, `video`, or player/progress UI elements.

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
