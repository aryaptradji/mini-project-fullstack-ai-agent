# Architecture — Product API MW75 TUMI

## Tujuan dan kontrak

Arsitektur ini mengimplementasikan [PRD API MW75 TUMI](prd.md). Node.js, Express, dan PostgreSQL menyediakan API katalog persisten. API mengirim seluruh data produk yang diperlukan halaman detail: identitas dan harga, variasi warna/stok, galeri per warna, deskripsi, highlights, layanan, kolaborasi, spesifikasi, dan isi kotak.

Frontend memanggil `GET /api/products/:id` menggunakan `VITE_API_BASE_URL` dan `VITE_PRODUCT_ID`. Frontend merender respons, mengelola state pilihan warna/galeri, serta cart sementara dalam memori. Backend tidak menyimpan cart atau memproses checkout. Harga API adalah integer minor unit: MW75 `75000` dengan `currency: "USD"`.

Endpoint: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`.

## Teknologi

| Area | Pilihan |
| --- | --- |
| Runtime dan HTTP | Node.js LTS, Express.js |
| Database/driver | PostgreSQL, `pg` dengan parameterized query |
| Validasi | Zod atau Joi; pilih satu secara konsisten |
| Migrasi | node-pg-migrate atau Knex migrations |
| API docs | OpenAPI 3.1, Swagger UI di `/api-docs`, JSON di `/openapi.json` |
| Verifikasi | Vitest/Jest, Supertest, database PostgreSQL khusus test |

## Aliran request

```text
Browser (MW75 detail) -- HTTP JSON --> Express Router
  -> request ID, CORS, JSON parser, request validation
  -> Controller -> Product service -> Product repository (pg)
  -> PostgreSQL: products + variants/images + nested content
  -> mapper -> { data, meta } / RFC 9457 Problem Details
```

Controller mengurus HTTP saja. Service memuat/memvalidasi aturan domain dan transaksi. Repository menjalankan SQL serta tidak menentukan status HTTP. Mapper menyusun relasi menjadi kontrak JSON. Semua error ditangani error middleware pusat.

## Struktur aplikasi

```text
src/
  app.js
  server.js
  config/{env.js,database.js}
  routes/{product.routes.js,docs.routes.js}
  controllers/product.controller.js
  services/product.service.js
  repositories/product.repository.js
  schemas/{product.schema.js,openapi.js}
  middlewares/{request-id.js,cors.js,validate-request.js,not-found.js,error-handler.js}
  errors/app-error.js
  utils/product-response.js
migrations/
  001_create_products.sql
  002_create_product_variants_and_images.sql
  003_create_product_content.sql
  004_seed_mw75_tumi.sql
