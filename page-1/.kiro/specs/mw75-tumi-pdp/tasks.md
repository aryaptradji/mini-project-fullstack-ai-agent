# Implementation Plan: MW75 TUMI Product Detail Page

## Overview

Build a single-page product detail page using plain HTML, CSS, and JavaScript — no framework, no build tool. Output files are `index.html`, `style.css`, and `script.js` at the project root. All tasks are ordered so each step produces verifiable, integrated output that the next step builds upon.

## Tasks

- [x] 1. Project scaffolding — skeleton files and design tokens
  - [x] 1.1 Create `index.html` skeleton
    - Emit a valid HTML5 document with `<meta charset>`, `<meta name="viewport">`, `<title>MW75 TUMI</title>`, `<link rel="stylesheet" href="style.css">`, and `<script src="script.js" defer>` at the end of `<body>`
    - Add empty landmark placeholders (comments) for every section: announcement-bar, site-header, breadcrumb, product, features, service-info, brand-tumi, product-description, tech-specs, in-the-box, support, site-footer
    - Add `<div class="overlay"></div>` and `<div id="cart-drawer" …></div>` stubs before the closing `</body>`
    - _Requirements: 22.4_

  - [x] 1.2 Create `style.css` with CSS reset and design tokens
    - Add a minimal CSS reset (`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`)
    - Declare all custom properties on `:root` exactly as specified in the design document (colors, fonts, z-index layers, container margins)
    - Add `@font-face` declarations for `blenderbook`, `blendermedium`, `blenderbold` pointing to `fonts/` with `font-display: swap`; fallback chain `sans-serif`
    - Add `.container { margin: 0 var(--container-margin-desktop); }` and the `@media (max-width: 699px)` override
    - Add global `:focus-visible { outline: 2px solid var(--color-dark); outline-offset: 2px; }` rule
    - _Requirements: 2.2, 20.3_

  - [x] 1.3 Create `script.js` skeleton with `PRODUCT_DATA` and module stubs
    - Declare `PRODUCT_DATA` const with the full data object (name, subtitle, price, colors array with all images, features array, techSpecs array, inTheBox array) exactly as specified in the design document
    - Stub out `CartStore` object (state + method signatures, no logic yet)
    - Stub out `GalleryController` constructor (no logic yet)
    - Stub out `init()` function (empty, called from `DOMContentLoaded` in a `try/catch`)
    - _Requirements: 22.1, 22.6_

