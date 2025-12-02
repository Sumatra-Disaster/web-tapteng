# Info Bencana Tapteng 2025

Sistem manajemen data bencana banjir bandang dan longsor untuk monitoring korban dan kerusakan infrastruktur di Kabupaten Tapanuli Tengah.

## 📋 Deskripsi

Aplikasi web untuk menampilkan dan mengelola data bencana alam (banjir bandang dan longsor) yang terjadi di Tapanuli Tengah. Sistem ini mengambil data dari Google Sheets dan menampilkannya dalam format dashboard yang mudah dibaca, termasuk informasi tentang korban jiwa, korban luka, pengungsi, dan kerusakan infrastruktur.

## ✨ Fitur

- 📊 **Dashboard Data Bencana**: Tampilan data bencana per kecamatan dengan statistik lengkap
- 🔍 **Pencarian Data**: Fitur pencarian untuk mencari data berdasarkan kecamatan atau kriteria lainnya
- 💀 **Daftar Korban Meninggal**: Halaman khusus untuk menampilkan daftar korban jiwa
- 📱 **Responsive Design**: Tampilan yang optimal di berbagai perangkat
- 🌓 **Dark Mode Support**: Dukungan tema gelap dan terang
- 🔄 **Auto-refresh**: Data diperbarui secara otomatis dari Google Sheets (dapat dikonfigurasi)
- 📈 **Statistik Real-time**: Perhitungan total korban dan kerusakan secara real-time

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Data Source**: Google Sheets API
- **Package Manager**: pnpm
- **Analytics**: Vercel Analytics

## 📦 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- [Node.js](https://nodejs.org/) (v18 atau lebih tinggi)
- [pnpm](https://pnpm.io/) (v9.0.0 atau lebih tinggi)
- Akun Google Cloud dengan Google Sheets API dan Drive API diaktifkan

## 🚀 Installation

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd disaster-tables
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment variables**

   Buat file `.env.local` di root project dengan konfigurasi berikut:

   ```env
   # Google Sheets API
   GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

4. **Setup Google Sheets API**
   - Buat project di [Google Cloud Console](https://console.cloud.google.com/)
   - Aktifkan Google Sheets API dan Drive API
   - Buat Service Account dan download JSON key
   - Extract `client_email` dan `private_key` dari JSON
   - Share Google Sheet dengan email service account (memberikan akses viewer)

5. **Run development server**

   ```bash
   pnpm dev
   ```

6. **Buka browser**

   Navigate ke [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
disaster-tables/
├── app/                    # Next.js app directory
│   ├── daftar-korban/     # Halaman daftar korban meninggal
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (dashboard)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── disaster-dashboard.tsx
│   ├── deceased_victims.tsx
│   └── ...
├── interfaces/            # TypeScript interfaces
│   └── DisasterData.ts
├── lib/                   # Utility libraries
│   ├── config.ts          # Application configuration
│   └── sheet/             # Google Sheets integration
├── public/                # Static assets
├── scripts/               # SQL scripts
│   └── 001_create_disaster_data_table.sql
├── utils/                 # Utility functions
│   └── dataMapper.ts
└── styles/                # Additional styles
```

## 🧑‍💻 Development

### Available Scripts

- `pnpm dev` - Menjalankan development server
- `pnpm build` - Build production
- `pnpm start` - Menjalankan production server
- `pnpm lint` - Menjalankan ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code dengan Prettier
- `pnpm format:check` - Check code formatting

### Code Quality

Project ini menggunakan:

- **ESLint** untuk linting
- **Prettier** untuk code formatting
- **Husky** untuk git hooks
- **lint-staged** untuk pre-commit checks
- **Commitlint** untuk conventional commits

### Google Sheets Configuration

1. **Spreadsheet ID**: Hardcoded di `app/page.tsx` dan `app/daftar-korban/page.tsx`
2. **Sheet Ranges**:
   - Dashboard: `KECAMATAN!A6:N`
   - Korban Meninggal: `DATA-MENINGGAL!A5:N`

Untuk mengubah spreadsheet, edit file-file tersebut.

## 🔧 Environment Variables

### Required Variables

| Variable                     | Description                             | Required |
| ---------------------------- | --------------------------------------- | -------- |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Service account email dari Google Cloud | ✅       |
| `GOOGLE_SHEETS_PRIVATE_KEY`  | Private key dari service account        | ✅       |

### Optional Variables

| Variable                               | Description                                                                       | Default              |
| -------------------------------------- | --------------------------------------------------------------------------------- | -------------------- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`        | Google Analytics Measurement ID (GA4)                                             | -                    |
| `NEXT_PUBLIC_DATA_REFRESH_INTERVAL_MS` | Data refresh interval in milliseconds (min: 60000, max: 1800000)                  | `300000` (5 minutes) |
| `NEXT_PUBLIC_DATA_STALE_THRESHOLD_MS`  | Stale data threshold in milliseconds (data older than this refreshes immediately) | `300000` (5 minutes) |
| `NEXT_PUBLIC_REFRESH_ON_VISIBILITY`    | Enable refresh when user returns to tab (`true` or `false`)                       | `true`               |

### Data Refresh Configuration

Aplikasi ini memiliki sistem auto-refresh yang dapat dikonfigurasi melalui environment variables:

- **`NEXT_PUBLIC_DATA_REFRESH_INTERVAL_MS`**: Interval refresh otomatis (dalam milidetik)
  - Default: `300000` (5 menit)
  - Minimum: `60000` (1 menit)
  - Maximum: `1800000` (30 menit)
  - Contoh: Set `60000` untuk refresh setiap 1 menit

- **`NEXT_PUBLIC_DATA_STALE_THRESHOLD_MS`**: Threshold untuk data yang dianggap "stale"
  - Default: `300000` (5 menit)
  - Data yang lebih lama dari threshold ini akan di-refresh segera saat halaman dimuat atau tab menjadi visible

- **`NEXT_PUBLIC_REFRESH_ON_VISIBILITY`**: Aktifkan refresh saat user kembali ke tab
  - Default: `true`
  - Set ke `false` untuk menonaktifkan fitur ini

**Contoh konfigurasi untuk refresh lebih cepat (1 menit):**

```env
NEXT_PUBLIC_DATA_REFRESH_INTERVAL_MS=60000
NEXT_PUBLIC_DATA_STALE_THRESHOLD_MS=60000
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code ke GitHub/GitLab
2. Import project ke [Vercel](https://vercel.com)
3. Tambahkan environment variables di Vercel dashboard
4. Deploy

### Manual Build

```bash
pnpm build
pnpm start
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Commit Convention

Project ini menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

**Note**: Pastikan untuk menjaga keamanan credentials Google Sheets dan tidak commit file `.env.local` ke repository.
