# Design Document — MW75 TUMI Product Detail Page

## Overview

The MW75 TUMI Product Detail Page is a single static HTML page that lets prospective buyers explore a premium headphone product, select a color variant, and add it to a cart drawer — all without a server, build tool, or framework.

The page ships as three files at the project root:

```
index.html   — markup and structure
style.css    — all visual styles
script.js    — product data + all interactive behavior
```

Everything is driven by a small cart state machine in `script.js`. The cart lives in JavaScript memory only and resets on reload. All product data is hard-coded in the same file.

---

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────┐
│  index.html                             │
│  ├── <link rel="stylesheet" …>          │
│  └── <script src="script.js" …>        │  (defer)
└─────────────────────────────────────────┘

script.js
├── PRODUCT_DATA         (static data object)
├── CartStore            (state machine + mutators)
├── GalleryController    (per-instance gallery logic)
└── init()               (bootstraps event listeners + first render)
```

### Data Flow

```
User action (click / keydown)
  → Event listener in init()
  → CartStore mutator  (addItem / removeItem / openDrawer / closeDrawer)
  → CartStore.render() (writes to DOM)
```

Gallery navigation is self-contained: `GalleryController` holds the current index as local state and updates the gallery DOM directly without touching `CartStore`.

### Rendering Strategy

There is no virtual DOM or templating library. All rendering is **imperative DOM manipulation**:
- `innerHTML` is used for the cart drawer contents (rebuilt on each state change)
- Individual element attributes (class, `aria-*`, `textContent`) are set directly for smaller updates

No `innerHTML` is used on any element that accepts user-typed input.

---

## Components and Interfaces

### 1. Announcement Bar

**HTML element:** `<aside class="announcement-bar">`

Purely static. Rendered in HTML, no JavaScript interaction.

```
aside.announcement-bar
  └── div.announcement-bar__inner
        └── p  "FREE US GROUND SHIPPING ON ORDERS OF $99 OR MORE."
```

---

### 2. Header

**HTML element:** `<header class="site-header">`

```
header.site-header
  └── div.site-header__wrapper          (3-col grid)
        ├── div.site-header__logo       (Placeholder_Action <a>)
        ├── nav.site-header__nav        (ul > li > a × 5, Placeholder_Actions)
        └── div.site-header__actions
              ├── button.site-header__icon  (search, Placeholder_Action)
              ├── button.site-header__icon  (account, Placeholder_Action)
              ├── button.site-header__cart  (cart icon + badge)
              │     └── span#cart-badge    "0"
              ├── button.site-header__icon  (country "US", Placeholder_Action)
              └── a.site-header__support    (Placeholder_Action)
```

**Key behavior:** `button.site-header__cart` triggers `CartStore.openDrawer()`. `#cart-badge` is updated by `CartStore.render()` and carries `aria-label="Cart, X items"` and `aria-live="polite"`.

**Layout:** 3-column CSS grid.

| Viewport | Columns | Gap | Padding |
|---|---|---|---|
| Desktop ≥1000px | `396px 605px 396px` | `40px` | `10px 48px` |
| Mobile ≤699px | `70.5px 170px 70.5px` | `12px` | `10px 20px` |

Height: `60px` desktop / `50px` mobile.

---

### 3. Breadcrumb

**HTML element:** `<nav class="breadcrumb" aria-label="breadcrumbs">`

```
nav.breadcrumb[aria-label="breadcrumbs"]
  └── ol.breadcrumb__list
        ├── li > a[href="#"]  "All Products"
        └── li > a[href="#"]  "MW75 TUMI"
```

Hidden on mobile via `height: 0; overflow: hidden; margin: 0`. Uses `aria-hidden="true"` on the separator character.

---

### 4. Product Section

**HTML element:** `<section class="product">`

Two-column grid on desktop, single column on mobile.

```
section.product
  ├── div.product__gallery    (GalleryController target)
  └── div.product__info
        ├── h1.product__name
        ├── p.product__subtitle
        ├── div.product__price
        ├── fieldset.product__swatches  (color picker)
        ├── p.product__error            (hidden by default)
        └── button.product__add-to-cart
```

**Grid spec:**

| Viewport | Columns | Gap | Padding |
|---|---|---|---|
| Desktop ≥1000px | `785.938px 643.062px` | `48px` | `40px 0 72px 0` |
| Mobile ≤699px | `1fr` | `20px 40px` | `0` |

