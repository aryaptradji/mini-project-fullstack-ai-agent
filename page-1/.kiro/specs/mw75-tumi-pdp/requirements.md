# Requirements Document

## Introduction

This document specifies requirements for the MW75 TUMI product detail page (PDP). The page allows prospective buyers to explore the MW75 TUMI noise-cancelling wireless headphones — browse the photo gallery, select a color variant, read features and specifications, and add the product to a shopping cart drawer — all implemented in plain HTML, CSS, and JavaScript without any framework, build tool, backend, or API.

The page targets desktop and mobile browsers. All product data is embedded directly in JavaScript. The cart state is held in memory only and resets on page reload.

**Tech Stack Constraints:**
- HTML, CSS, and JavaScript only — no frameworks, no build tools
- No API, backend, or database
- Cart state in JavaScript memory only (not `localStorage` or `sessionStorage`)
- Single-file structure: `index.html`, `style.css`, `script.js`
- All placeholder links use `href="#"` with `preventDefault()`

---

## Glossary

- **Page**: The MW75 TUMI product detail page (`index.html`).
- **Gallery**: The photo carousel showing up to four product images for the selected color.
- **Color_Swatch**: A circular button representing a color variant (Black or Silver).
- **Active_Color**: The currently selected color variant; initially Black.
- **Cart**: The in-memory data structure holding at most one item per color variant.
- **Cart_Drawer**: The slide-in panel from the right that displays cart contents.
- **Cart_Badge**: The numeric indicator on the cart icon in the header showing total item count.
- **Add_to_Cart_Button**: The primary call-to-action button on the product info panel.
- **Error_Message**: The red inline message "The maximum quantity of this item is already in your cart." shown above the Add_to_Cart_Button when the quantity limit is reached.
- **Overlay**: The semi-transparent darkened backdrop behind the Cart_Drawer when it is open.
- **Remove_Button**: The button inside the Cart_Drawer that removes an item from the Cart.
- **Quantity**: The number of a specific item in the Cart; always 1 and cannot be incremented.
- **Total**: The computed cart total displayed in the Cart_Drawer as `$750.00 USD`.
- **Placeholder_Action**: A link or button that fires `preventDefault()` and performs no navigation.
- **Blender_Pro**: The custom font family used for all text; weights: `blenderbook`, `blendermedium`, `blenderbold`.

---

## Requirements

---

### Requirement 1: Page Load — Initial State

**User Story:** As a prospective buyer, I want the page to open in a defined ready state so that I can immediately see the product without confusion about what is selected.

#### Acceptance Criteria

1. WHEN the Page loads, THE Page SHALL display the Announcement Bar, Header, Breadcrumb, Gallery, product name, subtitle, price, Color_Swatch group, Add_to_Cart_Button, key features, service information, brand section, description, Tech Specs, In The Box section, Support section, and Footer. `[AC-01]`
2. WHEN the Page loads, THE Page SHALL set Active_Color to Black, display the Black Hero image in the Gallery, display price `$750.00`, render the Add_to_Cart_Button in its enabled state, show Cart_Badge as `0`, and keep the Cart_Drawer closed. `[AC-02]`
3. WHEN the Page reloads, THE Page SHALL reset Active_Color to Black, reset the Cart to empty, reset Cart_Badge to `0`, and keep the Cart_Drawer closed. `[AC-22]`
4. THE Page SHALL render without any JavaScript runtime errors during the primary user flow.

---

### Requirement 2: Announcement Bar (FR-01)

**User Story:** As a prospective buyer, I want to see a promotional message at the top of the page so that I know about free shipping eligibility.

#### Acceptance Criteria

1. THE Page SHALL display an Announcement Bar above the Header containing the text `FREE US GROUND SHIPPING ON ORDERS OF $99 OR MORE.`
2. THE Announcement Bar SHALL use background color `#1a1a1a`, text color `#ffffff`, font family `blenderbold, sans-serif`, font size `14px`, line height `14px`, `text-transform: uppercase`, and padding `8px 0`.

