# Sistem Absensi Karyawan (Lite)

Aplikasi fullstack untuk manajemen absensi karyawan berbasis web menggunakan Next.js dan Supabase.

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, RLS)
- **Deployment**: Vercel (Frontend), Supabase Cloud (Backend)

## Fase Pengerjaan

### ✅ Fase 1: Setup Project & Authentication (SELESAI)
- [x] Setup Next.js project dengan TypeScript & Tailwind
- [x] Konfigurasi Supabase client
- [x] Implementasi Google OAuth
- [x] Setup proxy untuk role-based access
- [x] Halaman login
- [x] Dashboard layout & navigation

### ✅ Fase 2: Database Schema & RLS (SELESAI)
- [x] Jalankan schema SQL di Supabase
- [x] Setup Row Level Security policies
- [x] Test RLS policies
- [x] Database helper functions
- [x] Utility functions (date, format, export, validation)

### ✅ Fase 3: Fitur Karyawan (SELESAI)
- [x] Dashboard karyawan
- [x] Absen masuk/keluar
- [x] View attendance history
- [x] Edit profile

### ✅ Fase 4: Fitur Admin - User Management (SELESAI)
- [x] Dashboard admin
- [x] List all users
- [x] Edit user (name, role, status)
- [x] Delete user
- [x] Search & filter users

### ✅ Fase 5: Fitur Admin - Attendance & Salary (SELESAI)
- [x] View all attendances
- [x] Filter attendance (by user, date range)
- [x] Export to CSV
- [x] Salary calculation (per day/hour)
- [x] Salary report
- [x] Export salary to CSV

**Status: SEMUA FITUR SELESAI! 🎉**

## Setup Instructions

### 1. Install Dependencies

```bash
cd attendance-system
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Copy URL dan Anon Key dari Settings > API
3. Update file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Setup Google OAuth

1. Buka Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Buat OAuth credentials di [Google Cloud Console](https://console.cloud.google.com)
4. Tambahkan Authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
5. Copy Client ID dan Client Secret ke Supabase

### 4. Setup Database

1. Buka Supabase Dashboard > SQL Editor
2. Copy isi file `supabase/schema.sql`
3. Jalankan SQL query
4. **IMPORTANT:** Jika ada error "infinite recursion", jalankan `supabase/schema-fixed.sql` sebagai gantinya
5. Verifikasi tables dan policies sudah terbuat

### 5. Create Admin User

Setelah login pertama kali dengan Google, update role menjadi admin:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-email@gmail.com';
```

**Note:** Setelah update role, logout dan login lagi agar JWT ter-update.

### 6. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Project Structure

```
attendance-system/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── users/[id]/      # User CRUD
│   │   │   └── salary/          # Salary calculate & save
│   │   ├── attendance/          # Check-in/out
│   │   └── profile/             # Profile update
│   ├── auth/
│   │   └── callback/            # OAuth callback
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── attendance/      # Admin attendance view
│   │   │   └── salary/          # Admin salary management
│   │   ├── attendance/          # Employee attendance
│   │   ├── profile/             # Employee profile
│   │   ├── users/               # Admin user management
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/                   # Login page
│   └── page.tsx                 # Home page
├── components/
│   ├── AdminAttendanceTable.tsx # Admin attendance table
│   ├── AttendanceCard.tsx       # Check-in/out card
│   ├── AttendanceHistory.tsx    # Attendance history
│   ├── DashboardNav.tsx         # Navigation
│   ├── DeleteConfirmation.tsx   # Delete modal
│   ├── ProfileForm.tsx          # Profile edit form
│   ├── SalaryCalculator.tsx     # Salary calculator
│   ├── SalaryReport.tsx         # Salary report table
│   ├── UserModal.tsx            # User edit modal
│   └── UserTable.tsx            # User list table
├── lib/
│   ├── database/
│   │   ├── attendances.ts       # Attendance CRUD
│   │   ├── salaries.ts          # Salary CRUD
│   │   ├── users.ts             # User CRUD
│   │   └── index.ts
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   └── middleware.ts        # Auth middleware
│   ├── types/
│   │   └── database.ts          # TypeScript types
│   └── utils/
│       ├── date.ts              # Date utilities
│       ├── export.ts            # CSV export
│       ├── format.ts            # Format utilities
│       ├── validation.ts        # Validation
│       └── index.ts
├── supabase/
│   ├── schema.sql               # Original schema
│   └── schema-fixed.sql         # Fixed RLS schema
└── proxy.ts                     # Next.js proxy
```

## Features

### ✅ Authentication
- Google OAuth login
- Protected routes
- Role-based access control (Admin & Employee)

### ✅ Employee Features
- Check-in/Check-out attendance
- View attendance history (last 30 days)
- Edit profile (name)
- Dashboard with statistics

### ✅ Admin Features
- **User Management**
  - View all users
  - Edit user (name, role, status)
  - Delete user
  - Search & filter users
  
- **Attendance Management**
  - View all employee attendances
  - Search by employee name/email
  - Filter by date range
  - Export to CSV
  - Statistics (total attendances, hours, average)
  
- **Salary Management**
  - Calculate salary (per day or per hour)
  - Auto-calculate from attendance data
  - Save salary records
  - View salary report
  - Filter by period
  - Export to CSV

### 📊 Export Features
- Export attendance to CSV
- Export salary report to CSV
- Filtered export (include search/filter results)

## Development Notes

- Menggunakan App Router Next.js 15
- Server Components untuk data fetching
- Client Components untuk interactivity
- RLS policies untuk data security
- TypeScript untuk type safety
- Tailwind CSS untuk styling
- Loading states & error handling
- Toast notifications
- Responsive design

## Deployment

Aplikasi siap untuk production! Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) untuk panduan lengkap deploy ke Vercel.

**Quick Deploy:**
1. Push code ke GitHub
2. Import ke Vercel
3. Setup environment variables
4. Deploy!

## Documentation

- [README.md](README.md) - Project overview (this file)
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Local development setup
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment
- [PHASES.md](PHASES.md) - Development phases
- [FASE_1_SUMMARY.md](FASE_1_SUMMARY.md) - Phase 1 summary
- [FASE_2_SUMMARY.md](FASE_2_SUMMARY.md) - Phase 2 summary
- [FASE_3_SUMMARY.md](FASE_3_SUMMARY.md) - Phase 3 summary
- [FASE_4_SUMMARY.md](FASE_4_SUMMARY.md) - Phase 4 summary
- [FASE_5_SUMMARY.md](FASE_5_SUMMARY.md) - Phase 5 summary
- [FASE_6_SUMMARY.md](FASE_6_SUMMARY.md) - Phase 6 summary
- [FIX_RLS_RECURSION.md](FIX_RLS_RECURSION.md) - RLS troubleshooting

## Contributing

This is a complete project based on PRD. All phases are finished!

If you want to add features:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📦 Repository

- **GitHub**: [Link to your repository]
- **Issues**: Report bugs or request features
- **Pull Requests**: Contributions are welcome!

## 🚀 Quick Push to GitHub

### First Time Setup

1. Create repository di GitHub
2. Run script:
   ```bash
   # Windows
   initial-push.bat
   
   # Mac/Linux
   chmod +x initial-push.sh
   ./initial-push.sh
   ```

### Push Updates

```bash
# Windows
push-to-github.bat

# Mac/Linux
./push-to-github.sh
```

Or manually:
```bash
git add .
git commit -m "Your message"
git push
```

See [GITHUB_SETUP.md](GITHUB_SETUP.md) for detailed instructions.

## License

MIT