---

### 5. Gallery Component

**HTML structure inside `div.product__gallery`:**

```
div.product__gallery
  ├── div.gallery__viewport           (overflow: hidden)
  │     └── ul.gallery__track        (CSS grid, 4 items side-by-side)
  │           ├── li.gallery__slide > img[src][alt]
  │           ├── li.gallery__slide > img[src][alt]
  │           ├── li.gallery__slide > img[src][alt]
  │           └── li.gallery__slide > img[src][alt]
  ├── button.gallery__btn.gallery__btn--prev  aria-label="Previous photo"
  ├── button.gallery__btn.gallery__btn--next  aria-label="Next photo"
  └── ol.gallery__dots
        └── li.gallery__dot[aria-current] × 4
```

**GalleryController interface:**

```
GalleryController(galleryEl)
  .currentIndex : number        // 0–3, local state
  .goTo(index)                  // update track transform + dots
  .next()                       // (currentIndex + 1) % 4
  .prev()                       // (currentIndex + 3) % 4
  .loadColor(colorId)           // swap img[src]+[alt] for all 4 slides, reset to index 0
```

**CSS transition:** The `.gallery__track` uses `transform: translateX(calc(-100% * currentIndex))` with `transition: transform 280ms ease`. No JavaScript animation — CSS handles the slide motion.

**Image dimensions:**

| Viewport | Width × Height |
|---|---|
| Desktop | `785.938px × 785.938px` |
| Mobile | `375px × 375px` |

Each `<img>` has `width: 100%; aspect-ratio: 1 / 1; object-fit: contain`.

---

### 6. Color Swatch Component

**HTML structure inside `fieldset.product__swatches`:**

```
fieldset.product__swatches
  └── legend.product__swatches-label
        ├── span  "Color"
        └── span.product__color-name  "Black"   (updated on selection)
  ├── label.swatch[data-color-id="black"]
  │     └── input[type="radio"][name="color"][value="black"][checked]
  └── label.swatch[data-color-id="silver"]
        └── input[type="radio"][name="color"][value="silver"]
```

**Why `<fieldset>` + `<input type="radio">`:** Provides semantic grouping and built-in keyboard navigation (arrow keys move between options) with zero JavaScript for the selection pattern. Screen readers announce "Color, Black, selected" automatically.

**Active ring indicator:** CSS `::before` on `label.swatch`:

```css
label.swatch input:checked ~ .swatch__inner::before {
  /* 24×24px ring via outline or box-shadow, centered on 20×20px dot */
}
```

Or equivalently via `:has()`:

```css
label.swatch:has(input:checked)::before {
  content: '';
  position: absolute;
  width: 24px; height: 24px;
  border-radius: 9999px;
  border: 1px solid #4a4a4a;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
```

The `label.swatch` itself is `position: relative`.

**Event:** `change` event on the `fieldset` (delegated). On change, update `.product__color-name` text and call `gallery.loadColor(colorId)`.

---

### 7. Cart State Machine

The cart is a plain JavaScript object — no class is required, though the design uses object literal notation for clarity.

#### State Shape

```js
const CartStore = {
  // State
  items: new Map(),   // key: colorId (string), value: CartItem
  isOpen: false,

  // CartItem shape:
  // {
  //   colorId: string,        e.g. 'black'
  //   colorName: string,      e.g. 'Black'
  //   name: string,           'MW75 TUMI'
  //   price: number,          750.00
  //   qty: number,            always 1
  //   imgSrc: string,         hero image path for this color
  //   imgAlt: string
  // }
};
```

#### Methods

```
CartStore.addItem(colorId)
  IF items.has(colorId):
    show error message on Add_to_Cart_Button
    RETURN (do not open drawer)
  ELSE:
    hide error message
    items.set(colorId, buildCartItem(colorId))
    openDrawer()
  render()

CartStore.removeItem(colorId)
  items.delete(colorId)
  render()

CartStore.openDrawer()
  isOpen = true
  render()
  moveFocusToDrawer()

CartStore.closeDrawer(returnFocusEl)
  isOpen = false
  render()
  returnFocusEl.focus()

CartStore.getTotalCount()
  RETURN items.size

CartStore.getTotalPrice()
  RETURN items.size * 750.00  // always 750 per item, qty always 1

CartStore.render()
  update #cart-badge textContent + aria-label
  update .cart-drawer class (open/closed)
  update .overlay class (visible/hidden)
  rebuild .cart-drawer__body innerHTML
```