---

### Requirement 3: Header (FR-01)

**User Story:** As a prospective buyer, I want a consistent header with navigation and cart access so that I can orient myself on the page and open my cart at any time.

#### Acceptance Criteria

1. THE Header SHALL display the Master & Dynamic logo, navigation links (Headphones, Earphones, Accessories, Collaborations, Blog), icons for search and account, the Cart_Badge icon, a country selector showing `US`, and a Support button.
2. THE Header SHALL treat the navigation links, country selector, and Support button as Placeholder_Actions.
3. THE Header SHALL use height `60px` on desktop (≥ 1000 px) and `50px` on mobile (≤ 699 px).
4. THE Header SHALL use a three-column grid layout: `396px + 605px + 396px` with gap `40px` and padding `10px 48px` on desktop; `70.5px + 170px + 70.5px` with gap `12px` on mobile.
5. THE Cart_Badge icon in the Header SHALL display the current Cart item count and, when clicked, SHALL open the Cart_Drawer. `[AC-15]`

---

### Requirement 4: Breadcrumb (FR-02)

**User Story:** As a prospective buyer, I want a breadcrumb trail so that I understand my location within the store hierarchy.

#### Acceptance Criteria

1. THE Page SHALL display a Breadcrumb reading `All Products > MW75 TUMI` as Placeholder_Actions.
2. THE Breadcrumb SHALL use font family `blenderbook, sans-serif`, font size `16px`, color `#1a1a1a`, and margin `32px 0`.
3. WHERE the viewport width is ≤ 699 px, THE Breadcrumb SHALL be visually hidden (height `0`).

---

### Requirement 5: Product Gallery — Display (FR-03)

**User Story:** As a prospective buyer, I want to view multiple product photos without distortion so that I can clearly evaluate the product's appearance.

#### Acceptance Criteria

1. THE Gallery SHALL display exactly four photos for the Active_Color at natural proportions without cropping or stretching.
2. THE Gallery SHALL show one photo at a time in the main viewport, with Previous and Next navigation buttons.
3. WHEN the Next button is activated on the last photo, THE Gallery SHALL wrap around and display the first photo. `[AC-05]`
4. WHEN the Previous button is activated on the first photo, THE Gallery SHALL wrap around and display the last photo. `[AC-06]`
5. THE Gallery SHALL render each photo with a descriptive `alt` attribute matching the photo subject and color.
6. THE Gallery image area SHALL be `785.938px × 785.938px` on desktop and `375px × 375px` on mobile.

---

### Requirement 6: Color Variant Selection (FR-05, FR-06)

**User Story:** As a prospective buyer, I want to switch between Black and Silver and immediately see matching photos so that I can compare the two finishes before buying.

#### Acceptance Criteria

1. THE Page SHALL display two Color_Swatches: Black (`#000000`) and Silver (`#e1e1e1`), each `20px × 20px` with `border-radius: 9999px` and `1px solid #4a4a4a` border.
2. THE Active_Color swatch SHALL have a `24px × 24px` ring indicator rendered via `::before` pseudo-element.
3. WHEN a Color_Swatch is activated, THE Page SHALL set that color as the sole Active_Color, update the color label adjacent to the "Color" heading, and reset the Gallery to the first photo for that color. `[AC-03, AC-04]`
4. THE color label SHALL use font family `blendermedium, sans-serif`, font size `18px`, color `#1a1a1a`.
5. WHEN a Color_Swatch is activated, THE Cart contents SHALL remain unchanged. `[AC-09]`
6. THE Active_Color swatch SHALL expose an accessible state (e.g., `aria-pressed` or `aria-checked`) readable by screen readers.

---

### Requirement 7: Product Information Panel (FR-04)

**User Story:** As a prospective buyer, I want to see the product name, subtitle, and price prominently so that I can confirm I am viewing the right product and understand its cost.