- [x] 2. Announcement bar, header, and breadcrumb
  - [x] 2.1 Announcement bar HTML + CSS
    - Add `<aside class="announcement-bar">` markup inside `index.html` with the exact text `FREE US GROUND SHIPPING ON ORDERS OF $99 OR MORE.`
    - Style: background `#1a1a1a`, color `#ffffff`, font `blenderbold`, size `14px`, line-height `14px`, `text-transform: uppercase`, padding `8px 0`, centered text
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Header HTML + CSS (desktop + mobile)
    - Add `<header class="site-header">` markup with three-column grid wrapper; logo placeholder, `<nav>` with 5 links, and `.site-header__actions` containing search, account, cart button with `<span id="cart-badge">0</span>`, country selector, and Support link — all Placeholder_Actions except the cart button
    - Apply `aria-label="Cart, 0 items"` and `aria-live="polite"` to `#cart-badge`
    - CSS: 3-col grid `396px 605px 396px`, gap `40px`, padding `10px 48px`, height `60px` desktop; `@media (max-width: 699px)` override to `70.5px 170px 70.5px`, gap `12px`, height `50px`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 2.3 Breadcrumb HTML + CSS
    - Add `<nav class="breadcrumb" aria-label="breadcrumbs">` with `<ol>` containing two `<li>` Placeholder_Action links: "All Products" and "MW75 TUMI"; use `aria-hidden="true"` on the separator character
    - CSS: font `blenderbook`, size `16px`, color `#1a1a1a`, margin `32px 0`; `@media (max-width: 699px)` sets `height: 0; overflow: hidden; margin: 0`
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 3. Product section layout and gallery
  - [x] 3.1 Product section grid layout HTML + CSS
    - Add `<section class="product">` with two children: `<div class="product__gallery">` and `<div class="product__info">`
    - CSS: desktop grid `785.938px 643.062px`, gap `48px`, padding `40px 0 72px 0`; `@media (max-width: 699px)` single column `1fr`, gap `20px 40px`, padding `0`
    - _Requirements: 20.1, 20.2_

  - [x] 3.2 Gallery HTML + CSS (viewport, track, slides, buttons, dots)
    - Populate `div.product__gallery` with: `div.gallery__viewport > ul.gallery__track > 4× li.gallery__slide > img[src][alt]` using Black color images from `PRODUCT_DATA` as initial values; prev/next `<button>` elements with correct `aria-label`; `<ol class="gallery__dots">` with 4 `<li>` dots, first has `aria-current="true"`
    - CSS: viewport `overflow: hidden`; track uses CSS grid with 4 columns (each `100%` of viewport width), `transform: translateX(0)`, `transition: transform 280ms ease`; image `width: 100%; aspect-ratio: 1/1; object-fit: contain`; gallery area `785.938px` desktop / `375px` mobile
    - _Requirements: 5.1, 5.2, 5.5, 5.6_

  - [x] 3.3 Implement `GalleryController` in `script.js`
    - Implement `GalleryController(galleryEl)` with `currentIndex` local state (0–3)
    - Implement `goTo(index)`: sets `currentIndex`, updates `gallery__track` `transform: translateX(calc(-100% * index))`, updates `aria-current` on dots
    - Implement `next()`: calls `goTo((currentIndex + 1) % 4)`
    - Implement `prev()`: calls `goTo((currentIndex + 3) % 4)`
    - Implement `loadColor(colorId)`: swaps all 4 `img[src]` and `img[alt]` from `PRODUCT_DATA`, calls `goTo(0)`
    - _Requirements: 5.3, 5.4_

  - [ ]* 3.4 Write property test for gallery wrap-around (Property 1)
    - Install `fast-check` as a dev dependency (or reference via CDN in a test HTML file)
    - **Property 1: Gallery wrap-around (circular navigation)**
    - Generator: `fc.integer({ min: 0, max: 3 })`, `fc.nat()`; for any `(startIndex, steps)` call `gallery.goTo(startIndex)`, repeat `next()` `steps` times, assert `currentIndex === (startIndex + steps) % 4`
    - **Validates: Requirements 5.3, 5.4**

- [x] 4. Color swatch component
  - [x] 4.1 Color swatch HTML + CSS
    - Add `<fieldset class="product__swatches">` inside `.product__info` with `<legend>` containing `<span>Color</span>` and `<span class="product__color-name">Black</span>`
    - Add two `<label class="swatch" data-color-id="…">` elements each wrapping `<input type="radio" name="color" value="…">` and a swatch dot; Black input has `checked`
    - CSS: swatch dot `20px × 20px`, `border-radius: 9999px`, `1px solid #4a4a4a`; `label.swatch:has(input:checked)::before` creates the `24px × 24px` ring via absolute positioning; color label font `blendermedium`, size `18px`, color `#1a1a1a`
    - _Requirements: 6.1, 6.2, 6.4, 6.6_

  - [x] 4.2 Color swatch JavaScript (change event handler)
    - In `init()`, bind a `change` event listener on `fieldset.product__swatches`
    - On change: read `colorId` from the checked input's value, update `.product__color-name` text to the matching `colorName` from `PRODUCT_DATA`, call `gallery.loadColor(colorId)`
    - Verify that `CartStore.items` is not touched during color selection
    - _Requirements: 6.3, 6.5_

