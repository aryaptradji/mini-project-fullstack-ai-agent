# PRD — Halaman Detail Produk MW75 TUMI

| Informasi | Keterangan |
|---|---|
| Versi | 1.0 |
| Status | Draft untuk exercise |
| Konteks | Pembelajaran Front-End Development |
| Teknologi | HTML, CSS, dan JavaScript murni |
| Scope | Satu halaman detail MW75 TUMI yang memuat konten produk dari Product API |
| Sumber | masterdynamic.com/products/mw75-tumi (diakses 1 Oktober 2026) |

*Nama, harga, pilihan warna, dan spesifikasi di bawah diambil dari halaman produk Master & Dynamic dan dapat berubah sewaktu-waktu.*

## 1. Product Overview

Halaman detail produk MW75 TUMI membantu pengguna memahami headphone noise-cancelling wireless hasil kolaborasi Master & Dynamic dan TUMI, mulai dari fitur, spesifikasi, hingga isi kemasan, lalu memilih warna sebelum menambahkan produk ke keranjang.

Pada versi ini, halaman memuat informasi produk dari backend Product API serta menyediakan interaksi pemilihan warna, galeri foto, dan keranjang berbentuk drawer. Pilihan warna, galeri, dan cart adalah state antarmuka; cart tetap sementara di memori browser. Halaman View Cart, checkout, dan pembayaran belum termasuk scope.

**Data produk:**

| Data | Nilai |
|---|---|
| Nama | MW75 TUMI |
| Subjudul | Noise-Cancelling Wireless Headphones |
| Brand | Master & Dynamic (kolaborasi dengan TUMI) |
| Harga | $750.00 per item, sama untuk semua warna |
| Deskripsi | Headphone over-ear dengan driver beryllium 40mm dan Adaptive Active Noise Cancellation. Dibuat dari aluminium anodized dan kulit lambskin yang ringan untuk pemakaian seharian. |
| Warna | Black, Silver |
| Foto | Galeri 4 foto per warna: Foto Utama (Hero), Tampak Depan (Front), Detail Ukiran (Engraving), dan Tampak Samping (Straight) |
| Fitur unggulan | 6 poin ringkas (lihat Lampiran A) |
| Tech Specs | 3 kelompok spesifikasi (lihat Lampiran B) |
| In The Box | 7 item (lihat Lampiran C) |
| Layanan | Gratis ongkir darat AS untuk pembelian $99 ke atas, retur 14 hari, dan garansi pabrikan |

Konten utama halaman mencakup **announcement bar, header (dengan ikon cart), breadcrumb, galeri foto, nama produk, harga, pilihan warna, tombol Add to Cart, drawer keranjang, fitur unggulan, informasi layanan, deskripsi, tech specs, isi kemasan, support, dan footer**.

## 2. Problem + Target User

### Problem

Headphone premium memerlukan informasi yang lengkap dan jelas agar pengguna yakin sebelum membeli. Pengguna perlu memahami fitur, spesifikasi, isi kemasan, dan kebijakan toko, serta mengetahui warna mana yang sedang dipilih.

Masalah yang ingin diselesaikan:

- Tanpa tampilan yang terstruktur, fitur dan spesifikasi teknis sulit dibandingkan.
- Tanpa penanda yang jelas, pengguna tidak tahu warna mana yang sedang dipilih, dan foto bisa tidak sesuai dengan warna tersebut.
- Tanpa informasi isi kemasan, pengiriman, retur, dan garansi di halaman, pengguna bisa ragu untuk membeli.
- Tanpa feedback setelah menekan Add to Cart, pengguna tidak yakin produknya sudah masuk keranjang.
- Tanpa batas dan pesan yang jelas, pengguna bisa menambahkan item yang sama berulang kali tanpa tahu ada batas maksimal.

### Target User

Calon pembeli headphone premium yang mengakses toko melalui desktop atau smartphone dan ingin melihat detail serta memilih warna produk.