#### Acceptance Criteria

1. THE Page SHALL display the product name `MW75 TUMI` as an `<h1>` with font family `blendermedium, sans-serif`, font size `32px` on desktop / `25px` on mobile, letter-spacing `-0.64px` on desktop / `-0.5px` on mobile, color `#1a1a1a`.
2. THE Page SHALL display the subtitle `Noise-Cancelling Wireless Headphones` with font family `blendermedium, sans-serif`, font size `16px`, color `#4a4a4a`.
3. THE Page SHALL display the price `$750.00` in US dollar format with two decimal places, using font family `blendermedium, sans-serif`, font size `20px` on desktop / `16px` on mobile, color `#1a1a1a`.
4. THE price SHALL remain `$750.00` regardless of Active_Color.

---

### Requirement 8: Add to Cart (FR-07)

**User Story:** As a prospective buyer, I want to add the product to my cart and see the cart open immediately so that I can confirm my selection.

#### Acceptance Criteria

1. WHEN the Add_to_Cart_Button is activated and the current Active_Color item is NOT in the Cart, THE Cart SHALL add the item with Quantity `1`, increment the Cart_Badge by `1`, and open the Cart_Drawer. `[AC-07]`
2. WHEN the Add_to_Cart_Button is activated and the current Active_Color item IS already in the Cart, THE Page SHALL display the Error_Message above the Add_to_Cart_Button, keep Quantity at `1`, keep Cart_Badge unchanged, and NOT open the Cart_Drawer. `[AC-08]`
3. WHEN the Cart_Drawer is opened after a successful Add_to_Cart action, THE Cart_Drawer SHALL display the item with its name, color, photo, price `$750.00`, Quantity `1`, and Total `$750.00 USD`. `[AC-07]`
4. THE Add_to_Cart_Button SHALL use font family `blenderbold, sans-serif`, font size `18px` (desktop) / `20px` (mobile), background color `#4a4a4a`, text color `#ffffff`, border `2px solid #4a4a4a`, border-radius `0px`, padding `24px 48px`, and full column width.
5. THE Error_Message SHALL use red text and the message text: `The maximum quantity of this item is already in your cart.`
6. WHEN the item is successfully added to the Cart after having been removed, THE Error_Message SHALL not be visible. `[AC-13]`

---

### Requirement 9: Cart Drawer — Display and Layout (FR-08, FR-09, FR-10, FR-11, FR-12, FR-13)

**User Story:** As a prospective buyer, I want to review my cart contents in a drawer without leaving the page so that I can verify my selection before proceeding.

#### Acceptance Criteria

1. WHEN the Cart_Drawer opens, THE Cart_Drawer SHALL slide in from the right side of the viewport, display the Overlay behind it, and show the title `Cart (n)` where `n` is the current item count. `[AC-07]`
2. THE Cart_Drawer SHALL display each cart item with its product photo, name `MW75 TUMI`, selected color name, price `$750.00`, Quantity `1`, and Remove_Button.
3. THE Cart_Drawer SHALL display Quantity as `1` and SHALL NOT provide a control to increase Quantity beyond `1`. `[AC-10]`
4. THE Cart_Drawer SHALL display Total in the format `$750.00 USD` and the note `Taxes and shipping calculated at checkout`. `[AC-11]`
5. THE Cart_Drawer SHALL display a View Cart button and a Checkout button, both as Placeholder_Actions. `[AC-16]`
6. WHEN the Cart is empty, THE Cart_Drawer SHALL display the message `Your cart is empty` and a Continue shopping Placeholder_Action button. `[AC-12]`
7. WHEN the Cart_Drawer is open, THE Page SHALL display the Overlay darkening the content behind it.
8. WHERE the viewport width is ≤ 699 px, THE Cart_Drawer SHALL fill the full viewport width, scroll vertically without horizontal overflow, and keep the Close, Remove, View Cart, and Checkout controls reachable. `[AC-19]`