#### render() — Cart Drawer HTML Template

When `items.size === 0`:

```html
<div class="cart-drawer__empty">
  <p>Your cart is empty</p>
  <a href="#" class="btn btn--secondary js-placeholder">Continue shopping</a>
</div>
```

When `items.size > 0` — one item block per Map entry:

```html
<ul class="cart-items">
  <li class="cart-item" data-color-id="black">
    <img src="…" alt="…" class="cart-item__img">
    <div class="cart-item__details">
      <p class="cart-item__name">MW75 TUMI</p>
      <p class="cart-item__color">Black</p>
      <p class="cart-item__price">$750.00</p>
      <p class="cart-item__qty">Quantity: 1</p>
    </div>
    <button class="cart-item__remove" data-color-id="black" aria-label="Remove Black MW75 TUMI">
      Remove
    </button>
  </li>
</ul>
<div class="cart-drawer__footer">
  <div class="cart-drawer__totals">
    <span>Total</span>
    <span>$750.00 USD</span>
  </div>
  <p class="cart-drawer__note">Taxes and shipping calculated at checkout</p>
  <a href="#" class="btn btn--secondary js-placeholder">View Cart</a>
  <a href="#" class="btn btn--primary js-placeholder">Checkout</a>
</div>
```

---

### 8. Cart Drawer

**HTML element:** `<div id="cart-drawer" class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">`

```
div#cart-drawer.cart-drawer[role="dialog"][aria-modal="true"]
  ├── div.cart-drawer__header
  │     ├── h2.cart-drawer__title  "Cart (n)"
  │     └── button.cart-drawer__close  aria-label="Close cart"
  └── div.cart-drawer__body     (rebuilt by CartStore.render())
```

**CSS positioning:**

```css
.cart-drawer {
  position: fixed;
  top: 0; right: 0;
  height: 100vh;
  width: 420px;                          /* desktop */
  transform: translateX(100%);           /* hidden state */
  transition: transform 280ms ease;
  z-index: 200;
  overflow-y: auto;
  background: #fff;
}
.cart-drawer.is-open {
  transform: translateX(0);
}
@media (max-width: 699px) {
  .cart-drawer { width: 100vw; }         /* full-width on mobile */
}
```

