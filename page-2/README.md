# MW75 TUMI — Product Detail dan Product API

Project latihan full-stack untuk halaman detail headphone MW75 TUMI. Frontend mengambil konten produk dari REST API; backend menyimpan data produk dan konten pendukung di PostgreSQL.

## Isi project

- **Frontend:** halaman responsif MW75 TUMI, galeri Black/Silver, spesifikasi, isi kotak, dan cart drawer di browser.
- **Backend:** API CRUD produk dengan Express, validasi request, PostgreSQL, dokumentasi OpenAPI, dan Swagger UI.
- **Database:** produk, varian/stok per warna, galeri per varian, highlights, layanan, informasi kolaborasi, spesifikasi, dan item dalam kotak.

> Cart hanya disimpan di memori frontend. Cart tidak disimpan ke database dan akan kosong setelah halaman dimuat ulang. Checkout dan pembayaran belum termasuk scope. API CRUD belum memiliki autentikasi, jadi gunakan hanya untuk development/latihan.

## Tech stack

| Lapisan | Teknologi |
| --- | --- |
| UI | HTML, CSS, JavaScript, Vite |
| API | Node.js 22+, Express 5 |
| Validasi | Zod |
| Database | PostgreSQL 17, `pg` |
| Migrasi dan seed | SQL migration dan script Node.js |
| API documentation | OpenAPI 3.1, Swagger UI |
| Container database | Docker Compose |

## Struktur dan arsitektur backend

Backend memisahkan penerimaan HTTP, aturan produk, dan akses database supaya perubahan pada satu bagian tidak mencampur tanggung jawab bagian lain.

```text
backend/
├── docker-compose.yml
├── migrations/
│   └── 001_schema.sql
└── src/
    ├── app.js
    ├── server.js
    ├── config/         # environment dan koneksi PostgreSQL
    ├── routes/         # pemetaan URL/method ke controller
    ├── controllers/    # request HTTP dan bentuk response
    ├── services/       # aturan produk dan validasi ID
    ├── repositories/   # query SQL dan pemetaan record DB
    ├── schemas/        # schema Zod dan kontrak OpenAPI
    ├── middlewares/    # request ID dan error handler
    ├── errors/         # error aplikasi terstruktur
    └── scripts/        # migration, seed, validasi OpenAPI
```

| Folder/file | Gunanya |
| --- | --- |
| `backend/src/server.js` | Menjalankan HTTP server dan menutup connection pool saat proses berhenti. |
| `backend/src/app.js` | Merangkai Express middleware, CORS, health/readiness, Swagger, static assets, route API, dan error handler. |
| `backend/src/config/` | Memvalidasi environment dan membuat PostgreSQL connection pool. |
| `backend/src/routes/` | Mendaftarkan endpoint CRUD dan mengarahkannya ke controller. Tidak berisi query SQL. |
| `backend/src/controllers/` | Memanggil service dan membentuk status/header/envelope HTTP seperti `{ data, meta }`, `Location`, dan `204`. |
| `backend/src/services/` | Menjalankan aturan bisnis: validasi ID, validasi input produk, aturan MW75, dan not-found. |
| `backend/src/repositories/` | Tempat query SQL `SELECT`/`INSERT`/`UPDATE`/`DELETE`; query memakai parameter `$1`, `$2`, dan seterusnya. Repository juga merangkai relasi database menjadi objek produk API. |
| `backend/src/schemas/` | `product.schema.js` memvalidasi payload dengan Zod; `openapi.yaml` mendokumentasikan kontrak API untuk Swagger. |
| `backend/src/middlewares/` dan `backend/src/errors/` | Membuat request ID serta mengubah kegagalan menjadi RFC 9457 Problem Details. |
| `backend/src/scripts/` | Menjalankan schema migration, mengisi data awal MW75, dan memvalidasi OpenAPI. |
| `backend/migrations/001_schema.sql` | Membuat tabel, constraint, index, foreign key, dan cascade delete. Isinya SQL schema; query CRUD ada di repository. |
| `backend/docker-compose.yml` | Menjalankan PostgreSQL lokal dengan health check dan named volume persisten. |

### Alur request singkat

Contoh `GET /api/products/1`: Express di `app.js` menerima request → route memilih controller → controller memanggil service → service memvalidasi ID → repository menjalankan query dan menyusun detail dari tabel produk beserta relasinya → controller mengirim response. Jika terjadi error, error middleware membuat response Problem Details.