**Kebutuhan utama:** melihat foto produk, memahami harga, fitur, dan spesifikasi, lalu memilih warna sebelum menambahkan ke keranjang.

## 3. Goals + Non-Goals

### Goals

1. Menampilkan informasi produk dengan jelas dan mudah dibaca.
2. Memungkinkan pengguna memilih satu warna (Black atau Silver) dan menjelajahi galeri foto.
3. Menampilkan fitur unggulan, tech specs, dan isi kemasan secara terstruktur.
4. Menampilkan informasi layanan: pengiriman, retur, dan garansi.
5. Menambahkan produk ke keranjang dan menampilkan drawer keranjang berisi ringkasan item dan total.
6. Memungkinkan pengguna menghapus item di keranjang.
7. Memberikan pengalaman yang nyaman pada desktop dan mobile.

### Non-Goals

Versi ini tidak mencakup:

- Login dan registrasi.
- Penyimpanan keranjang setelah halaman dimuat ulang (isi keranjang hanya disimpan di memori).
- Halaman View Cart, checkout, dan pembayaran (tombolnya hanya placeholder).
- Pembelian proteksi tambahan (product protection add-on) dan perhitungan ongkos kirim.
- Pergantian negara atau mata uang, pencarian, dan fungsi menu navigasi.
- Form newsletter, review, rating, wishlist, atau perbandingan produk.
- Pengelolaan produk melalui halaman admin.
- Gift Wrap dan Add gift message.
- Rekomendasi produk 'Complete with' di dalam keranjang, termasuk status Sold Out.

## 4. User Flow

1. Pengguna membuka halaman detail produk MW75 TUMI.
2. Halaman menampilkan breadcrumb, galeri foto, nama, subjudul, dan harga produk.
3. Pengguna melihat foto lain melalui tombol Previous dan Next.
4. Pengguna memilih warna Black atau Silver.
5. Galeri foto dan label warna terpilih berubah sesuai warna.
6. Pengguna menggulir halaman untuk membaca fitur, info layanan, deskripsi, tech specs, dan isi kemasan.
7. Pengguna menekan tombol **“Add to Cart”**.
8. Produk ditambahkan ke keranjang, angka di ikon cart bertambah, dan drawer keranjang terbuka otomatis.
9. Pengguna melihat item di drawer: foto, nama, warna, harga, quantity, dan total.
10. Pengguna menekan Remove, lalu total dan angka di ikon cart ikut diperbarui.
11. Pengguna menekan Close untuk menutup drawer.
12. Pengguna dapat membuka kembali drawer lewat ikon cart di header.

**Kondisi awal:**

- Galeri menampilkan foto Hero produk warna Black.
- Warna Black terpilih dan label warna menampilkan “Black”.
- Harga menampilkan $750.00.
- Tombol Add to Cart aktif.
- Keranjang kosong, ikon cart menampilkan 0, dan drawer tertutup.

Tombol View Cart dan Checkout hanya placeholder dan tidak memulai transaksi.

## 5. Features + Requirements