tests/{unit,integration}/
```

Pilih satu sumber OpenAPI, direkomendasikan `openapi.yaml`; parse dan validasi saat startup, lalu sajikan spec yang sama untuk Swagger UI dan `/openapi.json`. OpenAPI mencakup semua endpoint, ProductSummary, Product detail, ProductInput, nested content, error RFC 9457, status 201 Location, dan 204 tanpa content.

## Model relasional

```text
products 1 --- * product_variants 1 --- * variant_images
products 1 --- * product_highlights
products 1 --- * product_services
products 1 --- 0..1 product_collaborations
products 1 --- * product_specification_groups 1 --- * product_specification_items
products 1 --- * product_box_items
```

Tabel `products`: `id BIGINT GENERATED ALWAYS AS IDENTITY`, `name`, `subtitle`, `brand`, `price BIGINT`, `currency CHAR(3)`, `description`, `image_url`, timestamp. `price` disimpan dalam minor unit; API mengirim integer yang sama dan kode currency.

Tabel `product_variants`: `id`, `product_id` FK cascade, `variant_type` (saat ini `color`, extensible ke `size`), `value`, `quantity INTEGER`, sort order, timestamp. Unique index pada `(product_id, variant_type, lower(value))` mencegah warna duplikat yang hanya berbeda kapitalisasi.

Tabel `variant_images`: `id`, `variant_id` FK cascade, `role`, `image_url`, `alt_text`, `position`. Untuk MW75 role yang diharapkan `hero`, `front`, `engraving`, `straight`; unique `(variant_id, role)` serta urutan posisi deterministik.

Konten halaman disimpan terstruktur, tidak dalam satu kolom HTML/JSON opaque: `product_highlights` (`title`, `description`, `icon`, `position`), `product_services` (`title`, `description`, `position`), `product_collaborations` (`title`, `description`, `image_url`, `image_alt`), `product_specification_groups` (`title`, `position`), `product_specification_items` (`label`, `value`, `position`), dan `product_box_items` (`name`, `image_url`, `image_alt`, `position`). Semua FK memakai `ON DELETE CASCADE`. Urutan API mengikuti kolom `position` lalu ID sebagai tie-breaker.

URL dan teks divalidasi aplikasi. Database menambah constraint untuk nilai required nonblank, price dan quantity non-negative, currency format, tipe varian yang diizinkan, serta uniqueness. Hindari constraint yang bergantung pada aturan gambar MW75 di schema umum; aturan jumlah/role gambar divalidasi service berdasarkan tipe/kategori produk.

## Bentuk respons detail dan pemetaan

```json
{
  "data": {
    "id": 1,
    "name": "MW75 TUMI",
    "subtitle": "Noise-Cancelling Wireless Headphones",
    "brand": "Master & Dynamic",
    "price": 75000,
    "currency": "USD",
    "image": "https://example.com/black-hero.png",
    "variants": [
      {
        "id": 1,
        "type": "color",
        "value": "Black",
        "quantity": 10,
        "images": [
          { "role": "hero", "url": "https://example.com/black-hero.png", "alt": "MW75 TUMI Black, tampak utama" },
          { "role": "front", "url": "https://example.com/black-front.png", "alt": "MW75 TUMI Black, tampak depan" },
          { "role": "engraving", "url": "https://example.com/black-engraving.png", "alt": "Detail ukiran MW75 TUMI Black" },
          { "role": "straight", "url": "https://example.com/black-straight.png", "alt": "MW75 TUMI Black, tampak samping" }
        ]
      }
    ],
    "description": "Headphone over-ear dengan driver beryllium 40mm dan Adaptive Active Noise Cancellation.",
    "highlights": [], "services": [], "collaboration": null,
    "specificationGroups": [], "boxItems": []
  },
  "meta": {}
}
```

Contoh menyingkat nested arrays hanya untuk keterbacaan; seed MW75 harus memuat semua konten pada PRD frontend. `image` produk dipetakan dari hero varian default. Array `variants` mempertahankan urutan pilihan warna yang diinginkan UI. Jangan menggabungkan stok semua warna menjadi quantity tunggal karena frontend perlu mengetahui stok per pilihan.

GET list boleh mengembalikan ProductSummary (`id`, `name`, `price`, `currency`, `image`) agar tidak memuat seluruh konten detail. GET detail selalu mengembalikan bentuk lengkap. POST/PUT menerima data lengkap tanpa `id`; validasi memakai schema yang sama dengan mapper respons.

## Transaksi CRUD

- **GET list/detail:** ambil produk dan nested relations dengan query terencana (join/queries batch), urutkan berdasarkan `position`, bentuk DTO; detail yang tidak ada menghasilkan `404`.
- **POST:** validasi seluruh nested payload sebelum transaksi; insert product dan semua relasi dalam satu transaksi; commit lalu kembalikan detail lengkap, `201`, `Location: /api/products/{id}`. Kegagalan nested insert harus rollback keseluruhan.
- **PUT:** validasi body penuh dan ID; dalam transaksi pastikan product ada, update kolom utama, ganti relasi nested, commit, lalu kembalikan detail. Kegagalan mempertahankan resource lama.
- **DELETE:** hapus product dan periksa row count; FK cascade membersihkan seluruh relasi. Kirim `204` tanpa body atau `404`.

Semua query memakai placeholder `$1`, `$2`, dan seterusnya. Jangan membangun SQL dari input pengguna.

## Validasi dan format error

Semua response sukses ber-body memakai `{ data, meta }` dan `application/json; charset=utf-8`. DELETE sukses adalah 204 tanpa body. Error memakai RFC 9457 `application/problem+json; charset=utf-8`: `type`, `title`, `status`, `detail`, `instance`; validasi menambahkan `errors: [{ field, message }]`.

- Path ID harus string digit positif yang aman dikonversi ke integer; tolak `0`, negatif, pecahan, whitespace, huruf, notasi eksponensial, overflow sebelum repository dipanggil.
- POST/PUT menolak `id`, field tak dikenal, body kosong/malformed/non-object, field wajib hilang, dan seluruh pelanggaran schema. Kumpulkan semua kesalahan dalam satu respons 400.
- URL media absolut HTTP/HTTPS; teks wajib setelah trim; `price`/`quantity` integer non-negatif; currency kode tiga huruf; variant `(type,value)` unik; image alt text tersedia.
- Constraint unik atau constraint bisnis yang disebabkan input dipetakan ke validation 400, bukan 500.
- Error internal/log menyimpan detail diagnostik aman; response 500 tidak berisi stack, SQL, kredensial, atau konfigurasi.

## CORS dan konfigurasi

Konfigurasi `FRONTEND_ORIGIN` untuk origin frontend lokal/deploy. Izinkan method CRUD yang diperlukan dan header `Content-Type`; jangan memakai wildcard bersama credentials. Tidak ada autentikasi pada exercise ini. Frontend hanya mengetahui `VITE_API_BASE_URL` dan `VITE_PRODUCT_ID`; kredensial PostgreSQL tidak pernah dikirim ke browser.

Environment backend: `NODE_ENV`, `PORT`, `DATABASE_URL`, `DATABASE_SSL`, `FRONTEND_ORIGIN`. Sediakan `.env.example` tanpa secret production. PostgreSQL lokal menggunakan Docker Compose dan named volume; migrasi dijalankan sebelum server menerima traffic. Jangan menghapus volume sebagai bagian dari startup biasa.

## Observability, reliability, dan verifikasi

- Request ID dan log terstruktur untuk method, path, status, durasi, request ID; jangan log secret/body sensitif.
- `GET /health` memeriksa proses; readiness database dibedakan bila disediakan.
- Database test terpisah dan migrasi dijalankan sebelum integration suite.
- Cakupan verifikasi: detail MW75 lengkap dan urutan stabil, list summary, CRUD dan Location, invalid ID/body, Problem Details, rollback saat nested insert gagal, cascade delete, serta CORS dari origin frontend.
- Seed MW75 harus sesuai data konten PRD frontend: Black/Silver dengan empat image per warna, enam highlights, layanan, kolaborasi, tiga specification groups lengkap, dan tujuh box items.
- CI memvalidasi OpenAPI dan menjalankan test suite.

## Deployment

Jalankan migrasi setelah PostgreSQL healthy dan sebelum versi aplikasi menerima traffic. Gunakan connection pool `pg` dengan batas sesuai kapasitas database dan jumlah instance. URL aset harus dapat diakses oleh browser sesuai lingkungan deployment. Gunakan secret manager dan TLS untuk environment nonlokal.
