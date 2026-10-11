# Task List Frontend — Halaman Detail Produk MW75 TUMI

Task list ini mengikuti [PRD frontend](prd.md) dan kontrak [Product API](../../backend/context/prd.md). Semua konten produk datang dari backend; interaksi UI dan cart tetap dikelola frontend.

## 1. Integrasi API dan state halaman

- [ ] Baca `VITE_API_BASE_URL` dan `VITE_PRODUCT_ID` dari konfigurasi; jangan menaruh URL/ID lingkungan langsung di logika tampilan.
- [ ] Muat detail dengan `GET {VITE_API_BASE_URL}/api/products/{VITE_PRODUCT_ID}` dan parsing envelope `{ data, meta }`.
- [ ] Validasi keberadaan field inti yang dibutuhkan UI; tampilkan state loading, error/retry, dan produk tidak ditemukan dengan pesan yang dapat dipahami.
- [ ] Format `price` dari minor unit bersama `currency` (MW75 `75000 USD` menjadi `$750.00`); jangan hardcode harga/nama produk.
- [ ] Render nama, subtitle, brand, deskripsi, foto utama, highlights, services, collaboration, specificationGroups, dan boxItems dari respons API.
- [ ] Buat mapping icon identifier ke aset lokal frontend bila API mengirim identifier icon; jangan merender HTML dari API.
- [ ] Tetapkan kondisi awal setelah data tersedia: varian warna pertama/default Black, foto role `hero`, cart kosong, drawer tertutup.

## 2. Galeri dan pilihan varian

- [ ] Render swatch dari `data.variants`, termasuk label/warna aktif dan aksesibilitasnya.
- [ ] Saat varian warna berubah, update label dan gunakan `variant.images` terkait; reset foto aktif ke `hero`/indeks pertama.
- [ ] Render urutan foto dari array `images` (role hero, front, engraving, straight) dan alt text dari API.
- [ ] Implementasikan Previous/Next melingkar pada array foto varian aktif.
- [ ] Jangan ubah varian yang sudah masuk cart ketika pilihan halaman berubah.
- [ ] Gunakan `quantity` varian hanya sebagai stok katalog bila stok ditampilkan; jangan menggunakannya sebagai quantity cart.

## 3. Keranjang dan drawer

- [ ] Simpan cart di memori JavaScript saja; kondisi awal kosong dan hilang setelah reload.
- [ ] Add to Cart menambahkan produk dan varian terpilih, membuka drawer, dan memperbarui badge cart.
- [ ] Batasi item MW75 pada quantity cart maksimal 1; penambahan kedua tidak membuka drawer dan menampilkan pesan error dari PRD.
- [ ] Remove mengosongkan cart, memperbarui badge, lalu menampilkan empty state dan Continue shopping.
- [ ] Tampilkan item drawer memakai snapshot data pilihan (nama, foto varian, warna, harga), quantity 1, dan total terformat.
- [ ] Buka drawer dari ikon cart; tutup lewat Close/Escape; View Cart dan Checkout tetap placeholder.
- [ ] Pesan batas hilang setelah item dihapus dan berhasil ditambahkan kembali.

## 4. Layout, aksesibilitas, dan konten

- [ ] Pertahankan header, announcement, breadcrumb, support, dan footer sesuai PRD; elemen navigasi nonproduk boleh tetap statis/placeholder.
- [ ] Tampilkan galeri dan informasi produk berdampingan pada desktop dan bertumpuk pada mobile.
- [ ] Pastikan halaman dan drawer bisa dipakai pada lebar 375 px tanpa scroll horizontal.
- [ ] Pastikan seluruh kontrol keyboard accessible, fokus terlihat, fokus masuk drawer saat dibuka, dan kembali ke pemicu saat ditutup.
- [ ] Gunakan alt text API untuk gambar produk dan item dalam kotak.
- [ ] Pastikan urutan dan isi tiga grup spesifikasi serta tujuh box items mengikuti respons API.

## 5. Verifikasi integrasi

- [ ] Cocokkan respons API MW75 dengan UI: dua warna Black/Silver, galeri empat foto per warna, enam highlights, layanan, kolaborasi, spesifikasi lengkap, tujuh item box.
- [ ] Verifikasi UI untuk loading, API tidak tersedia, HTTP 404, respons JSON malformed, dan field wajib hilang.
- [ ] Verifikasi pemilihan warna/galeri, Add/Remove cart, batas quantity cart, drawer, reload, keyboard, mobile, dan desktop.
- [ ] Pastikan tidak ada hardcode data produk MW75 sebagai fallback tersembunyi dan tidak ada akses database langsung.
- [ ] Pastikan cart tidak disimpan ke localStorage/sessionStorage dan tidak dikirim ke API pada scope ini.