| ID | Fitur | Requirement |
|---|---|---|
| FR-01 | Header | Menampilkan banner "Free US Ground shipping on orders of $99 or more", logo Master & Dynamic, menu (Headphones, Earphones, Accessories, Collaborations, Blog), ikon search, akun, dan keranjang dengan badge jumlah item, pemilih negara "US", serta tombol "Support". Menu, pemilih negara, dan tombol Support berupa tampilan statis (tidak berfungsi). |
| FR-02 | Breadcrumb | Menampilkan jalur “All Products > MW75 TUMI”. |
| FR-03 | Galeri foto | Menampilkan 4 foto produk tanpa mengubah proporsi gambar, dengan tombol Previous dan Next. Setiap foto memiliki teks alternatif yang sesuai. |
| FR-04 | Informasi produk | Menampilkan nama “MW75 TUMI”, subjudul “Noise-Cancelling Wireless Headphones”, dan harga $750.00. |
| FR-05 | Pilihan warna | Menyediakan Black dan Silver sebagai swatch bulat. Swatch aktif punya ring penanda, dan label warna terpilih tampil di samping judul "Color". |
| FR-06 | Perubahan foto | Galeri berubah sesuai warna yang dipilih dan kembali ke foto pertama. |
| FR-07 | Add to Cart | Add to Cart menambahkan produk ke keranjang dan membuka drawer. Jika item sudah ada di keranjang dengan jumlah maksimal, Add to Cart tidak menambah item lagi. Halaman menampilkan pesan error merah "The maximum quantity of this item is already in your cart." di atas tombol. Drawer tidak terbuka lagi. |
| FR-08 | Drawer keranjang | Panel muncul dari sisi kanan, halaman di belakangnya digelapkan. Menampilkan judul "Cart (jumlah item)" dan tombol Close. |
| FR-09 | Item keranjang | Menampilkan foto, nama, warna, harga, quantity, dan tombol Remove. |
| FR-10 | Quantity di keranjang | Quantity di drawer menampilkan 1 dan tidak bisa lebih dari 1. Cara mengurangi isi keranjang hanya lewat Remove. |
| FR-11 | Total | Menampilkan total (harga × quantity) dalam format "$750.00 USD" dan teks "Taxes and shipping calculated at checkout". |
| FR-12 | Aksi keranjang | Tombol View Cart dan Checkout tampil, tapi hanya placeholder (tidak berpindah halaman). |
| FR-13 | Tombol cart di header | Ikon keranjang di header menampilkan jumlah item dan membuka drawer yang sama. Angkanya ikut berubah saat item ditambah atau dihapus. Jika keranjang kosong, drawer menampilkan "Your cart is empty" dan tombol Continue shopping. |
| FR-14 | Fitur unggulan | Menampilkan 6 poin fitur beserta ikon: ANC, material, driver, baterai, Bluetooth, dan mikrofon (Lampiran A). |
| FR-15 | Info layanan | Menampilkan Free Shipping, Free Returns (14 hari), dan Product Protection (garansi pabrikan). |
| FR-16 | Brand TUMI | Menampilkan section kolaborasi Master & Dynamic x TUMI beserta gambar dan deskripsi singkat. |
| FR-17 | Deskripsi produk | Menampilkan judul MW75 Active Noise-Cancelling Wireless Headphones, deskripsi, dan tautan “Learn more” serta “Discover the full TUMI collaboration”. |
| FR-18 | Tech Specs | Menampilkan spesifikasi dalam 3 kelompok: Materials and Design, Sound and Features, serta Connectivity and Charging (Lampiran B). |
| FR-19 | In The Box | Menampilkan 7 item isi kemasan, masing-masing dengan gambar dan nama (Lampiran C). |
| FR-20 | Support | Menampilkan ajakan bantuan dengan tombol “Support Center”. |
| FR-21 | Footer | Menampilkan tautan Help & Info, About, Gifting, tautan legal, ikon media sosial, alamat, dan hak cipta. |
| FR-22 | Tampilan responsif | Pada desktop, galeri dan informasi produk ditampilkan berdampingan. Pada mobile, konten disusun vertikal. Drawer keranjang tetap bisa digunakan pada lebar 375 px: mengisi lebar layar, tanpa scroll horizontal, dan tombol Close, Remove, View Cart, serta Checkout tetap mudah dijangkau. |

### Aturan Interaksi