- [x] 5. Product info panel, Add to Cart button, and error message
  - [x] 5.1 Product info panel HTML + CSS
    - Add `<h1 class="product__name">MW75 TUMI</h1>`, `<p class="product__subtitle">`, `<div class="product__price">$750.00</div>` inside `.product__info` (below the fieldset)
    - Add `<p class="product__error" hidden>The maximum quantity of this item is already in your cart.</p>` and `<button class="product__add-to-cart">Add to Cart</button>`
    - CSS — h1: font `blendermedium`, size `32px` desktop / `25px` mobile, letter-spacing `-0.64px` desktop / `-0.5px` mobile, color `#1a1a1a`; subtitle: font `blendermedium`, size `16px`, color `#4a4a4a`; price: font `blendermedium`, size `20px` desktop / `16px` mobile, color `#1a1a1a`; error: color `var(--color-error)` red; button: font `blenderbold`, size `18px` desktop / `20px` mobile, bg `#4a4a4a`, color `#fff`, border `2px solid #4a4a4a`, border-radius `0`, padding `24px 48px`, width `100%`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.4, 8.5_

  - [x] 5.2 Implement `CartStore` core logic in `script.js`
    - Implement `CartStore.items` as `new Map()`, `isOpen: false`
    - Implement `addItem(colorId)`: if already in map → show error element, return; else → hide error, build `CartItem` from `PRODUCT_DATA`, `items.set(colorId, item)`, call `openDrawer()`, call `render()`
    - Implement `removeItem(colorId)`: `items.delete(colorId)`, call `render()`
    - Implement `openDrawer()`: save `document.activeElement`, set `isOpen = true`, call `render()`, use `requestAnimationFrame` to focus first focusable element in drawer
    - Implement `closeDrawer(returnFocusEl)`: set `isOpen = false`, call `render()`, call `returnFocusEl?.focus()`
    - Implement `getTotalCount()`: returns `items.size`
    - Implement `getTotalPrice()`: returns `items.size * 750.00`
    - _Requirements: 8.1, 8.2, 10.1, 10.2, 10.3, 11.1, 22.2, 22.3_

  - [ ]* 5.3 Write property tests for CartStore core (Properties 2, 3, 4)
    - **Property 2: addItem grows the cart by exactly one**
    - Generator: `fc.constantFrom('black', 'silver')` filtered to colorIds not in cart; assert `items.size === prevSize + 1 && items.has(colorId)`
    - **Validates: Requirements 8.1, 22.2**
    - **Property 3: addItem is idempotent at max quantity**
    - Precondition: `addItem(colorId)` once; then `addItem(colorId)` again; assert `items.size` and `items.get(colorId).qty` unchanged
    - **Validates: Requirements 8.2, 22.2**
    - **Property 4: removeItem produces a cart without the removed item**
    - Generator: `fc.constantFrom('black', 'silver')`, precondition: item in cart; assert `!items.has(colorId) && items.size === prevSize - 1`
    - **Validates: Requirements 11.1, 11.2**

