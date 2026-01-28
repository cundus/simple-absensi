# 🚀 Deployment Guide - Sistem Absensi Karyawan

Panduan lengkap untuk deploy aplikasi ke production menggunakan Vercel dan Supabase.

---

## Prerequisites

Sebelum deploy, pastikan Anda sudah memiliki:
- [x] Akun Vercel (https://vercel.com)
- [x] Akun Supabase (https://supabase.com)
- [x] Google Cloud Console project untuk OAuth
- [x] Repository GitHub (optional, tapi recommended)

---

## Step 1: Persiapan Database (Supabase)

### 1.1 Setup Supabase Project

1. Login ke Supabase Dashboard
2. Create new project atau gunakan existing project
3. Tunggu hingga project selesai dibuat (~2 menit)

### 1.2 Run Database Schema

1. Buka **SQL Editor** di Supabase Dashboard
2. Copy isi file `supabase/schema-fixed.sql`
3. Paste ke SQL Editor
4. Click **Run** untuk execute
5. Verifikasi tables sudah terbuat:
   - `users`
   - `attendances`
   - `salaries`

### 1.3 Setup Google OAuth di Supabase

1. Buka **Authentication > Providers**
2. Enable **Google** provider
3. Buka Google Cloud Console (https://console.cloud.google.com)
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
5. Copy **Client ID** dan **Client Secret**
6. Paste ke Supabase Google provider settings
7. Save

### 1.4 Get Supabase Credentials

1. Buka **Settings > API**
2. Copy:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Simpan untuk Step 2

---

## Step 2: Deploy ke Vercel

### 2.1 Push Code ke GitHub (Recommended)

```bash
cd attendance-system
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

### 2.2 Import Project ke Vercel

1. Login ke Vercel Dashboard
2. Click **Add New > Project**
3. Import dari GitHub repository
4. Select repository: `attendance-system`
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (atau `attendance-system` jika di subfolder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.3 Setup Environment Variables

Di Vercel project settings, tambahkan environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Jangan tambahkan quotes atau spaces!

### 2.4 Deploy

1. Click **Deploy**
2. Tunggu build selesai (~2-3 menit)
3. Vercel akan memberikan URL production:
   ```
   https://your-project-name.vercel.app
   ```

---

## Step 3: Update Google OAuth Redirect URIs

### 3.1 Add Vercel URL to Google OAuth

1. Buka Google Cloud Console
2. Go to **APIs & Services > Credentials**
3. Edit OAuth 2.0 Client
4. Add Authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
5. Add Authorized JavaScript origins:
   ```
   https://your-project-name.vercel.app
   ```
6. Save

### 3.2 Test OAuth Flow

1. Buka `https://your-project-name.vercel.app`
2. Click **Login dengan Google**
3. Pilih akun Google
4. Harus redirect ke dashboard

---

## Step 4: Create Admin User

### 4.1 Login Pertama Kali

1. Login dengan akun Google Anda
2. User akan otomatis terbuat dengan role `employee`

### 4.2 Upgrade ke Admin

1. Buka Supabase Dashboard
2. Go to **Table Editor > users**
3. Find user dengan email Anda
4. Edit row:
   - Change `role` dari `employee` ke `admin`
5. Save

### 4.3 Refresh JWT Token

1. Logout dari aplikasi
2. Login lagi
3. Sekarang Anda adalah admin!

---

## Step 5: Testing Production

### 5.1 Test Employee Features

1. Login sebagai employee
2. Test:
   - [ ] Check-in attendance
   - [ ] Check-out attendance
   - [ ] View attendance history
   - [ ] Edit profile

### 5.2 Test Admin Features

1. Login sebagai admin
2. Test:
   - [ ] View all users
   - [ ] Edit user
   - [ ] Delete user
   - [ ] View all attendances
   - [ ] Filter attendances
   - [ ] Export attendance CSV
   - [ ] Calculate salary
   - [ ] Save salary
   - [ ] View salary report
   - [ ] Export salary CSV

### 5.3 Test Error Scenarios

- [ ] Try check-in twice (should error)
- [ ] Try check-out without check-in (should error)
- [ ] Try access admin page as employee (should redirect)
- [ ] Test with slow network
- [ ] Test on mobile device

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain to Vercel

1. Go to Vercel project settings
2. Click **Domains**
3. Add your domain: `attendance.yourdomain.com`
4. Follow DNS configuration instructions

### 6.2 Update Google OAuth

1. Add custom domain to Authorized JavaScript origins:
   ```
   https://attendance.yourdomain.com
   ```
2. Save

---

## Troubleshooting

### Issue: "Invalid redirect URI"

**Solution:**
- Check Google OAuth redirect URIs
- Make sure Supabase URL is correct
- Clear browser cache and try again

### Issue: "Unauthorized" after login

**Solution:**
- Check environment variables in Vercel
- Make sure NEXT_PUBLIC_SUPABASE_URL is correct
- Make sure NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Redeploy after changing env vars

### Issue: "Infinite recursion in RLS policy"

**Solution:**
- Use `schema-fixed.sql` instead of `schema.sql`
- Drop existing policies and recreate
- See `FIX_RLS_RECURSION.md` for details

### Issue: Admin can't see admin menus

**Solution:**
- Logout and login again to refresh JWT
- Check user role in Supabase database
- Make sure role is exactly `admin` (lowercase)

### Issue: Build fails on Vercel

**Solution:**
- Check build logs for errors
- Make sure all dependencies are in package.json
- Try building locally: `npm run build`
- Fix TypeScript errors if any

---

## Monitoring & Maintenance

### Vercel Analytics (Optional)

1. Enable Vercel Analytics in project settings
2. Monitor:
   - Page views
   - Performance metrics
   - Error rates

### Supabase Monitoring

1. Check **Database > Usage**
2. Monitor:
   - Database size
   - API requests
   - Active connections

### Regular Maintenance

- [ ] Backup database weekly
- [ ] Check error logs
- [ ] Update dependencies monthly
- [ ] Review user feedback
- [ ] Add new features based on needs

---

## Security Checklist

### Before Going Live

- [x] RLS policies enabled
- [x] Environment variables secured
- [x] OAuth credentials secured
- [x] HTTPS enabled (automatic with Vercel)
- [ ] Rate limiting (future enhancement)
- [ ] Input validation (already implemented)
- [ ] SQL injection prevention (Supabase handles this)

### Regular Security Audits

- [ ] Review user permissions
- [ ] Check for suspicious activity
- [ ] Update dependencies for security patches
- [ ] Review RLS policies
- [ ] Test authentication flow

---

## Performance Optimization

### Already Implemented

- [x] Server Components for data fetching
- [x] Client Components only when needed
- [x] Optimized images (Next.js Image)
- [x] CSS animations (hardware accelerated)
- [x] Efficient database queries

### Future Enhancements

- [ ] Add Redis caching
- [ ] Implement CDN for static assets
- [ ] Add service worker for offline support
- [ ] Optimize bundle size
- [ ] Add lazy loading for heavy components

---

## Backup & Recovery

### Database Backup

1. Buka Supabase Dashboard
2. Go to **Database > Backups**
3. Enable automatic backups (Pro plan)
4. Or manually export:
   ```sql
   pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
   ```

### Restore from Backup

1. Buka SQL Editor
2. Run backup SQL file
3. Verify data restored

---

## Scaling Considerations

### Current Limits (Supabase Free Tier)

- 500 MB database
- 2 GB bandwidth/month
- 50,000 monthly active users

### When to Upgrade

- Database > 400 MB
- Bandwidth > 1.5 GB/month
- Users > 40,000/month
- Need automatic backups
- Need better performance

### Upgrade Options

- **Supabase Pro**: $25/month
  - 8 GB database
  - 50 GB bandwidth
  - Automatic backups
  - Better performance

- **Vercel Pro**: $20/month
  - Better analytics
  - More build minutes
  - Team collaboration

---

## Support & Resources

### Documentation

- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Community

- Next.js Discord: https://discord.gg/nextjs
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag `nextjs`, `supabase`

### Project Documentation

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Local setup
- `PHASES.md` - Development phases
- `FASE_X_SUMMARY.md` - Phase summaries
- `FIX_RLS_RECURSION.md` - RLS troubleshooting

---

## Congratulations! 🎉

Aplikasi Anda sekarang sudah live di production!

**Production URL:** https://your-project-name.vercel.app

Share dengan tim Anda dan mulai gunakan! 🚀

---

## Next Steps

1. [ ] Share URL dengan team
2. [ ] Create admin users
3. [ ] Import existing employee data (if any)
4. [ ] Train users on how to use the system
5. [ ] Gather feedback
6. [ ] Plan for future enhancements

---

## Need Help?

Jika ada masalah atau pertanyaan:
1. Check troubleshooting section di atas
2. Review project documentation
3. Check Vercel/Supabase logs
4. Search community forums
5. Create GitHub issue (if using GitHub)

Good luck! 🍀