Untuk `POST` dan `PUT`, service memvalidasi payload sebelum repository menyimpan produk dan relasi nested di dalam transaksi. Jika salah satu langkah tulis gagal, transaksi di-rollback agar data tidak tersimpan sebagian.

## Prasyarat

- Node.js versi 22 atau lebih baru dan npm.
- Docker Desktop atau Docker Engine dengan Docker Compose aktif.
- Port lokal `5432` (PostgreSQL), `3000` (API), dan `5173` (Vite) tersedia.

Jika terminal menampilkan `docker: command not found` atau `Unknown command: docker`, pasang Docker Desktop sesuai OS, jalankan sampai statusnya aktif, lalu buka terminal baru.

## Setup pertama kali

> Buka tiga terminal dari root project. Perintah database/backend dijalankan di `backend/`; perintah UI dijalankan di `frontend/`.

### 1. Siapkan file konfigurasi

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Nilai default menghubungkan UI `http://localhost:5173` ke API `http://localhost:3000`, dan memuat produk ID `1`. Backend membatasi CORS ke `FRONTEND_ORIGIN` pada `backend/.env`.

### 2. Jalankan PostgreSQL

Di terminal pertama:

```sh
cd backend
docker compose up -d db
```

Compose mengunduh image `postgres:17-alpine` jika belum tersedia, menjalankan container, dan membuat database `mw75` otomatis. Volume bernama menyimpan data ketika container dihentikan.

### 3. Migrasikan database dan masukkan data MW75

Di terminal kedua:

```sh
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

`npm run migrate` membuat tabel. `npm run seed` memasukkan produk MW75 lengkap jika belum ada; menjalankan seed lagi tidak membuat duplikat MW75. API akan berjalan di `http://localhost:3000`.

### 4. Jalankan frontend

Di terminal ketiga:

```sh
cd frontend
npm install
npm run dev
```