- Pilihan warna aktif memiliki penanda visual serta status yang dapat dikenali pembaca layar.
- Memilih warna baru menggantikan pilihan sebelumnya.
- Perubahan warna mereset galeri ke foto pertama.
- Tombol Next pada foto terakhir kembali ke foto pertama, dan Previous pada foto pertama menuju foto terakhir.
- Harga tetap $750.00 untuk semua warna.
- Harga menggunakan format Dolar AS dengan dua desimal, misalnya $750.00.
- Add to Cart menambahkan produk dengan warna terpilih ke keranjang, menambah angka di ikon cart, lalu membuka drawer keranjang.
- Setiap item dibatasi maksimal 1 di keranjang. Jika Add to Cart ditekan saat item sudah ada di keranjang, quantity tetap 1, drawer tidak terbuka, dan muncul pesan error merah di atas tombol: "The maximum quantity of this item is already in your cart."
- Pesan error hilang ketika item berhasil ditambahkan kembali setelah dihapus dari keranjang.
- Mengubah warna di halaman tidak mengubah isi keranjang.
- Drawer muncul dari sisi kanan dengan latar halaman digelapkan. Drawer bisa dibuka lewat ikon cart di header dan ditutup lewat tombol Close atau tombol Esc.
- Saat drawer terbuka, fokus keyboard pindah ke dalam drawer.
- Quantity di drawer menampilkan 1 dan tidak bisa dinaikkan. Total dihitung dari harga × quantity dan ditampilkan dalam format "$750.00 USD".
- Tombol Remove menghapus item. Setelah itu drawer menampilkan "Your cart is empty" dengan tombol Continue shopping, dan angka di ikon cart kembali 0.
- Tombol View Cart dan Checkout bersifat placeholder dan tidak berpindah halaman.
- Tautan navigasi, footer, dan "Learn more" juga placeholder dan tidak berpindah halaman.
- Pilihan warna, galeri, dan isi keranjang kembali ke kondisi awal ketika halaman dimuat ulang.

## 6. User Stories

| ID | User Story |
|---|---|
| US-01 | Sebagai calon pembeli, saya ingin melihat foto dan deskripsi headphone agar dapat memahami produk yang ditawarkan. |
| US-02 | Sebagai calon pembeli, saya ingin mengetahui harga serta informasi pengiriman, retur, dan garansi agar dapat mempertimbangkan pembelian. |
| US-03 | Sebagai calon pembeli, saya ingin memilih warna dan melihat fotonya agar dapat membandingkan tampilan produk. |
| US-04 | Sebagai calon pembeli, saya ingin melihat fitur unggulan dan tech specs agar dapat menilai kesesuaian produk dengan kebutuhan saya. |
| US-05 | Sebagai calon pembeli, saya ingin mengetahui isi kemasan agar tahu aksesori apa saja yang saya dapatkan. |
| US-06 | Sebagai calon pembeli, saya ingin melihat isi keranjang setelah menekan Add to Cart agar yakin bahwa pilihan saya sudah benar. |
| US-07 | Sebagai calon pembeli, saya ingin menghapus item dari keranjang agar bisa membatalkan pilihan saya. |

## 7. Acceptance Criteria

Acceptance criteria adalah kondisi yang harus terpenuhi agar fitur dianggap selesai.