---

### Requirement 10: Cart Drawer — Open and Close (FR-08, FR-13)

**User Story:** As a prospective buyer, I want to open and close the cart drawer easily so that I can return to browsing the page.

#### Acceptance Criteria

1. WHEN the Cart_Badge icon in the Header is activated, THE Cart_Drawer SHALL open and display current Cart contents. `[AC-15]`
2. WHEN the Close button in the Cart_Drawer is activated, THE Cart_Drawer SHALL close and the Overlay SHALL be removed. `[AC-14]`
3. WHEN the `Escape` key is pressed while the Cart_Drawer is open, THE Cart_Drawer SHALL close. `[AC-21]`
4. WHEN the Cart_Drawer opens, THE Page SHALL move keyboard focus to the first interactive element inside the Cart_Drawer. `[AC-21]`

---

### Requirement 11: Remove Item from Cart (FR-09, FR-10, FR-13)

**User Story:** As a prospective buyer, I want to remove an item from my cart so that I can change my mind without reloading the page.

#### Acceptance Criteria

1. WHEN the Remove_Button for an item is activated, THE Cart SHALL remove that item, decrement the Cart_Badge to `0`, and display the empty cart state in the Cart_Drawer. `[AC-12]`
2. WHEN all items are removed from the Cart, THE Cart_Drawer SHALL display `Your cart is empty` and a Continue shopping button. `[AC-12]`
3. WHEN an item is removed and the Add_to_Cart_Button is activated again for the same color, THE Cart SHALL accept the item and the Error_Message SHALL not appear. `[AC-13]`

---

### Requirement 12: Key Features Section (FR-14)

**User Story:** As a prospective buyer, I want to scan the product highlights quickly so that I can decide whether the headphones meet my needs without reading the full spec sheet.

#### Acceptance Criteria

1. THE Page SHALL display exactly six feature items with their respective icons:
   - ANC (Active Noise Cancellation)
   - Anodized aluminum, tempered glass and lambskin leather
   - 40mm beryllium drivers
   - 32 hours of listening
   - Bluetooth® 5.1
   - 4 beamforming microphones
2. THE feature items SHALL use font family `blendermedium, sans-serif`, font size `16px`, line height `16px`, color `#1a1a1a`, and `display: flex` with gap `5px`.

---

### Requirement 13: Service Information (FR-15)

**User Story:** As a prospective buyer, I want to see shipping, return, and warranty policies on the page so that I can make a confident purchase decision.

#### Acceptance Criteria

1. THE Page SHALL display three service items: Free Shipping (free US ground on orders ≥ $99), Free Returns (14-day), and Product Protection (manufacturer warranty).
2. THE service item headings SHALL use font family `blendermedium, sans-serif`, font size `26px`, letter-spacing `-0.52px`, color `#1a1a1a`.
3. THE service item descriptions SHALL use font family `blenderbook, sans-serif`, font size `18px`, line height `21.6px`, color `#141414`.

---

### Requirement 14: Brand TUMI Section (FR-16)

**User Story:** As a prospective buyer, I want to learn about the Master & Dynamic × TUMI collaboration so that I understand the heritage behind the product.

#### Acceptance Criteria

1. THE Page SHALL display the Master & Dynamic × TUMI collaboration section with the image `assets/images/sections/TUMI_Brand.png`, a heading, and a brief description.
2. THE section heading SHALL use font family `blendermedium, sans-serif`, font size `41.008px`, letter-spacing `-0.82px`, color `#1a1a1a`.

---

### Requirement 15: Product Description Section (FR-17)

**User Story:** As a prospective buyer, I want to read a narrative description of the headphones so that I understand the product story and design intent.

#### Acceptance Criteria

