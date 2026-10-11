# PRD — Product API untuk Halaman MW75 TUMI

## Ringkasan

API ini memasok data halaman detail produk MW75 TUMI pada aplikasi frontend. Sumber data adalah PostgreSQL dan seluruh konten produk yang ditampilkan pada halaman diambil dari API, bukan ditulis sebagai data produk di JavaScript/HTML. Frontend tetap bertanggung jawab atas presentasi, pemilihan foto/warna, dan keranjang sementara di memori browser. Keranjang, checkout, dan pembayaran bukan tanggung jawab API pada versi ini.

API menyediakan daftar, detail, tambah, ubah penuh, dan hapus produk. Kontrak inti setiap produk mencakup nama, harga, foto, variasi beserta stok, dan deskripsi. Agar seluruh halaman MW75 dapat dirender, kontrak juga menyediakan subtitle, brand, galeri foto per warna, fitur unggulan, informasi layanan, cerita kolaborasi, spesifikasi, dan isi kemasan.

## Tujuan dan ruang lingkup

- Mengirim data lengkap MW75 TUMI untuk seluruh section halaman yang bersumber dari konten produk.
- Menyediakan endpoint CRUD produk untuk pengelolaan katalog.
- Menyediakan kontrak JSON stabil, validasi input, serta error konsisten.
- Menyimpan data secara persisten di PostgreSQL.

Di luar ruang lingkup: autentikasi/admin UI, unggah atau hosting aset, cart/persistensi cart, checkout, pembayaran, kalkulasi pengiriman/pajak, inventori real-time, dan pemesanan. Frontend menggunakan URL aset lokal atau URL yang telah tersedia; backend menyimpan URL, bukan file gambar.

## Konsumen dan tanggung jawab

| Bagian | Tanggung jawab |
| --- | --- |
| Backend API | Menyimpan, memvalidasi, dan menyajikan konten produk; memberi jumlah stok pada setiap varian. |
| Frontend | Memuat produk melalui API, merender konten, mengelola pilihan warna/galeri, dan mengelola cart satu item di memori sesuai PRD frontend. |
| Cart | Bukan data backend pada versi ini. Quantity cart dibatasi satu oleh frontend; quantity variasi dari backend adalah stok katalog, bukan quantity cart. |

## Model respons Product

`price` berupa integer minor unit mata uang: untuk MW75, USD cents (`75000`) agar frontend dapat menampilkan `$750.00`. `currency` menyatakan `USD`. Jangan mencampur harga Rupiah dan USD.

```json
{
  "id": 1,
  "name": "MW75 TUMI",
  "subtitle": "Noise-Cancelling Wireless Headphones",
  "brand": "Master & Dynamic",
  "price": 75000,
  "currency": "USD",
  "image": "https://example.com/mw75-black-hero.png",
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
    },
    {
      "id": 2,
      "type": "color",
      "value": "Silver",
      "quantity": 10,
      "images": [
        { "role": "hero", "url": "https://example.com/silver-hero.png", "alt": "MW75 TUMI Silver, tampak utama" },
        { "role": "front", "url": "https://example.com/silver-front.png", "alt": "MW75 TUMI Silver, tampak depan" },
        { "role": "engraving", "url": "https://example.com/silver-engraving.png", "alt": "Detail ukiran MW75 TUMI Silver" },
        { "role": "straight", "url": "https://example.com/silver-straight.png", "alt": "MW75 TUMI Silver, tampak samping" }
      ]
    }
  ],
  "description": "Headphone over-ear dengan driver beryllium 40mm dan Adaptive Active Noise Cancellation.",
  "highlights": [
    { "title": "Active Noise Cancellation", "description": "Adaptive ANC", "icon": "anc" }
  ],
  "services": [
    { "title": "Free Shipping", "description": "Free US Ground shipping on orders of $99 or more" },
    { "title": "Free Returns", "description": "14-day returns" },
    { "title": "Product Protection", "description": "Manufacturer warranty" }
  ],
  "collaboration": {
    "title": "Master & Dynamic x TUMI",
    "description": "A collaboration combining premium sound and TUMI design.",
    "image": "https://example.com/tumi-collaboration.png",
    "imageAlt": "Kolaborasi Master & Dynamic dan TUMI"
  },
  "specificationGroups": [
    {
      "title": "Materials and Design",
      "items": [{ "label": "Weight", "value": "338g" }]
    }
  ],
  "boxItems": [
    { "name": "Wireless Headphones", "image": "https://example.com/box-headphones.png", "imageAlt": "Wireless Headphones" }
  ]
}
```

`image` adalah foto utama/fallback produk dan harus sama dengan foto hero varian default (Black untuk MW75). `variants[].images` berisi foto varian yang dipakai galeri; urutan array adalah urutan galeri. Setiap varian memiliki stok sendiri. Versi halaman ini hanya menawarkan warna; `type` tetap eksplisit agar model dapat mengakomodasi ukuran di masa depan tanpa format payload kedua. Tidak ada agregasi quantity ambigu di tingkat produk.

`highlights`, `services`, `specificationGroups`, dan `boxItems` mempertahankan urutan yang dikirim API. Backend menyimpan ikon sebagai identifier/URL, bukan markup HTML. Tautan navigasi, Learn more, tombol cart, dan elemen statis nonproduk tetap dapat ditulis di frontend. Isi/label sections yang berubah berdasarkan produk harus datang dari API.

## Endpoint

