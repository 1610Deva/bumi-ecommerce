# BUMI — Product Photos Batch 1 (10/20)

Gambar dibuat dengan AI sebagai **mockup ilustratif** produk BUMI, bukan foto SKU/supplier aktual.

## Isi paket
- `client/public/images/products/*.webp` — 10 gambar square, 800×800 px
- `server/scripts/link-product-images.js` — set `Product.imageUrl` berdasarkan slug produk
- `MAPPING.json` — daftar product name, slug, imageUrl

## Pemasangan
1. Ekstrak ZIP ke root proyek `bumi-ecommerce/`, sehingga seluruh gambar tersimpan di `client/public/images/products/`.
2. Salin script ke `server/scripts/link-product-images.js` (jika belum ada). Jangan overwrite kode yang telah dimodifikasi tanpa memeriksa perbedaannya.
3. Dari terminal `server` jalankan: `node scripts/link-product-images.js`.
4. Buka `http://localhost:5173/images/products/stainless-tumbler.webp` untuk cek file statis.
5. Refresh `/shop` dan homepage; cek `imageUrl` melalui Prisma Studio.
6. Jika thumbnail tidak terlihat, pastikan `ProductCard` menggunakan `product.imageUrl` dan tidak memakai absolute host API (`localhost:5000`) untuk asset.

**Catatan**: Nama file diasumsikan berdasarkan slug produk seed BUMI. Cocokkan slug sebenarnya di Prisma Studio terlebih dahulu. Script hanya memperbarui jika file dengan slug terkait tersedia dan tidak menimpa URL custom di luar `/images/products/`.

**Perhatian kualitas**: 10 gambar dihasilkan dari satu lembar katalog lalu dipisahkan. Tiap produk beresolusi visual sumber sekitar 300 px per sisi dan telah di-upscale untuk konsistensi 800×800. Bagus untuk prototipe/card kecil, namun untuk halaman detail produk besar atau produksi sebaiknya diganti dengan gambar resolusi asli yang lebih tinggi. Jangan klaim logo, material, atau tampilan ilustrasi ini sebagai spesifikasi produk riil.