- [x] 6. Cart drawer HTML, CSS, and render logic
  - [x] 6.1 Cart drawer HTML + CSS
    - Add `<div id="cart-drawer" class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">` with `div.cart-drawer__header` (containing `<h2 id="cart-drawer-title">Cart (0)</h2>` and close `<button aria-label="Close cart">`) and `div.cart-drawer__body`
    - Add `.overlay` div before the drawer in `index.html`
    - CSS: drawer `position: fixed; top: 0; right: 0; height: 100vh; width: 420px; transform: translateX(100%); transition: transform 280ms ease; z-index: var(--z-cart-drawer); overflow-y: auto; background: #fff`; `.cart-drawer.is-open { transform: translateX(0) }`; `@media (max-width: 699px)` `width: 100vw`; overlay `position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: var(--z-overlay); display: none`; `.overlay.is-visible { display: block }`
    - _Requirements: 9.1, 9.7, 9.8_

  - [x] 6.2 Implement `CartStore.render()` in `script.js`
    - Update `#cart-badge` `textContent` and `aria-label="Cart, N items"`
    - Toggle `is-open` class on `.cart-drawer` and `is-visible` on `.overlay`
    - Update `cart-drawer-title` text to `Cart (n)`
    - Rebuild `.cart-drawer__body` `innerHTML`: when empty render the empty-state template; when items > 0 render `<ul class="cart-items">` with one `<li class="cart-item">` per entry plus the footer block (totals, note, View Cart, Checkout) — all Placeholder_Actions
    - Include `data-action="remove"` and `data-color-id` on Remove buttons; `aria-label="Remove {colorName} MW75 TUMI"`
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 6.3 Cart drawer JavaScript — open/close, focus trap, ESC, overlay
    - In `init()`, bind close button click → `CartStore.closeDrawer(lastFocusedEl)`
    - Bind `document.keydown` → if `Escape` and drawer open → `CartStore.closeDrawer(lastFocusedEl)`
    - Bind overlay click → `CartStore.closeDrawer(lastFocusedEl)`
    - Bind cart icon click → `CartStore.openDrawer()`
    - Implement focus trap in drawer `keydown Tab`: if Shift+Tab on first focusable → wrap to last; if Tab on last focusable → wrap to first; use `focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'`
    - Bind event delegation on `#cart-drawer` for `[data-action="remove"]` clicks → `CartStore.removeItem(colorId)` and `.js-placeholder` clicks → `e.preventDefault()`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 21.2, 21.3_

  - [ ]* 6.4 Write property test for color switch does not mutate cart (Property 5)
    - **Property 5: Color switch does not mutate cart**
    - Generator: `fc.constantFrom('black', 'silver')` × 2 for initial and selected color; `fc.boolean()` for whether cart starts with an item
    - Serialize `CartStore.items` before and after triggering the swatch `change` event; assert serialized state is identical
    - **Validates: Requirements 6.5**

- [x] 7. Add to Cart button wiring and error message
  - [x] 7.1 Wire Add to Cart button in `init()`
    - Bind `button.product__add-to-cart` click → read checked radio value as `colorId` → call `CartStore.addItem(colorId)`
    - Verify error element is hidden on page load (via `hidden` attribute)
    - Verify error is shown when duplicate add is attempted (`.product__error` `hidden` removed) and hidden again after successful re-add post-removal
    - _Requirements: 8.1, 8.2, 8.6_