| ID | Skenario | Hasil yang Diharapkan |
|---|---|---|
| AC-01 | Pengguna membuka halaman | Banner, header (termasuk ikon cart dengan angka), breadcrumb, galeri, nama, harga, pilihan warna, tombol Add to Cart, fitur unggulan, info layanan, deskripsi, tech specs, isi kemasan, support, dan footer tampil. Drawer belum tampil. |
| AC-02 | Halaman pertama kali dibuka | Black aktif, foto Hero Black tampil, harga $750.00, tombol Add to Cart aktif, ikon cart menampilkan 0, dan drawer tertutup. |
| AC-03 | Pengguna memilih Silver | Silver menjadi satu-satunya warna aktif, label warna menampilkan “Silver”, dan galeri berubah ke foto Silver dari foto pertama. |
| AC-04 | Pengguna memilih Black setelah Silver | Black menjadi satu-satunya warna aktif dan galeri kembali ke foto Black. |
| AC-05 | Pengguna menekan Next pada foto terakhir | Galeri kembali ke foto pertama. |
| AC-06 | Pengguna menekan Previous pada foto pertama | Galeri menampilkan foto terakhir. |
| AC-07 | Warna Black dipilih, lalu Add to Cart ditekan | Drawer terbuka, menampilkan MW75 TUMI, Black, $750.00, quantity 1, total "$750.00 USD", dan ikon cart menampilkan 1. |
| AC-08 | Add to Cart ditekan lagi setelah produk sudah di keranjang | Quantity tetap 1, ikon cart tetap 1, dan muncul pesan error merah di atas tombol. Drawer tidak terbuka lagi. |
| AC-09 | Pengguna mengubah warna setelah produk masuk keranjang | Label warna dan galeri berubah, tapi isi keranjang tidak berubah. |
| AC-10 | Quantity di drawer | Menampilkan 1 dan tidak bisa dinaikkan lebih dari 1. |
| AC-11 | Total di drawer | Selalu "$750.00 USD" untuk satu item. |
| AC-12 | Pengguna menekan Remove | Item hilang, drawer menampilkan "Your cart is empty" dan tombol Continue shopping, ikon cart menampilkan 0. |
| AC-13 | Pengguna menekan Remove, lalu Add to Cart lagi | Item bisa ditambahkan lagi dan pesan error tidak tampil. |
| AC-14 | Pengguna menekan Close | Drawer tertutup dan halaman di belakangnya bisa digunakan lagi. |
| AC-15 | Pengguna menekan ikon cart di header | Drawer terbuka dan menampilkan isi keranjang terbaru. |
| AC-16 | Pengguna menekan View Cart atau Checkout | Tidak terjadi perpindahan halaman (placeholder). |
| AC-17 | Pengguna membuka bagian Tech Specs | Tiga kelompok spesifikasi tampil lengkap sesuai data pada Lampiran B. |
| AC-18 | Pengguna membuka bagian In The Box | Tujuh item tampil lengkap dengan gambar dan nama sesuai Lampiran C. |
| AC-19 | Halaman dibuka pada lebar 375 px | Tidak ada scroll horizontal; teks, gambar, tabel spesifikasi, kontrol, dan drawer tetap bisa digunakan. |
| AC-20 | Halaman dibuka pada lebar desktop | Galeri dan informasi produk ditampilkan berdampingan. |
| AC-21 | Pengguna mengoperasikan halaman dengan keyboard | Semua kontrol, termasuk ikon cart, Close, dan Remove di drawer, bisa dijangkau dengan Tab, punya fokus yang terlihat, dan bisa diaktifkan dengan keyboard. Saat drawer terbuka, fokus pindah ke dalam drawer, dan Esc menutupnya. |
| AC-22 | Halaman dimuat ulang | Pilihan kembali ke kondisi awal, keranjang kosong, dan ikon cart kembali 0. |

## 8. Constraints + Success Criteria

### Constraints

1. Implementasi menggunakan HTML, CSS, dan JavaScript murni, tanpa framework.
2. Data produk dan konten halaman dimuat dari Product API; frontend tidak menyimpan salinan hardcode sebagai fallback.
3. Foto produk dirender dari URL yang diberikan API; aset yang tersedia lokal dapat menjadi sumber/seed dan tidak dimuat langsung dari situs sumber. Ikon UI dapat memakai aset lokal frontend.
4. Data dan konten produk dimuat dari Product API melalui konfigurasi `VITE_API_BASE_URL` dan `VITE_PRODUCT_ID`. Frontend tidak mengakses database secara langsung. Isi keranjang hanya disimpan di memori JavaScript (bukan localStorage atau sessionStorage), jadi hilang saat halaman dimuat ulang.
5. Hanya menampilkan satu produk dengan dua warna, keduanya berharga $750.00.
6. Halaman produk tidak menyediakan pilihan ukuran maupun quantity. Quantity hanya tampil di drawer keranjang dan dibatasi maksimal 1 per item, sesuai halaman sumber.
7. Detail produk API menyediakan foto Silver dengan struktur yang sama seperti Black (Hero, Front, Engraving, Straight).
8. Konten dan aset berasal dari situs Master & Dynamic dan hanya dipakai untuk latihan pembelajaran, bukan untuk dipublikasikan.
9. Teks pesan error mengikuti halaman sumber dalam bahasa Inggris: "The maximum quantity of this item is already in your cart."
10. Perilaku keranjang mengacu pada screenshot halaman sumber. Detail yang belum diverifikasi (misalnya kapan pesan error hilang) mengikuti asumsi pada Aturan Interaksi dan Acceptance Criteria.