Buka URL yang dicetak Vite, biasanya [http://localhost:5173](http://localhost:5173). Frontend mengambil data dari API; jangan membuka `index.html` langsung sebagai file.

## Cek layanan dan dokumentasi API

- API hidup: [http://localhost:3000/health](http://localhost:3000/health)
- API dan koneksi database siap: [http://localhost:3000/ready](http://localhost:3000/ready)
- Swagger UI / eksplorasi dan percobaan endpoint: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- OpenAPI JSON: [http://localhost:3000/openapi.json](http://localhost:3000/openapi.json)
- Detail produk seed: [http://localhost:3000/api/products/1](http://localhost:3000/api/products/1)

Di Swagger UI, pilih endpoint lalu **Try it out**. Untuk GET, masukkan ID produk `1` dan tekan **Execute**. `GET /api/products/1` seharusnya mengembalikan status `200` dan envelope `data`/`meta`. Endpoint POST menyediakan contoh produk uji yang valid; setelah berhasil, gunakan ID yang dikembalikan untuk mencoba GET, PUT, dan DELETE.

## Endpoint

| Method | Endpoint | Kegunaan |
| --- | --- | --- |
| `GET` | `/api/products` | Daftar ringkas produk; `meta.total` berisi jumlah hasil. |
| `GET` | `/api/products/:id` | Detail produk lengkap untuk halaman MW75. |
| `POST` | `/api/products` | Membuat produk lengkap. Respons `201` menyertakan header `Location`. |
| `PUT` | `/api/products/:id` | Mengganti seluruh field dan relasi produk. Bukan partial update. |
| `DELETE` | `/api/products/:id` | Menghapus produk dan relasi turunannya; sukses `204` tanpa body. |

Harga adalah integer dalam unit terkecil mata uang. Seed memakai `price: 75000` dan `currency: "USD"`, yang ditampilkan UI sebagai `$750.00`. `variants[].quantity` adalah stok per varian, bukan quantity cart.

## Mencoba API dengan curl

### Baca daftar dan detail

```sh
curl -i http://localhost:3000/api/products
curl -i http://localhost:3000/api/products/1
```

### Coba validasi ID dan error 404

```sh
curl -i http://localhost:3000/api/products/abc
curl -i http://localhost:3000/api/products/999999
```

Error menggunakan `application/problem+json`; ID tidak valid menghasilkan `400`, sedangkan ID valid yang tidak ditemukan menghasilkan `404`.

### Buat produk uji

Request ini membuat produk generik sederhana. API menghasilkan ID, jadi simpan ID dari respons untuk mencoba PUT/DELETE.

```sh
curl -i -X POST http://localhost:3000/api/products \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test API Product",
    "subtitle": "Sample product",
    "brand": "Demo",
    "price": 12500,
    "currency": "USD",
    "image": "https://example.com/test-hero.png",
    "description": "Produk uji untuk mencoba endpoint API.",
    "variants": [{
      "type": "color",
      "value": "Indigo",
      "quantity": 5,
      "images": [{
        "role": "hero",
        "url": "https://example.com/test-hero.png",
        "alt": "Produk uji warna Indigo"
      }]
    }],
    "highlights": [],
    "services": [],
    "collaboration": null,
    "specificationGroups": [],
    "boxItems": []
  }'
```

POST/PUT harus mengirim resource lengkap. Field tambahan ditolak; ID ditentukan server (POST) atau path (PUT). Untuk mengubah/menghapus produk seed, gunakan database development dengan sadar.

## Kontrak respons dan error

Respons sukses dengan body mengikuti envelope berikut:

```json
{
  "data": {},
  "meta": {}
}
```

`DELETE` sukses mengembalikan `204 No Content` tanpa body. Error memakai Problem Details RFC 9457, dengan `type`, `title`, `status`, `detail`, dan `instance`; error validasi dapat menyertakan `errors` berisi field dan pesannya. Stack trace dan detail database tidak dikirim ke client.

## Perintah developer

Dari direktori `backend/`:

```sh
npm run dev               # API dengan Node watch mode
npm start                 # API mode biasa
npm run migrate           # Terapkan schema SQL
npm run seed              # Isi data awal MW75 (idempotent untuk produk MW75)
npm run validate:openapi  # Parse dan validasi dokumen OpenAPI
```

Dari direktori `frontend/`:

```sh
npm run dev      # Server development Vite
npm run build    # Build frontend ke frontend/dist
npm run preview  # Sajikan hasil build secara lokal
```

## Konfigurasi penting

Backend membaca `backend/.env`:

| Variable | Default | Kegunaan |
| --- | --- | --- |
| `PORT` | `3000` | Port API. |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/mw75` | Koneksi PostgreSQL. |
| `DATABASE_SSL` | `false` | TLS database bila environment memerlukannya. |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Origin frontend yang diizinkan oleh CORS. |
| `PUBLIC_API_URL` | `http://localhost:3000` | Base URL yang dipakai seed untuk URL gambar yang disajikan API. |

Frontend membaca `frontend/.env`:

| Variable | Default | Kegunaan |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Origin API yang dipanggil browser. |
| `VITE_PRODUCT_ID` | `1` | ID detail produk yang dimuat. |

Jika port atau host berubah, sesuaikan `VITE_API_BASE_URL`, `PUBLIC_API_URL`, dan `FRONTEND_ORIGIN` agar cocok. Jangan masukkan kredensial database ke environment frontend.

## Menghentikan dan mereset lokal

- Hentikan server frontend/backend dengan `Ctrl+C` pada terminal masing-masing.
- Hentikan PostgreSQL tanpa menghapus data: dari `backend/`, jalankan `docker compose down`.
- Data database disimpan dalam named volume (nama aktual dapat memiliki prefix project Compose). Menghapus volume akan menghapus seluruh data lokal. Hindari `docker compose down -v` kecuali memang ingin reset total.

## Catatan review untuk kontributor

- Pemisahan backend: routes → controller → service → repository; database diakses melalui query berparameter.
- Gambar produk disajikan oleh backend pada `/assets/...` dari `frontend/assets`, sementara respons produk menyimpan URL tersebut.
- Seeder dan migration berada di `backend/src/scripts/` dan `backend/migrations/`.
- Package backend saat ini menyediakan validasi OpenAPI, tetapi belum mendefinisikan script atau folder automated test. Sampai suite ditambahkan, panduan API di atas mendukung pemeriksaan manual melalui Swagger UI/curl.
- CRUD belum dilindungi autentikasi/otorisasi dan tidak ditujukan untuk deployment publik tanpa kontrol akses tambahan.

Untuk rincian kontrak dan desain data, lihat [PRD backend](backend/context/prd.md), [arsitektur backend](backend/context/architecture.md), dan [PRD frontend](frontend/context/prd.md). Panduan backend tambahan tersedia di [backend/README.md](backend/README.md).