1. THE Page SHALL display a description section with the heading `MW75 Active Noise-Cancelling Wireless Headphones`, the product image `assets/images/sections/MW75B_TUMI_Feature.png`, body text, a `Learn more` inline link, and a `Discover the full TUMI collaboration` link — all as Placeholder_Actions.
2. THE body paragraphs SHALL use font family `blenderbook, sans-serif`, font size `18px`, line height `22.5px`, color `#000000`.
3. THE `Learn more` link SHALL use font family `blenderbook, sans-serif`, font size `18px`, color `#000000`, `display: inline`.

---

### Requirement 16: Tech Specs Section (FR-18)

**User Story:** As a prospective buyer, I want to see full technical specifications so that I can verify compatibility and compare with other headphones.

#### Acceptance Criteria

1. THE Page SHALL display Tech Specs in three `<details>` accordion groups: Materials and Design, Sound and Features, and Connectivity and Charging, containing all attributes and values from PRD Appendix B. `[AC-17]`
2. THE `<summary>` elements SHALL use font family `blendermedium, sans-serif`, font size `16px`, letter-spacing `-0.32px`, `text-transform: uppercase`, color `#4a4a4a`, `display: flex`, gap `10px`.
3. THE Page SHALL render all three spec groups with complete and accurate data — none may be omitted. `[AC-17]`

---

### Requirement 17: In The Box Section (FR-19)

**User Story:** As a prospective buyer, I want to see every item included in the box so that I know which accessories I will receive.

#### Acceptance Criteria

1. THE Page SHALL display exactly seven In The Box items, each with its image and name, sourced from PRD Appendix C:
   - Wireless Headphones — `assets/images/in-the-box/ITB_Headphones.png`
   - USB-C to USB-C Charging Cable — `assets/images/in-the-box/ITB_USB_C_to_C.png`
   - USB-C to 3.5mm Audio Cable — `assets/images/in-the-box/ITB_USB_C_to_35mm.png`
   - USB-C to USB-A Adapter — `assets/images/in-the-box/ITB_USB_C_to_A.png`
   - 3.5mm to 1/4" Adapter — `assets/images/in-the-box/ITB_35mm_to_quarter.png`
   - Flight Adapter — `assets/images/in-the-box/ITB_Flight_Adapter.png`
   - Hard Shell Travel Case — `assets/images/in-the-box/ITB_Hard_Case.png`
2. THE In The Box section background SHALL be `#ffffff`. Each item name SHALL use font family `blenderbook, sans-serif`, font size `16px`, color `#4a4a4a`. `[AC-18]`
3. THE Page SHALL render all seven items — none may be omitted. `[AC-18]`

---

### Requirement 18: Support Section (FR-20)

**User Story:** As a prospective buyer, I want to see a clear support call-to-action so that I know how to get help if I have questions.

#### Acceptance Criteria

1. THE Page SHALL display a Support section with the image `assets/images/sections/Support_Banner.jpg`, the heading `Need support? We're here to assist you every step of the way.`, and a `Support Center` Placeholder_Action button.
2. THE Support section background SHALL be `#fafafa`, padding `32px`, and margin-top `20px`.
3. THE Support section heading SHALL use font family `blendermedium, sans-serif`, font size `41.008px`, letter-spacing `-0.82px`, color `#4a4a4a`.
4. THE Support Center button SHALL use font family `blenderbold, sans-serif`, font size `18px` (desktop) / `16px` (mobile), background color `#1a1a1a`, text color `#ffffff`, border `2px solid #1a1a1a`, border-radius `0px`, padding `16px 30px`, and margin-top `32px` (desktop) / `24px` (mobile).
5. WHERE the viewport width is ≤ 699 px, THE Support section layout SHALL use `flex-direction: column`.

---

### Requirement 19: Footer (FR-21)

**User Story:** As a prospective buyer, I want to see footer links and legal information so that I can find help resources and understand the brand's policies.

#### Acceptance Criteria