- [x] 8. Checkpoint — core interactivity complete
  - Ensure `index.html` opens in a browser without console errors, the gallery slides with prev/next, color swatches switch images, Add to Cart opens the drawer, Remove empties the cart, Close and ESC dismiss the drawer, and Cart_Badge reflects item count.
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Static content sections
  - [x] 9.1 Key Features section HTML + CSS
    - Add `<section class="features">` with a `<ul>` containing exactly six `<li>` items (feature text + SVG icon placeholder per feature from `PRODUCT_DATA.features`)
    - CSS: flex layout per item, gap `5px`, font `blendermedium`, size `16px`, line-height `16px`, color `#1a1a1a`
    - _Requirements: 12.1, 12.2_

  - [x] 9.2 Service Info section HTML + CSS
    - Add `<section class="service-info">` with a 3-item grid: Free Shipping, Free Returns, Product Protection — each with heading and description
    - CSS: headings font `blendermedium`, size `26px`, letter-spacing `-0.52px`, color `#1a1a1a`; body font `blenderbook`, size `18px`, line-height `21.6px`, color `#141414`
    - _Requirements: 13.1, 13.2, 13.3_

  - [x] 9.3 Brand TUMI section HTML + CSS
    - Add `<section class="brand-tumi">` with `<img src="assets/images/sections/TUMI_Brand.png">`, heading, and description paragraph
    - CSS: section heading font `blendermedium`, size `41.008px`, letter-spacing `-0.82px`, color `#1a1a1a`
    - _Requirements: 14.1, 14.2_

  - [x] 9.4 Product Description section HTML + CSS
    - Add `<section class="product-description">` with heading `MW75 Active Noise-Cancelling Wireless Headphones`, `<img src="assets/images/sections/MW75B_TUMI_Feature.png">`, body paragraphs, `Learn more` Placeholder_Action inline link, and `Discover the full TUMI collaboration` Placeholder_Action link
    - CSS: body paragraphs font `blenderbook`, size `18px`, line-height `22.5px`, color `#000000`; Learn more: `display: inline`
    - _Requirements: 15.1, 15.2, 15.3_

  - [x] 9.5 Tech Specs section HTML + CSS
    - Add `<section class="tech-specs">` with three `<details><summary>` accordion groups: Materials and Design, Sound and Features, Connectivity and Charging — each containing a `<table>` or `<dl>` with all attribute-value rows from `PRODUCT_DATA.techSpecs`
    - CSS: `<summary>` font `blendermedium`, size `16px`, letter-spacing `-0.32px`, `text-transform: uppercase`, color `#4a4a4a`, `display: flex`, gap `10px`
    - _Requirements: 16.1, 16.2, 16.3_

  - [x] 9.6 In The Box section HTML + CSS
    - Add `<section class="in-the-box">` with a 7-item grid, each item containing `<img src="…">` and `<p>` name, using all seven entries from `PRODUCT_DATA.inTheBox`
    - CSS: background `#ffffff`; item name font `blenderbook`, size `16px`, color `#4a4a4a`
    - _Requirements: 17.1, 17.2, 17.3_

  - [x] 9.7 Support section HTML + CSS
    - Add `<section class="support">` with `<img src="assets/images/sections/Support_Banner.jpg">`, heading `Need support? We're here to assist you every step of the way.`, and `<button class="btn btn--support">Support Center</button>` as a Placeholder_Action
    - CSS: background `#fafafa`, padding `32px`, margin-top `20px`; heading font `blendermedium`, size `41.008px`, letter-spacing `-0.82px`, color `#4a4a4a`; button font `blenderbold`, size `18px` desktop / `16px` mobile, bg `#1a1a1a`, color `#fff`, border `2px solid #1a1a1a`, border-radius `0`, padding `16px 30px`, margin-top `32px` desktop / `24px` mobile; `@media (max-width: 699px)` flex-direction column
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [x] 9.8 Footer HTML + CSS
    - Add `<footer class="site-footer">` with multi-column link groups (Help & Info, About, Gifting), legal links, social media icons, address, and copyright text — all Placeholder_Actions
    - CSS: background `#000000`, color `#ffffff`, font `blenderbook`, padding `72px 0` desktop / `32px 0` mobile; nav links size `20px`, line-height `30px`; legal/small text size `16px`, line-height `20.8px`
    - _Requirements: 19.1, 19.2, 19.3, 19.4_

