# Task List Backend — Product API MW75 TUMI

Task list ini diturunkan dari [PRD](prd.md) dan [arsitektur](architecture.md). API harus menyuplai seluruh konten produk halaman MW75, bukan hanya field inti.

## 1. Fondasi dan database

- [x] Siapkan Node.js LTS, Express, `pg`, validator (Zod/Joi), migrasi, Swagger UI, dan tool verifikasi.
- [x] Buat struktur aplikasi sesuai architecture.md, `.env.example`, konfigurasi tervalidasi, dan PostgreSQL Compose/healthcheck.
- [x] Buat migrasi products dengan name, subtitle, brand, price minor unit, currency, description, image, timestamps, dan constraints.
- [x] Buat migrasi variants serta variant_images dengan stok per varian, urutan, role gambar, alt text, unique varian case-insensitive, dan cascade.
- [x] Buat tabel terstruktur untuk highlights, services, collaboration, specification groups/items, serta box items lengkap dengan posisi dan cascade.
- [x] Buat seed lengkap MW75 TUMI: Black/Silver, masing-masing empat foto, enam highlights, tiga layanan, konten kolaborasi, seluruh spesifikasi dan tujuh box items.
- [x] Pastikan URL seed gambar dapat dimuat browser dari frontend pada environment lokal/deploy; API menyajikan `frontend/assets` pada `/assets`.

## 2. Kontrak API, validasi, dan dokumentasi

- [x] Buat ProductSummary, Product detail, ProductInput, error schemas yang konsisten dengan PRD.
- [x] Pastikan detail memuat `id`, `name`, `subtitle`, `brand`, `price`, `currency`, `image`, `variants[]` dengan `type/value/quantity/images[]`, `description`, `highlights`, `services`, `collaboration`, `specificationGroups`, dan `boxItems`.
- [x] Validasi ID sebelum query; validasi semua field wajib/nested fields, URL HTTP(S), batas panjang, integer aman nonnegatif, uniqueness, role foto, dan penolakan field tak dikenal.
- [x] Kembalikan seluruh error validasi dalam RFC 9457 Problem Details; respons sukses memakai envelope `{ data, meta }`.
- [x] Definisikan satu OpenAPI 3.1 source untuk semua endpoint, skema lengkap, contoh MW75, header Location, status 204, serta Problem Details.
- [x] Sajikan Swagger UI di `/api-docs`, OpenAPI JSON di `/openapi.json`, dan validasi spec di CI melalui script `validate:openapi`.

## 3. Implementasi endpoint

- [x] `GET /api/products`: kembalikan ProductSummary dan `meta.total`.
- [x] `GET /api/products/:id`: kembalikan detail lengkap termasuk nested content dalam urutan posisi.
- [x] `POST /api/products`: buat seluruh product + nested records secara atomik; balas `201`, envelope, dan Location.
- [x] `PUT /api/products/:id`: penggantian penuh termasuk nested records secara atomik; rollback menjaga data lama jika gagal.
- [x] `DELETE /api/products/:id`: hapus product beserta seluruh relasi dengan cascade; balas `204` tanpa body atau `404`.
- [x] Pisahkan controller, service, repository, schema, dan response mapper; semua SQL terparameterisasi.
- [x] Tambahkan request ID, structured logging, `/health`, readiness database yang terpisah, dan CORS terbatas untuk origin frontend konfigurasi.
- [x] Pastikan error 500 generik dan tidak mengekspos stack, SQL, atau secret.

## 4. Integrasi dan verifikasi

- [x] Sediakan `VITE_API_BASE_URL` dan `VITE_PRODUCT_ID` pada konfigurasi frontend serta dokumentasikan pemakaian.
- [x] Frontend mengambil data produk dari API tanpa hardcode product fallback; validasi browser end-to-end masih menunggu service dependencies dan PostgreSQL tersedia.
- [ ] Verifikasi konten API mencakup dua warna, delapan foto, enam highlights, layanan, kolaborasi, seluruh data spesifikasi, dan tujuh box items.
- [ ] Verifikasi harga `75000 USD` dirender sebagai `$750.00` dan quantity tetap melekat per varian.
- [ ] Siapkan database khusus test dan migrasikan sebelum integration suite.
- [ ] Verifikasi list/detail/CRUD, envelope, Location, 204, invalid ID/body, Problem Details, nested transaction rollback, cascade, dan CORS.
- [ ] Verifikasi alur UI galeri/warna/cart tetap bekerja; backend tidak perlu menyimpan cart.
- [ ] Pastikan OpenAPI valid, Swagger dapat dibuka, dan README menjelaskan env, migrasi, seed, serta startup stack.
