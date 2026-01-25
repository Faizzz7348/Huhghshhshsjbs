# 🎯 Cara Memasukkan Data Berbeza untuk Setiap Submenu

## ✅ Perubahan Yang Telah Dibuat

Saya telah menyediakan sistem supaya setiap submenu mempunyai data yang berbeza:

### 📍 Submenu 1: KL-7 (Data A)
- 5 hospital di kawasan Kuala Lumpur
- Code bermula dengan 101, 102, 103, dst.

### 📍 Submenu 2: SL-1 (Data B)  
- 5 hospital di kawasan Selayang/Setapak
- Code bermula dengan 201, 202, 203, dst.

## 🚀 Langkah-Langkah untuk Jalankan

### 1️⃣ Pastikan Database Bersambung
Check fail `.env` anda ada DATABASE_URL

### 2️⃣ Push Schema ke Database
Buka terminal dan jalankan:
```bash
npm run db:push
```

### 3️⃣ Masukkan Data Sample
```bash
npm run db:seed
```

### 4️⃣ Semak Data (Optional)
```bash
npm run db:studio
```
Akan buka Prisma Studio di browser untuk lihat data

### 5️⃣ Jalankan Aplikasi
```bash
npm run dev
```

## 🧪 Cara Test

1. Buka http://localhost:3000
2. Klik sidebar "Route VM"
3. Klik "KL 7 - 3PVK04" → akan keluar 5 lokasi hospital KL (code 101-105)
4. Klik "SL 1 - 3AVS01" → akan keluar 5 lokasi hospital Selayang (code 201-205)

## ✨ Setiap submenu sekarang ada data sendiri yang berbeza!

Data disimpan dalam database PostgreSQL dan diambil melalui API yang berbeza untuk setiap route.