- [x] 10. Checkpoint — full page content
  - Open `index.html` in a browser and verify all 13 sections are visible with correct content: announcement bar, header, breadcrumb, product (gallery + info), features, service info, brand TUMI, description, tech specs (all 3 accordions expand), in-the-box (7 items), support, footer.
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Responsive layout, accessibility, and final polish
  - [x] 11.1 Responsive layout verification and polish
    - At `375px` viewport: single-column product section, full-width cart drawer, no horizontal scroll on any section, breadcrumb hidden, mobile font sizes applied for h1/price/support button
    - At `1440px` viewport: two-column product grid, 420px cart drawer, correct header grid columns
    - Fix any overflow issues using `max-width: 100%; overflow-x: hidden` where needed
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 9.8_

  - [x] 11.2 Accessibility pass — ARIA attributes, focus indicators, keyboard navigation
    - Audit every interactive element against the ARIA table in the design document: `#cart-badge` `aria-live="polite"` + `aria-label`, `#cart-drawer` `role="dialog" aria-modal="true"`, gallery button `aria-label`, dot `aria-current`, remove button `aria-label`, breadcrumb `aria-label="breadcrumbs"`, swatch `input[type="radio"]`
    - Verify `:focus-visible` ring is visible on all focusable elements
    - Verify Tab order: announcement → header (cart icon) → product controls (swatches, gallery buttons, add to cart) → static sections → footer
    - Verify Escape closes drawer and focus returns to cart icon
    - Verify screen-reader-only `aria-hidden="true"` separator in breadcrumb
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 3.5, 5.5, 6.6, 9.1_

  - [x] 11.3 Error handling — init() try/catch and missing image fallback
    - Confirm `init()` is wrapped in `DOMContentLoaded` listener with `try/catch` that logs errors but leaves static HTML intact
    - Add `onerror` or CSS background-color fallback on `<img>` elements to prevent broken-image icons from disrupting layout
    - _Requirements: 22.6_

  - [ ]* 11.4 Run all property-based tests (Properties 1–5)
    - Execute the fast-check test suite and confirm all 5 properties pass with ≥ 100 iterations each
    - **Validates: Requirements 5.3, 5.4, 6.5, 8.1, 8.2, 11.1, 11.2, 22.2**

- [ ] 12. Final checkpoint — acceptance criteria smoke test
  - Manually verify AC-01 through AC-22 against the requirements document:
    - AC-01: all page sections visible on load
    - AC-02: initial state (Black selected, $750, badge 0, drawer closed)
    - AC-03/AC-04: swatch switches gallery and color label
    - AC-05/AC-06: gallery wraps on next/prev at boundary
    - AC-07: Add to Cart opens drawer with correct item
    - AC-08: duplicate add shows error, no drawer open
    - AC-09: color switch does not affect cart
    - AC-10: Quantity shows as 1, no increment control
    - AC-11: Total shown as `$750.00 USD`
    - AC-12: remove → empty state message
    - AC-13: remove then re-add → no error message
    - AC-14: Close button dismisses drawer + overlay
    - AC-15: Cart icon opens drawer
    - AC-16: View Cart and Checkout are Placeholder_Actions
    - AC-17: all 3 tech spec groups with complete data
    - AC-18: all 7 In The Box items visible
    - AC-19: no horizontal scroll at 375px
    - AC-20: two-column layout at 1440px
    - AC-21: full keyboard nav; Tab, Shift+Tab, Esc all work; focus trap in drawer
    - AC-22: page reload resets all state
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP build
- All `<a href="#">` links use `e.preventDefault()` — no navigation occurs
- Font files (`blenderbook.woff2`, etc.) go in a `fonts/` directory at the project root; until available, `sans-serif` fallback is acceptable
- Cart state is in JS memory only — no `localStorage`, no `sessionStorage`
- The `GalleryController` CSS transition (`transform 280ms ease`) is handled entirely in CSS; JavaScript only sets `style.transform`
- Property tests use fast-check; they can be run in Node.js (`node --experimental-vm-modules`) or via a browser test harness HTML file
- Tasks 3.3, 5.2, 6.2, 6.3, and 7.1 all modify `script.js` — they are sequenced to avoid conflicts
- Tasks 3.2, 6.1, 9.1–9.8 all add HTML sections to `index.html` — add them in document order

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "3.1"] },
    { "id": 2, "tasks": ["3.2", "4.1", "5.1", "6.1"] },
    { "id": 3, "tasks": ["3.3", "4.2", "5.2", "6.2"] },
    { "id": 4, "tasks": ["3.4", "5.3", "6.3", "7.1"] },
    { "id": 5, "tasks": ["6.4", "9.1", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7", "9.8"] },
    { "id": 6, "tasks": ["11.1", "11.2", "11.3"] },
    { "id": 7, "tasks": ["11.4"] }
  ]
}
```
