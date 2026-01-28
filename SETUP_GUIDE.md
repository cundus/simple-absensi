# Setup Guide - Sistem Absensi Karyawan

Panduan lengkap untuk setup aplikasi dari awal hingga siap digunakan.

## Prerequisites

- Node.js 18+ dan npm
- Akun Supabase (gratis)
- Akun Google Cloud Console (untuk OAuth)

---

## Langkah 1: Setup Supabase Project

### 1.1 Buat Project Baru

1. Buka [https://supabase.com](https://supabase.com)
2. Login atau daftar akun baru
3. Klik "New Project"
4. Isi:
   - **Name**: attendance-system (atau nama lain)
   - **Database Password**: Buat password yang kuat (simpan!)
   - **Region**: Pilih yang terdekat (Singapore/Southeast Asia)
5. Klik "Create new project"
6. Tunggu ~2 menit hingga project selesai dibuat

### 1.2 Dapatkan API Keys

1. Buka project yang baru dibuat
2. Klik icon Settings (⚙️) di sidebar kiri
3. Pilih "API"
4. Copy dua nilai ini:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public** key (key yang panjang)

### 1.3 Update Environment Variables

1. Buka file `.env.local` di folder `attendance-system`
2. Replace dengan nilai yang sudah dicopy:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Langkah 2: Setup Google OAuth

### 2.1 Buat OAuth Credentials

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih existing project
3. Enable **Google+ API**:
   - Klik "APIs & Services" > "Library"
   - Cari "Google+ API"
   - Klik "Enable"

### 2.2 Buat OAuth Consent Screen

1. Klik "APIs & Services" > "OAuth consent screen"
2. Pilih **External** > Klik "Create"
3. Isi form:
   - **App name**: Sistem Absensi Karyawan
   - **User support email**: Email Anda
   - **Developer contact**: Email Anda
4. Klik "Save and Continue"
5. Skip "Scopes" (klik "Save and Continue")
6. Skip "Test users" (klik "Save and Continue")
7. Klik "Back to Dashboard"

### 2.3 Buat OAuth Client ID

1. Klik "APIs & Services" > "Credentials"
2. Klik "Create Credentials" > "OAuth client ID"
3. Pilih **Web application**
4. Isi:
   - **Name**: Attendance System Web Client
   - **Authorized JavaScript origins**: (kosongkan)
   - **Authorized redirect URIs**: Tambahkan URL ini:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     (Ganti `xxxxx` dengan project ref Anda dari Supabase URL)
5. Klik "Create"
6. Copy **Client ID** dan **Client Secret**

### 2.4 Setup di Supabase

1. Buka Supabase Dashboard
2. Klik "Authentication" di sidebar
3. Klik "Providers"
4. Cari "Google" dan klik toggle untuk enable
5. Paste:
   - **Client ID**: dari Google Cloud Console
   - **Client Secret**: dari Google Cloud Console
6. Klik "Save"

---

## Langkah 3: Setup Database Schema

### 3.1 Jalankan SQL Schema

1. Buka Supabase Dashboard
2. Klik "SQL Editor" di sidebar
3. Klik "New query"
4. Copy seluruh isi file `supabase/schema.sql`
5. Paste ke SQL Editor
6. Klik "Run" atau tekan Ctrl+Enter

### 3.2 Verifikasi Tables

1. Klik "Table Editor" di sidebar
2. Pastikan 3 tables sudah terbuat:
   - ✅ `users`
   - ✅ `attendances`
   - ✅ `salaries`

### 3.3 Verifikasi RLS Policies

1. Klik salah satu table (contoh: `users`)
2. Klik tab "Policies"
3. Pastikan ada beberapa policies (contoh: "Admin can view all users", dll)

---

## Langkah 4: Install Dependencies & Run

### 4.1 Install Dependencies

```bash
cd attendance-system
npm install
```

### 4.2 Run Development Server

```bash
npm run dev
```

### 4.3 Buka Browser

Buka [http://localhost:3000](http://localhost:3000)

Anda akan otomatis redirect ke halaman login.

---

## Langkah 5: Login Pertama Kali

### 5.1 Login dengan Google

1. Klik tombol "Login dengan Google"
2. Pilih akun Google Anda
3. Berikan permission yang diminta
4. Anda akan redirect ke dashboard

### 5.2 Buat Admin User

Setelah login pertama kali, user Anda akan memiliki role `employee` secara default.

Untuk mengubah menjadi `admin`:

1. Buka Supabase Dashboard
2. Klik "Table Editor" > "users"
3. Cari row dengan email Anda
4. Klik edit (icon pensil)
5. Ubah field `role` dari `employee` menjadi `admin`
6. Klik "Save"
7. Refresh halaman dashboard Anda

Sekarang Anda sudah menjadi admin! 🎉

---

## Langkah 6: Test Aplikasi

### 6.1 Test sebagai Admin

- Coba akses menu Users (akan dibuat di Fase 4)
- Coba akses menu Attendance Management
- Coba akses menu Salary

### 6.2 Test sebagai Employee

1. Logout dari akun admin
2. Login dengan akun Google lain
3. User baru akan otomatis terdaftar sebagai `employee`
4. Test fitur absen masuk/keluar (akan dibuat di Fase 3)

---

## Troubleshooting

### Error: "Invalid login credentials"

- Pastikan Google OAuth sudah di-enable di Supabase
- Pastikan Client ID dan Secret sudah benar
- Pastikan Redirect URI sudah benar

### Error: "Failed to fetch"

- Pastikan `.env.local` sudah diisi dengan benar
- Pastikan Supabase URL dan Anon Key sudah benar
- Restart development server (`npm run dev`)

### Error: "relation public.users does not exist"

- Pastikan schema SQL sudah dijalankan
- Cek di Table Editor apakah tables sudah terbuat

### User tidak bisa login setelah setup

- Pastikan trigger `on_auth_user_created` sudah terbuat
- Cek di SQL Editor:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```

### Dashboard kosong / tidak ada data

- Normal untuk pertama kali
- Data akan muncul setelah:
  - Admin menambah user (Fase 4)
  - Employee melakukan absen (Fase 3)

---

## Next Steps

Setelah setup selesai, lanjut ke:

- **Fase 2**: Verifikasi RLS policies dan seed data
- **Fase 3**: Implementasi fitur karyawan (absen masuk/keluar)
- **Fase 4**: Implementasi fitur admin (user management)
- **Fase 5**: Implementasi fitur admin (attendance & salary)

---

## Deployment (Optional)

### Deploy ke Vercel

1. Push code ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repository
4. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Update Google OAuth Redirect URI

Setelah deploy, tambahkan production URL ke Google Cloud Console:

```
https://your-app.vercel.app/auth/callback
```

Dan update di Supabase Authorized Redirect URLs juga.

---

## Support

Jika ada masalah, cek:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
