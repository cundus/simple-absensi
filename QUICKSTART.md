# Quick Start Guide

Panduan cepat untuk menjalankan aplikasi dalam 5 menit.

## Prerequisites

✅ Node.js 18+ installed  
✅ npm installed  
✅ Akun Supabase (gratis)  
✅ Akun Google (untuk OAuth)

---

## Step 1: Clone & Install (1 menit)

```bash
cd attendance-system
npm install
```

---

## Step 2: Setup Supabase (2 menit)

### 2.1 Buat Project
1. Buka [supabase.com](https://supabase.com)
2. Klik "New Project"
3. Isi nama & password
4. Tunggu ~2 menit

### 2.2 Copy API Keys
1. Settings > API
2. Copy **Project URL** dan **anon public key**

### 2.3 Update .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

---

## Step 3: Setup Database (1 menit)

1. Buka Supabase Dashboard
2. Klik "SQL Editor"
3. Copy isi file `supabase/schema.sql`
4. Paste & Run

---

## Step 4: Setup Google OAuth (2 menit)

### 4.1 Google Cloud Console
1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Buat project baru
3. Enable Google+ API
4. Buat OAuth Client ID (Web application)
5. Authorized redirect URIs:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
6. Copy Client ID & Secret

### 4.2 Supabase
1. Authentication > Providers > Google
2. Enable & paste Client ID + Secret
3. Save

---

## Step 5: Run! (30 detik)

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Step 6: Login & Setup Admin

1. Klik "Login dengan Google"
2. Pilih akun Google
3. Setelah login, buka Supabase Dashboard
4. Table Editor > users
5. Edit row dengan email Anda
6. Ubah `role` dari `employee` ke `admin`
7. Refresh browser

Done! 🎉

---

## Troubleshooting

**Error: Invalid login credentials**
- Pastikan Google OAuth sudah di-enable di Supabase
- Pastikan Client ID & Secret sudah benar

**Error: Failed to fetch**
- Pastikan .env.local sudah diisi
- Restart dev server

**Error: relation public.users does not exist**
- Pastikan schema SQL sudah dijalankan

---

## Next Steps

Aplikasi sudah jalan! Sekarang Anda bisa:

1. **Baca PHASES.md** untuk detail fase-fase pengerjaan
2. **Lanjut ke Fase 2** untuk verifikasi RLS & seed data
3. **Lanjut ke Fase 3** untuk implementasi fitur karyawan
4. **Baca SETUP_GUIDE.md** untuk panduan lengkap

---

## File Structure

```
attendance-system/
├── app/                    # Next.js pages
│   ├── login/             # Login page
│   ├── auth/callback/     # OAuth callback
│   └── dashboard/         # Protected pages
├── components/            # React components
├── lib/                   # Utilities
│   └── supabase/         # Supabase clients
├── supabase/             # Database schema
├── .env.local            # Environment variables
├── README.md             # Project overview
├── SETUP_GUIDE.md        # Detailed setup guide
├── PHASES.md             # Development phases
└── QUICKSTART.md         # This file
```

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

---

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