| Method dan path | Tujuan | Sukses |
| --- | --- | --- |
| `GET /api/products` | Daftar produk ringkas untuk katalog | `200`, `{ data: ProductSummary[], meta: { total } }` |
| `GET /api/products/:id` | Detail lengkap untuk halaman produk | `200`, `{ data: Product, meta: {} }` |
| `POST /api/products` | Buat produk lengkap | `201`, envelope detail dan header `Location` |
| `PUT /api/products/:id` | Ganti seluruh data produk dan relasinya | `200`, envelope detail |
| `DELETE /api/products/:id` | Hapus produk dan data turunannya | `204` tanpa body |

Frontend halaman MW75 menggunakan `GET /api/products/:id` (sementara ID dapat dikonfigurasi melalui `VITE_PRODUCT_ID`). Untuk daftar, respons boleh berisi ringkasan dengan `id`, `name`, `price`, `currency`, dan `image`; detail harus berisi seluruh field pada model Product. Semua respons sukses ber-body menggunakan `application/json; charset=utf-8` dan envelope `{ "data": ..., "meta": ... }`.

POST/PUT memakai JSON dengan field produk yang sama seperti model respons kecuali `id`; `variants` berupa array varian dan tiap varian memuat `type`, `value`, `quantity`, serta `images`. Nested content yang diwajibkan untuk detail juga diterima pada create/update. PUT mengganti seluruh resource; field wajib yang hilang ditolak. ID dibuat server.

## Validasi dan error

- ID path harus digit positif dalam rentang aman JavaScript; format invalid menghasilkan `400` sebelum query.
- `name`, `description`, `subtitle`, label, teks, alt text, dan nilai varian setelah trim tidak boleh kosong dan memiliki batas panjang yang didokumentasikan di schema.
- `price` integer non-negatif; `currency` kode ISO 4217 tiga huruf (MW75 memakai `USD`).
- Semua URL foto absolut HTTP/HTTPS. `variants` harus berisi minimal satu nilai unik per `(type, value)` tanpa membedakan kapitalisasi; quantity integer non-negatif.
- Untuk halaman MW75, setiap varian warna harus memiliki empat foto berperan `hero`, `front`, `engraving`, `straight`. Validasi ini berlaku untuk produk kategori/kontrak MW75; bila API dipakai bagi produk umum, aturan galeri mengikuti tipe produk dan harus dinyatakan eksplisit, bukan memaksa seluruh produk memiliki empat foto.
- Field tak dikenal ditolak. Semua kesalahan validasi dikembalikan sekaligus dalam `errors`.
- Error memakai RFC 9457 `application/problem+json; charset=utf-8`, dengan `type`, `title`, `status`, `detail`, `instance`; validasi menambahkan `errors: [{ field, message }]`.
- Status utama: `400` invalid ID/body, `404` produk tidak ada, `500` error tak terduga generik tanpa detail internal.

## User stories

1. Sebagai pengunjung, saya ingin melihat nama, subjudul, brand, harga, dan deskripsi MW75 dari data API.
2. Sebagai pengunjung, saya ingin melihat galeri yang tepat saat memilih Black atau Silver.
3. Sebagai pengunjung, saya ingin melihat fitur, layanan, kolaborasi TUMI, spesifikasi, dan isi kemasan lengkap.
4. Sebagai frontend, saya ingin menerima quantity stok pada setiap warna agar dapat menampilkan ketersediaan bila dibutuhkan.
5. Sebagai admin katalog, saya ingin CRUD data lengkap produk tanpa kehilangan relasi gambar dan konten.
6. Sebagai developer, saya ingin kesalahan ID dan body konsisten dan dapat ditangani frontend.

## Acceptance criteria

- [ ] `GET /api/products/:id` untuk MW75 mengembalikan envelope valid dan seluruh field inti: `id`, `name`, `price`, `currency`, `image`, `variants`, `description`.
- [ ] Respons detail memuat subtitle, brand, foto per warna, enam highlights, layanan, konten kolaborasi, tiga grup spesifikasi lengkap, dan tujuh item box sesuai PRD frontend.
- [ ] Setiap warna memiliki galeri empat foto dengan urutan/alt text, dan quantity non-negatif tersimpan pada varian warna tersebut.
- [ ] Frontend dapat merender seluruh konten produk tanpa hardcode data MW75; pemilihan warna mengubah galeri dari data varian API.
- [ ] Harga `75000 USD` ditampilkan frontend sebagai `$750.00`; nilai harga tidak bergantung pada locale server.
- [ ] CRUD menjaga semua data nested secara atomik. POST memberi ID dan Location; PUT mengganti penuh; DELETE menghapus relasi terkait.
- [ ] ID/body invalid menghasilkan RFC 9457 `400`; ID valid tak ditemukan menghasilkan `404`; kegagalan tak terduga menghasilkan `500` aman.
- [ ] CORS mengizinkan origin frontend development yang dikonfigurasi tanpa membuka kredensial.
- [ ] OpenAPI mendokumentasikan semua endpoint, schema detail/summary/input, nested content, serta error.

## Definition of done

- [ ] Lima endpoint CRUD berjalan dengan PostgreSQL dan tersedia seed MW75 lengkap yang sesuai PRD frontend.
- [ ] Frontend memuat detail menggunakan `GET /api/products/:id`; tidak ada data produk MW75 yang di-hardcode sebagai fallback tersembunyi.
- [ ] Semua acceptance criteria diverifikasi automated test atau Postman dan alur frontend utama berhasil memakai API.
- [ ] Swagger UI tersedia di `/api-docs`, OpenAPI di `/openapi.json`, dan spec lolos validator.
- [ ] README menjelaskan env API base URL/product ID, migrasi, seed, CORS, dan cara menjalankan stack lokal.