1. THE Footer SHALL display Help & Info links, About links, Gifting links, legal links, social media icons, the company address, and copyright text — all as Placeholder_Actions.
2. THE Footer background SHALL be `#000000`, text color `#ffffff`, font family `blenderbook, sans-serif`.
3. THE Footer padding SHALL be `72px 0` on desktop and `32px 0` on mobile.
4. THE Footer nav links SHALL use font size `20px`, line height `30px`. Legal and small text SHALL use font size `16px`, line height `20.8px`.

---

### Requirement 20: Responsive Layout (FR-22)

**User Story:** As a prospective buyer, I want the page to work well on both my desktop and my phone so that I can shop from any device.

#### Acceptance Criteria

1. WHEN the viewport width is ≥ 1000 px, THE Page SHALL display the Gallery and product info panel side by side in a two-column grid (`785.938px + 643.062px`, gap `48px`, padding `40px 0 72px 0`). `[AC-20]`
2. WHEN the viewport width is ≤ 699 px, THE Page SHALL stack Gallery above product info in a single column with gap `20px 40px`. `[AC-19]`
3. THE container SHALL use margin `0 48px` on desktop and `0 20px` on mobile — not padding.
4. WHEN the viewport width is ≤ 699 px, THE Page SHALL have no horizontal scroll on any section including the Cart_Drawer. `[AC-19]`
5. THE Page SHALL use `max-width: 699px` as the mobile breakpoint and `min-width: 1000px` as the desktop breakpoint.

---

### Requirement 21: Keyboard Accessibility (FR-21, AC-21)

**User Story:** As a prospective buyer using keyboard navigation, I want full keyboard access to all interactive controls so that I can use the page without a mouse.

#### Acceptance Criteria

1. THE Page SHALL ensure all interactive controls — Color_Swatches, Gallery navigation buttons, Add_to_Cart_Button, Cart_Badge icon, Cart_Drawer Close button, Remove_Button, View Cart button, and Checkout button — are reachable via the `Tab` key and have visible focus indicators. `[AC-21]`
2. WHEN the Cart_Drawer opens, THE Page SHALL move keyboard focus to the first interactive element inside the Cart_Drawer. `[AC-21]`
3. WHEN the `Escape` key is pressed while the Cart_Drawer is open, THE Cart_Drawer SHALL close and keyboard focus SHALL return to the element that triggered opening. `[AC-21]`
4. THE Active_Color swatch SHALL communicate its selected state to assistive technologies via ARIA attributes.

---

### Requirement 22: Data Integrity and Constraints

**User Story:** As a developer maintaining this page, I want all product data and interaction limits strictly enforced so that the implementation never deviates from the product source.

#### Acceptance Criteria

1. THE Page SHALL embed all product data (name, price, features, tech specs, In The Box items, color variants, image paths) directly in `script.js` — no API or external data fetch.
2. THE Cart SHALL enforce a Quantity limit of exactly `1` per item and SHALL NOT allow increment controls or bulk additions. `[AC-10]`
3. THE price SHALL always be formatted as `$750.00` (two decimal places) for per-item display and `$750.00 USD` for Cart Total display.
4. THE Page SHALL implement only the two files `style.css` and `script.js` (plus `index.html`), with no additional build artifacts or dependencies.
5. THE Page SHALL not persist any state between page loads — all Cart and UI state SHALL reset on reload. `[AC-22]`
6. IF a JavaScript error occurs during Page initialization, THE Page SHALL still render the static HTML content without a blank screen.

---

## Out of Scope

The following items are explicitly excluded and MUST NOT be implemented:

- User login, registration, or accounts
- API calls, backend services, or databases
- `localStorage` or `sessionStorage` persistence
- View Cart, Checkout, or payment pages (buttons are Placeholder_Actions only)
- Product protection add-on, gift wrap, or gift message
- Quantity selectors or multi-unit purchasing
- Country/currency switching, search, or functional navigation menus
- Newsletter form, product reviews, ratings, wishlist, or product comparison
- Admin or CMS interfaces
- "Complete with" recommendations or Sold Out states
- Size selection