### Success Criteria

Halaman dianggap berhasil apabila:

1. Seluruh acceptance criteria lulus saat pengujian manual.
2. Informasi produk dan warna terpilih mudah dikenali.
3. Galeri foto dan label warna selalu sesuai pilihan terbaru.
4. Isi keranjang, angka di ikon cart, dan total selalu sesuai aksi terakhir pengguna.
5. Quantity per item tidak pernah melebihi 1.
6. Data tech specs dan isi kemasan sesuai dengan sumber tanpa ada yang terlewat.
7. Halaman, termasuk drawer keranjang, dapat digunakan pada mobile dan desktop tanpa konten terpotong.
8. Tidak ada error JavaScript saat menjalankan alur utama, termasuk ketika API gagal atau respons produk tidak valid.

## Lampiran — Data Konten Halaman

### A. Fitur Unggulan

| No | Fitur |
|---|---|
| 1 | ANC (Active Noise Cancellation) |
| 2 | Aluminium anodized, kaca tempered, dan kulit lambskin |
| 3 | Driver beryllium 40mm |
| 4 | Baterai tahan hingga 32 jam |
| 5 | Bluetooth® 5.1 |
| 6 | 4 mikrofon beamforming |

### B. Tech Specs

| Kelompok | Atribut | Nilai |
|---|---|---|
| **Materials and Design** | Materials | Headband dan ear pads dari kulit lambskin; kontrol dari aluminium anodized |
|  | Dimensions | 160.75mm x 197.83mm x 83.57mm |
|  | Weight | 338g |
|  | Ear Coupling | Over-Ear |
|  | Ear Pads | Memory foam berbalut kulit lambskin, magnetik, dan dapat diganti |
| **Sound and Features** | Drivers | 40mm beryllium |
|  | Impedance | 32 Ohms |
|  | Talk Microphones | 4 mikrofon dengan wind protection |
|  | ANC Microphones | 4 mikrofon |
|  | Voice Assistant | Kompatibel dengan voice assistant bawaan perangkat |
| **Connectivity and Charging** | Battery Life | Hingga 32 jam, atau hingga 28 jam dengan ANC aktif |
|  | Bluetooth Profile | Bluetooth® 5.1, jangkauan 100ft/30m, dengan AAC, aptX™ Adaptive hingga 24 bit/48kHz, dan SBC. Hi-res memerlukan perangkat sumber dan layanan streaming yang kompatibel. |
|  | Wired Digital Headphone Connection | Mendukung hi-res audio hingga 24-bit/96kHz melalui kabel USB-C to USB-C bawaan pada perangkat yang didukung |
|  | Analog Headphone Connection | Kabel USB-C to 3.5mm untuk koneksi audio analog (opsional) |
|  | Cables | USB-C to 3.5mm audio cable dan USB-C to USB-C charging cable |
|  | Antenna | Antena internal |

### C. In The Box

| No | Item |
|---|---|
| 1 | Wireless Headphones |
| 2 | USB-C to USB-C Charging Cable |
| 3 | USB-C to 3.5mm Audio Cable |
| 4 | USB-C to USB-A Adapter |
| 5 | 3.5mm to 1/4" Adapter |
| 6 | Flight Adapter |
| 7 | Hard Shell Travel Case |
