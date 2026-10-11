# Design Tokens — MW75 TUMI Product Page
**Sumber:** https://www.masterdynamic.com/products/mw75-tumi  
**Diakses:** 1 Oktober 2026  
**Viewport yang diukur:** Desktop 1440 × 900 px · Mobile 375 × 812 px  
**Metode:** Chrome DevTools MCP — computed styles via JavaScript, bukan estimasi.

> Nilai "TIDAK DITEMUKAN" berarti elemen tidak dapat dibaca atau tidak ada di DOM pada saat pengukuran.

---

## Daftar Isi
1. [Color Palette](#1-color-palette)
2. [Typography](#2-typography)
3. [Layout & Spacing](#3-layout--spacing)
4. [Breakpoints & Media Queries](#4-breakpoints--media-queries)
5. [Announcement Bar](#5-announcement-bar)
6. [Header](#6-header)
7. [Breadcrumb](#7-breadcrumb)
8. [Gallery](#8-gallery)
9. [Product Info (Nama, Harga, Warna, CTA)](#9-product-info)
10. [Features (Fitur Unggulan)](#10-features-fitur-unggulan)
11. [Service Info (Shipping, Returns, Protection)](#11-service-info)
12. [Brand TUMI + Description](#12-brand-tumi--description)
13. [Tech Specs](#13-tech-specs)
14. [In The Box](#14-in-the-box)
15. [Support](#15-support)
16. [Footer](#16-footer)
17. [Mobile Differences (375 px)](#17-mobile-differences-375-px)
18. [Aset Gambar](#18-aset-gambar)
19. [Screenshots Referensi](#19-screenshots-referensi)

---

## 1. Color Palette

Semua nilai adalah `rgb()` dari `getComputedStyle` langsung di elemen yang relevan.

| Token | Nilai RGB | Hex Ekuivalen | Digunakan Pada |
|---|---|---|---|
| `color-dark` | `rgb(26, 26, 26)` | `#1a1a1a` | Teks utama produk, H1–H3 produk, border tombol |
| `color-body` | `rgb(74, 74, 74)` | `#4a4a4a` | Body text, nav link, footer text, announcement bar text (desktop) |
| `color-black` | `rgb(0, 0, 0)` | `#000000` | Footer background, deskripsi paragraf teks |
| `color-white` | `rgb(255, 255, 255)` | `#ffffff` | Footer teks, tombol Add to Cart teks, announcement bar teks (inner) |
| `color-surface` | `rgb(250, 250, 250)` | `#fafafa` | Support section background |
| `color-in-the-box-bg` | `rgb(255, 255, 255)` | `#ffffff` | In The Box section background |
| `color-swatch-black` | `rgb(0, 0, 0)` | `#000000` | Swatch Black (active) background |
| `color-swatch-silver` | `rgb(225, 225, 225)` | `#e1e1e1` | Swatch Silver (inactive) background |
| `color-swatch-border` | `rgb(74, 74, 74)` | `#4a4a4a` | Border semua swatch (1px solid) |
| `color-btn-primary-bg` | `rgb(74, 74, 74)` | `#4a4a4a` | Add to Cart button background |
| `color-btn-primary-text` | `rgb(255, 255, 255)` | `#ffffff` | Add to Cart button teks |
| `color-btn-support-bg` | `rgb(26, 26, 26)` | `#1a1a1a` | Support Center button background |
| `color-link` | `rgb(0, 0, 0)` | `#000000` | Link "Learn more", inline links dalam deskripsi |
| `color-announcement-bg` | `rgb(26, 26, 26)` | `#1a1a1a` | Announcement bar background (inner div) |
| `color-announcement-text` | `rgb(255, 255, 255)` | `#ffffff` | Announcement bar teks |
| `color-service-text` | `rgb(20, 20, 20)` | `#141414` | Teks deskripsi service (Free Shipping dst.) |
| `color-border-subtle` | `rgba(26, 26, 26, 0.12)` | — | Border halus pada sebagian besar elemen |
| `color-footer-bg` | `rgb(0, 0, 0)` | `#000000` | Footer `.footer` div background |
| `color-footer-text` | `rgb(255, 255, 255)` | `#ffffff` | Footer semua teks dan link |

---

## 2. Typography

### Font Family
| Nama Font | Digunakan Pada |
|---|---|
| `blenderbook, sans-serif` | Body text, nav, breadcrumb, price container, caption, footer text |
| `blendermedium, sans-serif` | H1, H2, H3, feature item, tech specs title, service title, price list, color label |
| `blenderbold, sans-serif` | Add to Cart button, Support Center button, announcement bar inner text, price label (visually hidden) |

> Ketiga varian adalah font kustom Blender Pro. Fallback: `sans-serif`.

### Type Scale (Desktop 1440 px)

| Elemen | Font Family | font-size | line-height | font-weight | letter-spacing | text-transform | color |
|---|---|---|---|---|---|---|---|
| Root (`html`) | — | `16px` | — | — | — | — | — |
| Body default | blenderbook | `18px` | `18px` | `400` | `normal` | `none` | `rgb(74, 74, 74)` |
| H1 (nama produk) | blendermedium | `32px` | `32px` | `400` | `-0.64px` | `none` | `rgb(26, 26, 26)` |
| H2 (TUMI heading) | blendermedium | `41.008px` | `41.008px` | `400` | `-0.82px` | `none` | `rgb(26, 26, 26)` |
| H2 (support) | blendermedium | `41.008px` | `41.008px` | `400` | `-0.82px` | `none` | `rgb(74, 74, 74)` |
| H3 (Free Shipping, dst.) | blendermedium | `26px` | `26px` | `400` | `-0.52px` | `none` | `rgb(26, 26, 26)` |
| Price list | blendermedium | `20px` | `20px` | `400` | `-0.4px` | `none` | `rgb(26, 26, 26)` |
| Price label ("Sale price") | blenderbold | `24px` | `24px` | `400` | `-0.4px` | `none` | `rgb(26, 26, 26)` _(visually hidden)_ |
| Nav link (header) | blenderbook | `16px` | `16px` | `400` | `normal` | `none` | `rgb(74, 74, 74)` |
| Breadcrumb link | blenderbook | `16px` | `16px` | `400` | `normal` | `none` | `rgb(26, 26, 26)` |
| Feature item | blendermedium | `16px` | `16px` | `400` | `normal` | `none` | `rgb(26, 26, 26)` |
| Tech Specs title (summary) | blendermedium | `16px` | `16px` | `400` | `-0.32px` | `uppercase` | `rgb(74, 74, 74)` |
| In The Box item text | blenderbook | `16px` | `16px` | `400` | `normal` | `none` | `rgb(74, 74, 74)` |
| Service desc text | blenderbook | `18px` | `21.6px` | `400` | `normal` | `none` | `rgb(20, 20, 20)` |
| Description paragraph | blenderbook | `18px` | `22.5px` | `400` | `normal` | `none` | `rgb(0, 0, 0)` |
| Link inline (Learn more) | blenderbook | `18px` | `22.5px` | `400` | `normal` | `none` | `rgb(0, 0, 0)` |
| Add to Cart button | blenderbold | `18px` | `18px` | `400` | `normal` | `none` | `rgb(255, 255, 255)` |
| Announcement bar inner | blenderbold | `14px` | `14px` | `400` | `normal` | `uppercase` | `rgb(255, 255, 255)` |
| Footer nav link | blenderbook | `20px` | `30px` | `400` | `normal` | `none` | `rgb(255, 255, 255)` |
| Footer small text | blenderbook | `16px` | `20.8px` | `400` | `normal` | `none` | `rgb(255, 255, 255)` |
| Color label (legend) | blendermedium | `18px` | `18px` | `400` | `normal` | `none` | `rgb(26, 26, 26)` |
| Support Center button | blenderbold | `18px` | `18px` | `400` | `normal` | `none` | `rgb(255, 255, 255)` |

---

## 3. Layout & Spacing

### Container / Page Width

| Properti | Nilai Desktop (1440 px) | Nilai Mobile (375 px) |
|---|---|---|
| Selector | `div.container` | `div.container` |
| Margin kiri/kanan | `48px` (tiap sisi) | `20px` (tiap sisi) |
| Lebar konten aktual | `1477px` (di 1440+scrollbar) | `335px` |
| max-width | `none` | `none` |
| padding | `0px` | `0px` |

> Container menggunakan `margin: 0 48px` di desktop dan `margin: 0 20px` di mobile — bukan padding.

### Product Layout Grid (Desktop)

| Properti | Nilai |
|---|---|
| Selector | `div.product` |
| display | `grid` |
| grid-template-columns | `785.938px 643.062px` |
| gap | `48px` |
| padding | `40px 0px 72px 0px` |
| Lebar total | `1477px` |

### Product Layout (Mobile)

| Properti | Nilai |
|---|---|
| display | `grid` |
| grid-template-columns | `335px` (single column) |
| gap | `20px 40px` |
| padding | `0px` |

### Header Wrapper Grid

| Viewport | grid-template-columns | gap | padding |
|---|---|---|---|
| Desktop | `396.078px 604.828px 396.094px` | `40px` | `10px 48px` |
| Mobile | `70.5px 170px 70.5px` | `12px` | TIDAK DITEMUKAN |

### Gallery Carousel (Desktop)

| Properti | Nilai |
|---|---|
| display | `grid` |
| grid-template-columns | `785.938px` × 4 (horizontal scroll) |
| gap | `24px` |
| Thumbnail dots | `64px` × 4, gap `16px` |

### Sections Spacing

| Elemen | margin-top | margin-bottom | padding |
|---|---|---|---|
| Breadcrumb | `32px` | `32px` | `0px` |
| Product layout | `0px` | `0px` | `40px 0 72px 0` |
| Features container | `32px` | `0px` | `0px` |
| Swatch/variant picker | `32px` | `16px` | `0px` |
| Price container | `16px` | `16px` | `0px` |
| Support section | `20px` | `0px` | `32px` |
| Support button | `32px` (margin-top) | — | `16px 30px` |
| Footer `.footer` | `0px` | `0px` | `72px 0px` (desktop) · `32px 0px` (mobile) |

### Feature Items Grid

| Properti | Nilai |
|---|---|
| Layout item | `display: flex` |
| gap antar konten item | `5px` |
| Ukuran tiap item | `≈ 312px × 60px` (desktop) |

### Multi-Column Features (Desktop)

| Properti | Nilai |
|---|---|
| Container | `div.multi-column` |
| grid-template-columns | 12 kolom × `49.75px` |
| gap | `80px` |
| Lebar total | `1477px` |

---

## 4. Breakpoints & Media Queries

Diekstrak dari `document.styleSheets` — urutan dari yang paling sering muncul ke spesifik.

| Breakpoint | Media Query | Keterangan |
|---|---|---|
| **Mobile** | `(max-width: 699px)` | Layar kecil (≤ 699px) |
| **Mobile** | `screen and (max-width: 700px)` | Alias mobile |
| **Mobile** | `only screen and (max-width: 700px)` | Alias mobile |
| **Tablet** | `screen and (min-width: 700px)` | Mulai tablet ke atas |
| **Tablet** | `only screen and (min-width: 700px)` | Alias tablet |
| **Tablet–Desktop** | `screen and (min-width: 1000px)` | Desktop kecil |
| **Desktop** | `screen and (min-width: 1220px)` | Desktop medium |
| **Desktop L** | `screen and (min-width: 1400px)` | Desktop besar |
| **Desktop XL** | `screen and (min-width: 1600px)` | Desktop extra besar |
| **Pointer fine** | `screen and (pointer: fine)` | Mouse/stylus |
| **Reduced motion** | `(prefers-reduced-motion: reduce)` | Aksesibilitas |
| **Print** | `print` | Cetak |

**Breakpoint utama untuk proyek ini (berdasarkan layout yang berubah):**

| Nama | Nilai | Perubahan Layout |
|---|---|---|
| `mobile` | `≤ 699px` | Single-column, container margin 20px, header 50px |
| `tablet` | `≥ 700px` | Mulai 2-column layout tersedia |
| `desktop` | `≥ 1000px` | Layout desktop penuh, 2-column produk |

---

## 5. Announcement Bar

**Screenshot:** `assets/screenshots/desktop-01-header.png`

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector outer | `aside.shopify-section--announcement-bar` | sama |
| Selector inner | `div.announcement-bar.bg-custom` | sama |
| **background-color** | `rgb(26, 26, 26)` = `#1a1a1a` | sama |
| **color (teks)** | `rgb(255, 255, 255)` | sama |
| **font-family** | `blenderbold, sans-serif` | sama |
| **font-size** | `14px` | sama |
| **line-height** | `14px` | sama |
| **font-weight** | `400` | sama |
| **text-transform** | `uppercase` | sama |
| **padding** | `8px 0px` | sama |
| **height** | `30px` | `30px` |
| **display** | `block` | `block` |
| letter-spacing | `normal` | sama |
| Teks konten | `FREE US GROUND SHIPPING ON ORDERS OF $99 OR MORE.` | sama |

---

## 6. Header

**Screenshot:** `assets/screenshots/desktop-01-header.png`

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector | `store-header.header` | sama |
| **background-color** | `rgba(0, 0, 0, 0)` (transparan) | sama |
| **color** | `rgb(74, 74, 74)` | sama |
| **height** | `60px` | `50px` |
| **font-family** | `blenderbook, sans-serif` | sama |
| **font-size** | `18px` | `18px` |
| **display** | `block` | `block` |
| padding | `0px` | `0px` |
| margin | `0px` | `0px` |
| Logo width | `220px` | TIDAK DITEMUKAN |
| Logo height | `40px` | TIDAK DITEMUKAN |
| Nav link font-size | `16px` | — (hamburger mobile) |
| Nav link color | `rgb(74, 74, 74)` | — |
| Cart icon size | `28px × 28px` | `28px × 28px` |
| Hamburger icon size | — | `22px × 22px` |
| Header grid desktop | `396px + 605px + 396px`, gap `40px` | `70.5px + 170px + 70.5px`, gap `12px` |
| header padding | `10px 48px` (desktop inner wrapper) | TIDAK DITEMUKAN |

---

## 7. Breadcrumb

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector | `nav[aria-label="breadcrumbs"]` | sama |
| **font-family** | `blenderbook, sans-serif` | sama |
| **font-size** | `16px` | TIDAK DITEMUKAN (display: block, height 0) |
| **line-height** | `16px` | sama |
| **color** | `rgb(26, 26, 26)` | sama |
| background-color | `rgba(0, 0, 0, 0)` | sama |
| **margin** | `32px 0px` (top & bottom) | `0px` |
| padding | `0px` | `0px` |
| height | `16px` | `0` (tersembunyi di mobile) |
| Link color | `rgb(26, 26, 26)` | sama |
| Link font-size | `16px` | sama |
| Separator | TIDAK DITEMUKAN (aria-hidden) | TIDAK DITEMUKAN |
| Teks | `All Products > MW75 TUMI` | sama |

---

## 8. Gallery

**Screenshot:** `assets/screenshots/desktop-01-header.png`

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector | `media-carousel.product-gallery__media-list` | sama |
| **display** | `grid` | `grid` |
| **grid-template-columns** | `785.938px` × 4 (4 foto berderet horizontal) | `375px` × 4 |
| **gap** | `24px` | TIDAK DITEMUKAN |
| Lebar container | `785.938px` | `375px` |
| Tinggi container | `≈ 880px` (grid + thumbnail) | `375px` |
| **Gambar utama** | `785.938px × 785.938px` | `375px × 375px` |
| max-width gambar | `100%` | `100%` |
| object-fit gambar | TIDAK DITEMUKAN | TIDAK DITEMUKAN |
| background-color gambar | `rgba(0, 0, 0, 0)` | sama |
| Thumbnail dots | `64px × 64px`, gap `16px` | TIDAK DITEMUKAN |
| Thumbnail grid | 4 kolom × `64px` | TIDAK DITEMUKAN |

### URL Gambar Gallery

| Foto | Warna | URL Lokal | URL Asli (CDN) |
|---|---|---|---|
| Hero | Black | `assets/images/gallery/MW75B_Hero.png` | `cdn/shop/files/MW75B_TUMI_800x800_Hero.png?v=1769444695` |
| Front | Black | `assets/images/gallery/MW75B_Front.png` | `cdn/shop/files/MW75B_TUMI_800x800_Front.png?v=1769444695` |
| Engraving | Black | `assets/images/gallery/MW75B_Engraving.png` | `cdn/shop/files/MW75B_TUMI_800x800_Engraving.png?v=1769444695` |
| Straight | Black | `assets/images/gallery/MW75B_Straight.png` | `cdn/shop/files/MW75B_TUMI_800x800_Straight_…png?v=1769444695` |
| Hero | Silver | `assets/images/gallery/MW75S_Hero.png` | `cdn/shop/files/MW75S_TUMI_800x800_Hero.png?v=1769444695` |
| Front | Silver | `assets/images/gallery/MW75S_Front.png` | `cdn/shop/files/MW75S_TUMI_800x800_Front.png?v=1769444695` |
| Engraving | Silver | `assets/images/gallery/MW75S_Engraving.png` | `cdn/shop/files/MW75S_TUMI_800x800_Engraving.png?v=1769444695` |
| Straight | Silver | `assets/images/gallery/MW75S_Straight.png` | `cdn/shop/files/MW75S_TUMI_800x800_Straight_…png?v=1769444571` |

---

## 9. Product Info

### Nama Produk (H1)

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Tag | `h1` | `h1` |
| Teks | `MW75 TUMI` | sama |
| **font-family** | `blendermedium, sans-serif` | sama |
| **font-size** | `32px` | `25px` |
| **line-height** | `32px` | `25px` |
| **letter-spacing** | `-0.64px` | `-0.5px` |
| **color** | `rgb(26, 26, 26)` | sama |
| font-weight | `400` | sama |
| text-transform | `none` | sama |
| background-color | `rgba(0, 0, 0, 0)` | sama |
| margin | `0px` | sama |

### Subjudul (Noise-Cancelling Wireless Headphones)

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Tag | `p.menu-product-tile__descriptor` | sama |
| Teks | `Noise-Cancelling Wireless Headphones` | sama |
| **font-family** | `blendermedium, sans-serif` | sama |
| **font-size** | `16px` | sama |
| **line-height** | `20px` | sama |
| **letter-spacing** | `-0.4px` | sama |
| **color** | `rgb(74, 74, 74)` | sama |
| font-weight | `400` | sama |

### Harga

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Tag | `price-list` (custom element) | sama |
| Teks | `Sale price  $ 750.00` | sama |
| **font-family** | `blendermedium, sans-serif` | sama |
| **font-size** | `20px` | `16px` |
| **line-height** | `20px` | `16px` |
| **letter-spacing** | `-0.4px` | `-0.32px` |
| **color** | `rgb(26, 26, 26)` | sama |
| display | `flex` | `flex` |
| gap | `12px` | `12px` |
| font-weight | `400` | sama |
| "Sale price" label | blenderbold, 24px, visually-hidden | sama |

### Pilihan Warna (Color Swatch)

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector container | `div.product-info__variant-picker` | sama |
| margin-top | `32px` | sama |
| margin-bottom | `16px` | sama |
| Color label ("Color") | blendermedium, 18px, `rgb(26, 26, 26)` | sama |
| **Swatch diameter** | `20px × 20px` | `20px × 20px` |
| **Swatch border-radius** | `9999px` (lingkaran penuh) | sama |
| **Swatch border** | `1px solid rgb(74, 74, 74)` | sama |
| **Swatch margin** | `6px` (semua sisi) | sama |
| **Active swatch bg (Black)** | `rgb(0, 0, 0)` | sama |
| **Inactive swatch bg (Silver)** | `rgb(225, 225, 225)` | sama |
| **Active indicator (::before)** | `24px × 24px`, position absolute, border-radius `9999px` | sama |
| Active ring width/height | `24px` (lebih besar 4px dari swatch) | sama |

### Add to Cart Button

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Tag | `button[name="add"]` | sama |
| Teks | `ADD TO CART` | sama |
| **font-family** | `blenderbold, sans-serif` | sama |
| **font-size** | `18px` | `20px` |
| **line-height** | `18px` | `20px` |
| **color** | `rgb(255, 255, 255)` | sama |
| **background-color** | `rgb(74, 74, 74)` | sama |
| **border** | `2px solid rgb(74, 74, 74)` | sama |
| **border-radius** | `0px` | sama |
| **padding** | `24px 48px` | `24px 48px` |
| **width** | `643px` (penuh kolom info) | `335px` (penuh layar) |
| **height** | `70px` | `72px` |
| display | `block` | `block` |
| text-transform | `none` | sama |

---

## 10. Features (Fitur Unggulan)

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector container | `[class*="feature"]` | TIDAK DITEMUKAN (null di mobile) |
| margin-top | `32px` | — |
| display | `block` | — |
| Lebar container | `643px` | — |
| **Feature item display** | `flex` | `flex` |
| **Feature item gap** | `5px` | sama |
| **Feature item font-family** | `blendermedium, sans-serif` | sama |
| **Feature item font-size** | `16px` | sama |
| **Feature item line-height** | `16px` | sama |
| **Feature item color** | `rgb(26, 26, 26)` | sama |
| Ukuran item | `≈ 312px × 60px` | TIDAK DITEMUKAN |

**Daftar 6 Fitur:**
1. ANC
2. Anodized aluminum, tempered glass and lambskin leather
3. 40mm beryllium drivers
4. 32 hours of listening
5. Bluetooth® 5.1
6. 4 beamforming microphones

---

## 11. Service Info

Tiga item: Free Shipping · Free Returns · Product Protection.

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector wrapper | `div.v-stack.gap-4.text-center` | sama |
| display | `grid` | `grid` |
| grid-template-columns | `343px` (1 kolom) | `273.75px` (1 kolom) |
| gap | `16px` | `16px` |
| **Judul (H3) font-family** | `blendermedium, sans-serif` | sama |
| **Judul font-size** | `26px` | sama |
| **Judul line-height** | `26px` | sama |
| **Judul letter-spacing** | `-0.52px` | sama |
| **Judul color** | `rgb(26, 26, 26)` | sama |
| **Deskripsi font-family** | `blenderbook, sans-serif` | sama |
| **Deskripsi font-size** | `18px` | sama |
| **Deskripsi line-height** | `21.6px` | sama |
| **Deskripsi color** | `rgb(20, 20, 20)` | sama |
| background-color | `rgba(0, 0, 0, 0)` | sama |

> Tiga item service ditampilkan dalam grid baris bawah — di desktop terlihat horizontal (multi-column), di mobile vertical (1 kolom per row).

---

## 12. Brand TUMI + Description

### TUMI Brand Section

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector | `div.prose.break-all.place-self-center-start.text-start` | sama |
| display | `block` | `block` |
| Lebar | `578.5px` | full-width |
| **H3 "Master & Dynamic for"** | blendermedium, TIDAK DITEMUKAN font-size terpisah | sama |
| **H2 "TUMI"** | blendermedium, `41.008px`, `rgb(26, 26, 26)` | sama |
| **Paragraf deskripsi** | blenderbook, `18px`, `rgb(26, 26, 26)` | sama |
| Gambar TUMI brand | `assets/images/sections/TUMI_Brand.png` | sama |
| margin-top H2 | `16px` | sama |

### Product Description Section

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector | `div.prose.break-all.place-self-center-start.text-start` | sama |
| **H3 "MW75"** | blendermedium, `26px`, letter-spacing `-0.52px` | sama |
| **H2 "Active Noise-Cancelling..."** | blendermedium, `41.008px`, `rgb(26, 26, 26)` | sama |
| **Paragraf (p)** | blenderbook, `18px`, line-height `22.5px`, `rgb(0, 0, 0)` | sama |
| **Link "Learn more"** | blenderbook, `18px`, display `inline`, `rgb(0, 0, 0)` | sama |
| Gambar produk | `assets/images/sections/MW75B_TUMI_Feature.png` | sama |

---

## 13. Tech Specs

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Struktur | `<details>` + `<summary>` (accordion) | sama |
| **Summary font-family** | `blendermedium, sans-serif` | sama |
| **Summary font-size** | `16px` | sama |
| **Summary line-height** | `16px` | sama |
| **Summary letter-spacing** | `-0.32px` | sama |
| **Summary color** | `rgb(74, 74, 74)` | sama |
| **Summary text-transform** | `uppercase` | sama |
| **Summary display** | `flex` | `flex` |
| **Summary gap** | `10px` | sama |
| background-color | `rgba(0, 0, 0, 0)` | sama |
| Jumlah kelompok | 3 | sama |

**Tiga kelompok:** Materials and Design · Sound and Features · Connectivity and Charging

---

## 14. In The Box

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| **Background section** | `rgb(255, 255, 255)` | sama |
| display section | `flow-root` | `flow-root` |
| Tinggi section | `≈ 445px` | `≈ 918px` |
| Selector item grid | `div.section-stack.section-stack--horizontal` | sama |
| **display item grid** | `grid` | `grid` |
| **grid-template-columns** | TIDAK DITEMUKAN (multi-col) | `335px` (1 kolom) |
| **gap item grid** | `24px 20px` | `24px 20px` |
| padding item grid | `18px 0px` | `18px 0px` |
| **Item font-family** | `blenderbook, sans-serif` | sama |
| **Item font-size** | `16px` | sama |
| **Item line-height** | `16px` | sama |
| **Item color** | `rgb(74, 74, 74)` | sama |
| **Item display** | `grid` | sama |
| Item ukuran | `≈ 133px × 165px` | sama |
| Item gap (gambar+teks) | `16px` | sama |

### URL Gambar In The Box

| Item | File Lokal | Ukuran |
|---|---|---|
| Wireless Headphones | `assets/images/in-the-box/ITB_Headphones.png` | 16 KB |
| USB-C to USB-C Charging Cable | `assets/images/in-the-box/ITB_USB_C_to_C.png` | 5 KB |
| USB-C to 3.5mm Audio Cable | `assets/images/in-the-box/ITB_USB_C_to_35mm.png` | 6 KB |
| USB-C to USB-A Adapter | `assets/images/in-the-box/ITB_USB_C_to_A.png` | 2 KB |
| 3.5mm to 1/4" Adapter | `assets/images/in-the-box/ITB_35mm_to_quarter.png` | 2 KB |
| Flight Adapter | `assets/images/in-the-box/ITB_Flight_Adapter.png` | 5 KB |
| Hard Shell Travel Case | `assets/images/in-the-box/ITB_Hard_Case.png` | 7 KB |

---

## 15. Support

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector | `[class*="support"]` | sama |
| **background-color** | `rgb(250, 250, 250)` | sama |
| **display** | `flex` | `flex` |
| **flex-direction** | `row` | `column` |
| **gap** | `12px` | `12px` |
| **padding** | `32px` (semua sisi) | `32px` |
| margin-top | `20px` | `20px` |
| border-radius | `0px` | `0px` |
| Lebar | `600px` | `327px` |
| Gambar banner | `assets/images/sections/Support_Banner.jpg` | sama |

### Heading Support

| Properti | Nilai Desktop |
|---|---|
| Teks | `Need support? We're here to assist you every step of the way.` |
| font-family | `blendermedium, sans-serif` |
| font-size | `41.008px` |
| line-height | `41.008px` |
| letter-spacing | `-0.82px` |
| color | `rgb(74, 74, 74)` |

### Support Center Button

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Teks | `Support Center` | sama |
| **font-family** | `blenderbold, sans-serif` | sama |
| **font-size** | `18px` | `16px` |
| **line-height** | `18px` | `16px` |
| **color** | `rgb(255, 255, 255)` | sama |
| **background-color** | `rgb(26, 26, 26)` | sama |
| **border** | `2px solid rgb(26, 26, 26)` | sama |
| **border-radius** | `0px` | sama |
| **padding** | `16px 30px` | sama |
| width | `176.5px` | `164px` |
| height | `54px` | `52px` |
| margin-top | `32px` | `24px` |
| display | `inline-block` | sama |

---

## 16. Footer

| Properti | Nilai Desktop | Nilai Mobile |
|---|---|---|
| Selector | `div.footer` | sama |
| **background-color** | `rgb(0, 0, 0)` = `#000000` | sama |
| **color** | `rgb(255, 255, 255)` | sama |
| **font-family** | `blenderbook, sans-serif` | sama |
| **font-size** | `18px` | sama |
| **padding** | `72px 0px` | `32px 0px` |
| margin | `0px` | sama |
| Tinggi | `≈ 586px` | `≈ 982px` |
| display | `block` | `block` |

### Footer Nav Link

| Properti | Nilai |
|---|---|
| font-family | `blenderbook, sans-serif` |
| **font-size** | `20px` |
| **line-height** | `30px` |
| color | `rgb(255, 255, 255)` |
| display | `inline-block` |
| background-color | `rgba(0, 0, 0, 0)` |

### Footer Small Text (copyright, address)

| Properti | Nilai |
|---|---|
| font-family | `blenderbook, sans-serif` |
| font-size | `16px` |
| line-height | `20.8px` |
| color | `rgb(255, 255, 255)` |

### Footer Newsletter Section

| Properti | Nilai Desktop |
|---|---|
| max-width | `576px` |
| display | `grid` |
| gap | `32px` |
| margin-right | `268.5px` |

---

## 17. Mobile Differences (375 px)

Perubahan layout signifikan dibandingkan desktop:

| Elemen | Desktop | Mobile | Catatan |
|---|---|---|---|
| **Container margin** | `0 48px` | `0 20px` | Konten lebih lebar di mobile |
| **Product layout** | 2 kolom (786px + 643px) | 1 kolom (335px) | Gallery di atas, info di bawah |
| **Product layout gap** | `48px` | `20px 40px` | |
| **Header height** | `60px` | `50px` | |
| **Header nav** | Menu horizontal | Hamburger (22×22px) | |
| **Header grid** | `396+605+396`, gap 40px | `70.5+170+70.5`, gap 12px | |
| **H1 font-size** | `32px` | `25px` | |
| **Gallery image size** | `786×786px` | `375×375px` | Full-bleed mobile |
| **Add to Cart font-size** | `18px` | `20px` | |
| **Add to Cart width** | `643px` | `335px` | |
| **In The Box grid** | Multi-kolom | `335px` (1 kolom) | |
| **Support flex-direction** | `row` | `column` | |
| **Footer padding** | `72px 0px` | `32px 0px` | |
| **Support Center font-size** | `18px` | `16px` | |
| **Support Center margin-top** | `32px` | `24px` | |
| **Breadcrumb** | Tampil (height 16px) | Tersembunyi (height 0) | display: block tapi 0 height |

---

## 18. Aset Gambar

Semua gambar disimpan dari CDN masterdynamic.com untuk keperluan latihan. Hanya digunakan secara lokal, tidak dipublikasikan.

### Gallery Produk (800×800 px, PNG)

```
assets/images/gallery/
├── MW75B_Hero.png       (359 KB)  — Black, tampak hero
├── MW75B_Front.png      (363 KB)  — Black, tampak depan
├── MW75B_Engraving.png  (592 KB)  — Black, detail ukiran
├── MW75B_Straight.png   (201 KB)  — Black, tampak samping
├── MW75S_Hero.png       (361 KB)  — Silver, tampak hero
├── MW75S_Front.png      (356 KB)  — Silver, tampak depan
├── MW75S_Engraving.png  (615 KB)  — Silver, detail ukiran
└── MW75S_Straight.png   (213 KB)  — Silver, tampak samping
```

### Section / Feature Images (PNG/JPG)

```
assets/images/sections/
├── TUMI_Brand.png          (765 KB)  — Tekstur latar TUMI brand section
├── MW75B_TUMI_Feature.png  (854 KB)  — Foto produk di section deskripsi
└── Support_Banner.jpg      ( 68 KB)  — Banner section support
```

### In The Box (300×300 px, PNG)

```
assets/images/in-the-box/
├── ITB_Headphones.png       (16 KB)  — Wireless Headphones
├── ITB_USB_C_to_C.png       ( 5 KB)  — USB-C to USB-C Charging Cable
├── ITB_USB_C_to_35mm.png    ( 6 KB)  — USB-C to 3.5mm Audio Cable
├── ITB_USB_C_to_A.png       ( 2 KB)  — USB-C to USB-A Adapter
├── ITB_35mm_to_quarter.png  ( 2 KB)  — 3.5mm to 1/4" Adapter
├── ITB_Flight_Adapter.png   ( 5 KB)  — Flight Adapter
└── ITB_Hard_Case.png        ( 7 KB)  — Hard Shell Travel Case
```

---

## 19. Screenshots Referensi

```
assets/screenshots/
├── desktop-01-header.png   — Viewport 1440×900, tampilan awal halaman
└── mobile-01-overview.png  — Viewport 375×812, tampilan awal halaman
```

---

## Catatan Implementasi

Berdasarkan data computed styles di atas, berikut beberapa poin penting untuk implementasi proyek:

1. **Font**: Blender Pro (blenderbook / blendermedium / blenderbold) adalah font berbayar/kustom. Untuk latihan, cari font alternatif dengan karakter serupa (geometric sans-serif, narrow) atau host sendiri jika tersedia lisensi.

2. **Warna utama** cukup sederhana: dua warna netral (`#1a1a1a` dan `#4a4a4a`) + putih + hitam. Tidak ada warna aksen.

3. **Border-radius**: Hampir semua elemen menggunakan `border-radius: 0px` (persegi), kecuali swatch warna yang menggunakan `9999px` (bulat penuh).

4. **Grid 2-kolom produk**: `786px + 643px` dengan gap `48px` di dalam container bermargin `48px` di sisi kiri-kanan. Total = `786 + 48 + 643 = 1477px` = `1440 - 48 - 48 + 133 (scrollbar/overflow)`. Untuk implementasi: gunakan `grid-template-columns: 55% 45%` atau `minmax` yang sesuai.

5. **Breakpoint kunci**: `700px` (mobile → tablet) dan `1000px` (tablet → desktop). Implementasikan keduanya.

6. **Tombol**: Tidak ada border-radius. Padding `24px 48px` (Add to Cart) dan `16px 30px` (Support Center). Border `2px solid` dengan warna sama dengan background.

7. **Swatch ring aktif**: Dibuat via `::before` pseudo-element berukuran `24×24px` (4px lebih besar) dengan `position: absolute` dan `border-radius: 9999px`.