**Overlay:**

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 199;
  display: none;
}
.overlay.is-visible { display: block; }
```

---

### 9. Additional Static Sections

These sections have no JavaScript behavior. They are written directly in `index.html` as static HTML.

| Section | HTML element | Notes |
|---|---|---|
| Key Features | `<section class="features">` | `<ul>` with SVG icons + text |
| Service Info | `<section class="service-info">` | 3-item grid |
| Brand TUMI | `<section class="brand-tumi">` | Image + prose |
| Product Description | `<section class="product-description">` | Image + prose + Placeholder_Action links |
| Tech Specs | `<section class="tech-specs">` | 3× `<details><summary>` accordions |
| In The Box | `<section class="in-the-box">` | 7-item grid with images |
| Support | `<section class="support">` | Image + heading + button |
| Footer | `<footer class="site-footer">` | Multi-col links + legal |

---

## Data Models

All product data is defined in `script.js` before `CartStore` and `init()`.

### PRODUCT_DATA

```js
const PRODUCT_DATA = {
  name: 'MW75 TUMI',
  subtitle: 'Noise-Cancelling Wireless Headphones',
  price: 750.00,
  priceFormatted: '$750.00',
  priceTotalFormatted: '$750.00 USD',

  colors: [
    {
      id: 'black',
      name: 'Black',
      swatchHex: '#000000',
      images: [
        { src: 'assets/images/gallery/MW75B_Hero.png',      alt: 'MW75 TUMI Black — Hero view' },
        { src: 'assets/images/gallery/MW75B_Front.png',     alt: 'MW75 TUMI Black — Front view' },
        { src: 'assets/images/gallery/MW75B_Engraving.png', alt: 'MW75 TUMI Black — Engraving detail' },
        { src: 'assets/images/gallery/MW75B_Straight.png',  alt: 'MW75 TUMI Black — Side view' },
      ],
    },
    {
      id: 'silver',
      name: 'Silver',
      swatchHex: '#e1e1e1',
      images: [
        { src: 'assets/images/gallery/MW75S_Hero.png',      alt: 'MW75 TUMI Silver — Hero view' },
        { src: 'assets/images/gallery/MW75S_Front.png',     alt: 'MW75 TUMI Silver — Front view' },
        { src: 'assets/images/gallery/MW75S_Engraving.png', alt: 'MW75 TUMI Silver — Engraving detail' },
        { src: 'assets/images/gallery/MW75S_Straight.png',  alt: 'MW75 TUMI Silver — Side view' },
      ],
    },
  ],

  features: [
    { text: 'ANC (Active Noise Cancellation)',                       icon: 'icon-anc' },
    { text: 'Anodized aluminum, tempered glass and lambskin leather', icon: 'icon-material' },
    { text: '40mm beryllium drivers',                                 icon: 'icon-driver' },
    { text: '32 hours of listening',                                  icon: 'icon-battery' },
    { text: 'Bluetooth® 5.1',                                         icon: 'icon-bluetooth' },
    { text: '4 beamforming microphones',                              icon: 'icon-mic' },
  ],

  techSpecs: [
    {
      group: 'Materials and Design',
      rows: [
        { attr: 'Materials',   value: 'Lambskin leather headband and ear pads; anodized aluminum controls' },
        { attr: 'Dimensions',  value: '160.75mm x 197.83mm x 83.57mm' },
        { attr: 'Weight',      value: '338g' },
        { attr: 'Ear Coupling', value: 'Over-Ear' },
        { attr: 'Ear Pads',    value: 'Memory foam with lambskin leather, magnetic and replaceable' },
      ],
    },
    {
      group: 'Sound and Features',
      rows: [
        { attr: 'Drivers',        value: '40mm beryllium' },
        { attr: 'Impedance',      value: '32 Ohms' },
        { attr: 'Talk Microphones', value: '4 microphones with wind protection' },
        { attr: 'ANC Microphones', value: '4 microphones' },
        { attr: 'Voice Assistant', value: 'Compatible with built-in device voice assistants' },
      ],
    },
    {
      group: 'Connectivity and Charging',
      rows: [
        { attr: 'Battery Life',   value: 'Up to 32 hours, or up to 28 hours with ANC on' },
        { attr: 'Bluetooth Profile', value: 'Bluetooth® 5.1, 100ft/30m range, AAC, aptX™ Adaptive up to 24bit/48kHz, and SBC' },
        { attr: 'Wired Digital Headphone Connection', value: 'Hi-res audio up to 24-bit/96kHz via included USB-C to USB-C cable on supported devices' },
        { attr: 'Analog Headphone Connection', value: 'USB-C to 3.5mm cable for analog audio (optional)' },
        { attr: 'Cables',         value: 'USB-C to 3.5mm audio cable and USB-C to USB-C charging cable' },
        { attr: 'Antenna',        value: 'Internal antenna' },
      ],
    },
  ],

  inTheBox: [
    { name: 'Wireless Headphones',        img: 'assets/images/in-the-box/ITB_Headphones.png' },
    { name: 'USB-C to USB-C Charging Cable', img: 'assets/images/in-the-box/ITB_USB_C_to_C.png' },
    { name: 'USB-C to 3.5mm Audio Cable', img: 'assets/images/in-the-box/ITB_USB_C_to_35mm.png' },
    { name: 'USB-C to USB-A Adapter',     img: 'assets/images/in-the-box/ITB_USB_C_to_A.png' },
    { name: '3.5mm to 1/4" Adapter',      img: 'assets/images/in-the-box/ITB_35mm_to_quarter.png' },
    { name: 'Flight Adapter',             img: 'assets/images/in-the-box/ITB_Flight_Adapter.png' },
    { name: 'Hard Shell Travel Case',     img: 'assets/images/in-the-box/ITB_Hard_Case.png' },
  ],
};
```

### CartItem (runtime, inside `CartStore.items` Map)

```
{
  colorId:   string   // 'black' | 'silver'
  colorName: string   // 'Black' | 'Silver'
  name:      string   // always 'MW75 TUMI'
  price:     number   // always 750.00
  qty:       number   // always 1
  imgSrc:    string   // hero image path (index 0 of color.images)
  imgAlt:    string
}
```

---

## CSS Architecture

### Design Tokens (Custom Properties)

Defined on `:root` in `style.css`:

```css
:root {
  /* Colors */
  --color-dark:       #1a1a1a;
  --color-body:       #4a4a4a;
  --color-black:      #000000;
  --color-white:      #ffffff;
  --color-surface:    #fafafa;
  --color-itb-bg:     #ffffff;
  --color-swatch-black:  #000000;
  --color-swatch-silver: #e1e1e1;
  --color-swatch-border: #4a4a4a;
  --color-btn-primary-bg:   #4a4a4a;
  --color-btn-primary-text: #ffffff;
  --color-btn-support-bg:   #1a1a1a;
  --color-link:       #000000;
  --color-service-text: #141414;
  --color-footer-bg:  #000000;
  --color-footer-text: #ffffff;
  --color-announcement-bg:   #1a1a1a;
  --color-announcement-text: #ffffff;
  --color-error: #cc0000;   /* red, for Error_Message */

  /* Typography */
  --font-family:   blenderbook, sans-serif;
  --font-family: blendermedium, sans-serif;
  --font-family:   blenderbold, sans-serif;

  /* Container */
  --container-margin-desktop: 48px;
  --container-margin-mobile:  20px;

  /* Z-index layers */
  --z-overlay:     199;
  --z-cart-drawer: 200;
  --z-header:      100;
}
```

### @font-face

```css
@font-face {
  font-family: 'blenderbook';
  src: url('fonts/blenderbook.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* repeat for blendermedium, blenderbold */
```

> **Note:** If Blender Pro font files are unavailable, the fallback chain `sans-serif` is acceptable for development. The font declarations are still included so the files can be dropped in later with zero CSS changes.

### Class Naming Convention

BEM-style naming: `block__element--modifier`.

Examples:
- `.gallery__btn--prev`
- `.cart-drawer.is-open`  (state class uses simple adjective, not BEM modifier)
- `.swatch--active` (not used — CSS `:has(input:checked)` handles this instead)

State classes (added/removed by JS) use simple adjectives: `is-open`, `is-visible`, `has-error`.

### Media Query Strategy

**Desktop-first.** Most tokens are written for desktop. Mobile overrides are inside `@media (max-width: 699px)`. The `min-width: 1000px` query activates the two-column product grid.

```css
/* Base styles: desktop layout */
.product {
  display: grid;
  grid-template-columns: 785.938px 643.062px;
  gap: 48px;
  padding: 40px 0 72px 0;
}

@media (max-width: 699px) {
  .product {
    grid-template-columns: 1fr;
    gap: 20px 40px;
    padding: 0;
  }
}
```

Container class:

```css
.container {
  margin: 0 var(--container-margin-desktop);
}
@media (max-width: 699px) {
  .container {
    margin: 0 var(--container-margin-mobile);
  }
}
```

---

## Event Handling Strategy

### Approach: Targeted Direct Binding + Delegation for Dynamic Content

Static elements (cart icon, gallery buttons, swatch fieldset, add-to-cart button, close button, ESC key) get **direct event listeners** bound in `init()` after DOM ready.

Dynamic content inside `.cart-drawer__body` (Remove buttons, placeholder links that are rebuilt on each render) use **event delegation** on `#cart-drawer`:

```js
document.getElementById('cart-drawer').addEventListener('click', (e) => {
  const removeBtn = e.target.closest('[data-action="remove"]');
  if (removeBtn) {
    CartStore.removeItem(removeBtn.dataset.colorId);
    return;
  }
  const placeholder = e.target.closest('.js-placeholder');
  if (placeholder) {
    e.preventDefault();
  }
});
```

### Placeholder Actions

All `<a href="#">` Placeholder_Actions call `e.preventDefault()`. This is handled either by the delegation above (for drawer links) or by direct binding in `init()` for static links.

### init() Responsibilities

```
init()
  1. Build PRODUCT_DATA-driven static HTML sections
     (features list, tech specs accordions, in-the-box grid)
     OR rely on pre-rendered HTML in index.html (preferred — see Note)
  2. Bind gallery prev/next buttons → GalleryController
  3. Bind fieldset[name=color] change → color selection handler
  4. Bind button.product__add-to-cart click → CartStore.addItem
  5. Bind button.site-header__cart click → CartStore.openDrawer
  6. Bind button.cart-drawer__close click → CartStore.closeDrawer
  7. Bind document keydown → ESC handler for drawer
  8. Bind overlay click → CartStore.closeDrawer
  9. Bind delegation on #cart-drawer for Remove + Placeholder links
  10. CartStore.render() — set initial state in DOM
```

> **Design decision:** Static sections (features, tech specs, in-the-box) are written directly in `index.html` rather than rendered from `PRODUCT_DATA` at runtime. This keeps the HTML inspectable without running JavaScript, which improves both debuggability and baseline accessibility. `PRODUCT_DATA` stores this data for reference but the renderer does not need to construct those sections dynamically.

---

## Accessibility

### ARIA Roles and Attributes

| Element | Attribute | Value / Behavior |
|---|---|---|
| `nav.breadcrumb` | `aria-label` | `"breadcrumbs"` |
| `#cart-badge` | `aria-live` | `"polite"` — announces count changes |
| `#cart-badge` | `aria-label` | `"Cart, N items"` — updated on each render |
| `fieldset.product__swatches` | semantic | `<fieldset>` + `<legend>` provides group label |
| `input[type="radio"]` | `aria-checked` | native to radio, no manual ARIA needed |
| `#cart-drawer` | `role` | `"dialog"` |
| `#cart-drawer` | `aria-modal` | `"true"` |
| `#cart-drawer` | `aria-label` | `"Shopping cart"` |
| Gallery prev/next buttons | `aria-label` | `"Previous photo"` / `"Next photo"` |
| Gallery dots | `aria-current` | `"true"` on active dot |
| Remove buttons | `aria-label` | `"Remove {colorName} MW75 TUMI"` |
| Support Center button | — | `<button>` element |

### Focus Management

**Opening the cart drawer:**

```
CartStore.openDrawer():
  lastFocusedEl = document.activeElement  // save reference
  drawer.classList.add('is-open')
  requestAnimationFrame(() => {
    firstFocusable = drawer.querySelector(focusableSelectors)
    firstFocusable?.focus()
  })
```

**Closing the cart drawer:**

```
CartStore.closeDrawer():
  drawer.classList.remove('is-open')
  lastFocusedEl?.focus()               // return focus to trigger element
```

**Focus trap inside drawer:**

The drawer implements a focus trap while open. On `keydown Tab`:

```
focusableEls = drawer.querySelectorAll(focusableSelectors)
if (shiftKey && activeEl === firstFocusable)  → focus lastFocusable, preventDefault
if (!shiftKey && activeEl === lastFocusable)  → focus firstFocusable, preventDefault
```

`focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'`

**Keyboard shortcuts:**

- `Escape` while drawer is open → `CartStore.closeDrawer(lastFocusedEl)`

### Visible Focus Indicators

All interactive elements have an explicit `:focus-visible` style:

```css
:focus-visible {
  outline: 2px solid var(--color-dark);
  outline-offset: 2px;
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Gallery wrap-around (circular navigation)

*For any* starting gallery index `i` (0–3) and any number of `next()` steps `n ≥ 0`, the resulting index equals `(i + n) % 4`. Equivalently, calling `prev()` is the same as `(i + 3) % 4`.

**Validates: Requirements 5.3, 5.4**

### Property 2: addItem grows the cart by exactly one

*For any* cart state where `colorId` is NOT already in the cart, calling `addItem(colorId)` produces a cart where `items.size` is exactly `previousSize + 1` and `items.has(colorId)` is `true`.

**Validates: Requirements 8.1, 22.2**

### Property 3: addItem is idempotent at max quantity

*For any* cart state where `colorId` IS already in the cart, calling `addItem(colorId)` leaves the cart unchanged: `items.size`, `items.get(colorId).qty`, and the total price all remain identical to their pre-call values.

**Validates: Requirements 8.2, 22.2**

### Property 4: removeItem produces a cart without the removed item

*For any* cart state containing `colorId`, calling `removeItem(colorId)` produces a cart where `items.has(colorId)` is `false` and `items.size` is `previousSize - 1`.

**Validates: Requirements 11.1, 11.2**

### Property 5: Color switch does not mutate cart

*For any* cart state (empty or non-empty), selecting any color variant leaves `CartStore.items` byte-identical to its pre-selection state (same keys, same values, same size).

**Validates: Requirements 6.5**

---

## Error Handling

### JavaScript Initialization Failure

Per Requirement 22.6, if a runtime error occurs during `init()`, the static HTML in `index.html` must still be visible. This is achieved by:

1. All interactive enhancement is wrapped in a `try/catch` inside `init()`.
2. The `<script src="script.js" defer>` tag appears at the bottom of `<body>` (or uses `defer`) — the HTML renders before any script executes.
3. `init()` is wrapped:

```js
document.addEventListener('DOMContentLoaded', () => {
  try {
    init();
  } catch (err) {
    console.error('[MW75 PDP] Initialization error:', err);
    // Page remains in static state; no blank screen
  }
});
```

### Add to Cart — Duplicate Item

When `addItem` is called for a color already in the cart:

1. `CartStore.addItem` returns early without calling `openDrawer`.
2. The error element (`.product__error`) has `hidden` removed and its `textContent` set to `"The maximum quantity of this item is already in your cart."`.
3. On the next successful `addItem` (after `removeItem`), `.product__error` gets `hidden` restored.

### Missing Image Assets

`<img>` elements include `onerror` or a CSS fallback background color to prevent broken-image icons from disrupting layout. No alert or runtime error is thrown for missing assets.

---

## Testing Strategy

### Unit Tests (example-based)

Because this project has no build tool or test runner, unit tests target the **pure logic functions** that can be extracted and tested in isolation in a standard browser or Node.js environment using a minimal test harness or Jest.

Candidates for unit testing:

| Function | Test Cases |
|---|---|
| `GalleryController.next()` | index 0→1, index 3→0 (wrap) |
| `GalleryController.prev()` | index 0→3 (wrap), index 2→1 |
| `CartStore.addItem` | new color → item added; duplicate → no-op + error shown |
| `CartStore.removeItem` | present color → removed; badge decrements to 0 |
| `CartStore.getTotalPrice` | 0 items → 0; 1 item → 750.00; 2 items → 1500.00 |
| `CartStore.render` | empty cart → shows empty state message; 1 item → shows item block |

### Property-Based Tests

Use [fast-check](https://github.com/dubzzz/fast-check) (TypeScript/JavaScript PBT library). Each property test runs a minimum of **100 iterations**.

**Property 1: Gallery wrap-around**
```
Tag: Feature: mw75-tumi-pdp, Property 1: Gallery wrap-around (circular navigation)
Generator: fc.integer({ min: 0, max: 3 }), fc.nat()
For any (startIndex, steps): gallery.goTo(startIndex); repeat next() steps times; assert currentIndex === (startIndex + steps) % 4
```

**Property 2: addItem grows cart by one**
```
Tag: Feature: mw75-tumi-pdp, Property 2: addItem grows the cart by exactly one
Generator: fc.constantFrom('black', 'silver') filtered to not-in-cart
For any colorId not in cart: addItem(colorId) → items.size === prevSize + 1 && items.has(colorId)
```

**Property 3: addItem idempotent at max qty**
```
Tag: Feature: mw75-tumi-pdp, Property 3: addItem is idempotent at max quantity
Generator: fc.constantFrom('black', 'silver')
Precondition: addItem once first (item is in cart); then addItem again
Assert: items.size unchanged, items.get(colorId).qty === 1
```

**Property 4: removeItem removes only the target**
```
Tag: Feature: mw75-tumi-pdp, Property 4: removeItem produces a cart without the removed item
Generator: fc.constantFrom('black', 'silver')
Precondition: addItem(colorId) first
For any colorId in cart: removeItem(colorId) → !items.has(colorId) && items.size === prevSize - 1
```

**Property 5: Color switch does not mutate cart**
```
Tag: Feature: mw75-tumi-pdp, Property 5: Color switch does not mutate cart
Generator: fc.constantFrom('black', 'silver') × 2 for initial and selected color; fc.boolean for whether cart starts with an item
For any cart state and any color selection: serialized items before === serialized items after color change
```

### Integration / Smoke Tests (manual)

These are executed manually in a browser following the acceptance criteria checklist:

- AC-02: Initial state on page load
- AC-07: Add to cart opens drawer with correct item
- AC-08: Duplicate add shows error, does not open drawer
- AC-12: Remove empties cart, shows empty state
- AC-19: No horizontal scroll at 375px viewport
- AC-20: Two-column layout at 1440px viewport
- AC-21: Full keyboard navigation: Tab through all controls, Esc closes drawer
- AC-22: Page reload resets all state
