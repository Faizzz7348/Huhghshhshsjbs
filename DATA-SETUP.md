# Setup Data untuk Setiap Submenu

## Perubahan yang Dibuat

Sistem telah dikonfigurasi supaya setiap submenu mempunyai data yang berbeza:

### Submenu 1: KL-7 (Data A)
- **Route**: KL 7 - 3PVK04
- **Lokasi**: 5 hospital di kawasan Kuala Lumpur
- **Data**: 
  - KPJ Damansara Specialist Hospital (Code: 101)
  - Gleneagles Hospital Kuala Lumpur (Code: 102)
  - Pantai Hospital Kuala Lumpur (Code: 103)
  - Prince Court Medical Centre (Code: 104)
  - Sunway Medical Centre (Code: 105)

### Submenu 2: SL-1 (Data B)
- **Route**: SL 1 - 3AVS01
- **Lokasi**: 5 hospital di kawasan Selayang/Setapak
- **Data**:
  - Selayang Hospital (Code: 201)
  - Columbia Asia Hospital - Setapak (Code: 202)
  - Kepong Specialist Hospital (Code: 203)
  - Kuala Lumpur Hospital (Code: 204)
  - Sentosa Medical Centre (Code: 205)

## Cara Menjalankan Setup

### 1. Pastikan Database Tersedia
Pastikan anda mempunyai DATABASE_URL yang dikonfigurasi dalam fail `.env`:

```bash
DATABASE_URL="your-postgresql-connection-string"
POSTGRES_URL="your-postgresql-connection-string"
```

### 2. Jalankan Migration
```bash
npx prisma db push
```

### 3. Jalankan Seed Script
```bash
npx tsx prisma/seed.ts
```

atau jika tsx tidak tersedia:

```bash
npm install -D tsx
npx tsx prisma/seed.ts
```

### 4. Verify Data
Buka Prisma Studio untuk melihat data:
```bash
npx prisma studio
```

## Struktur Database

### Table: Route
- `id`: ID unik untuk route
- `name`: Nama route (contoh: "KL 7 - 3PVK04")
- `slug`: URL slug (contoh: "kl-7")
- `description`: Deskripsi route

### Table: DeliveryLocation
- `id`: ID unik untuk lokasi
- `code`: Kod lokasi (unique)
- `location`: Nama lokasi
- `delivery`: Jenis penghantaran (Daily/Weekly/Monthly)
- `lat`, `lng`: Koordinat GPS
- `color`: Warna marker di peta
- `powerMode`: Mode kuasa (daily/weekday/alt1/alt2/weekend)
- `routeId`: Foreign key ke table Route

## API Endpoints

Setiap submenu menggunakan API endpoint yang berbeza:

- **KL-7**: `GET /api/routes/kl-7/locations`
- **SL-1**: `GET /api/routes/sl-1/locations`

API akan mengembalikan hanya lokasi yang berkaitan dengan route tersebut berdasarkan `routeId`.

## Testing

Selepas menjalankan seed:

1. Buka aplikasi di browser: `http://localhost:3000`
2. Klik "Route VM" di sidebar
3. Klik "KL 7 - 3PVK04" - sepatutnya menunjukkan 5 lokasi hospital KL
4. Klik "SL 1 - 3AVS01" - sepatutnya menunjukkan 5 lokasi hospital Selayang/Setapak
5. Setiap submenu akan menunjukkan data yang berbeza dengan kod yang berbeza

## Menambah Route Baru

Untuk menambah route baru:

1. Edit `prisma/seed.ts`
2. Tambah route baru:
```typescript
const newRoute = await prisma.route.upsert({
  where: { slug: 'new-route' },
  update: {},
  create: {
    name: 'New Route Name',
    slug: 'new-route',
    description: 'Description'
  }
})
```

3. Tambah lokasi untuk route baru
4. Buat halaman baru di `app/new-route/page.tsx`
5. Tambah ke sidebar di `components/app-sidebar.tsx`
