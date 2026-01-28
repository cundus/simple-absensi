# 🚀 Quick Setup - Avatar Upload Feature

Panduan cepat untuk mengaktifkan fitur upload foto profil.

---

## Step 1: Run SQL Migration (2 menit)

1. Buka **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy & paste SQL berikut:

```sql
-- Add avatar_url column
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Storage policies (simplified)
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

4. Click **Run**
5. Verify: No errors

---

## Step 2: Verify Storage Bucket (1 menit)

1. Go to **Storage** di Supabase Dashboard
2. Check bucket **avatars** sudah ada
3. Check bucket is **Public**
4. Done!

---

## Step 3: Test Upload (1 menit)

1. Login ke aplikasi
2. Go to **Profil** page
3. Click **Upload Foto**
4. Pilih foto (JPG/PNG, max 2MB)
5. Foto akan langsung terupload
6. Avatar tampil di profile & navigation

---

## Troubleshooting

### Error: "new row violates row-level security policy"
**SOLUSI:** Run file `supabase/fix-storage-policies.sql` di SQL Editor

Lihat **`AVATAR_TROUBLESHOOTING.md`** untuk solusi lengkap semua error.

### Error: "Bucket not found"
- Run Step 1 lagi
- Check SQL executed successfully

### Error: "Permission denied"
- Check storage policies di Step 1
- Logout & login lagi

### Avatar tidak tampil
- Check file uploaded di Storage > avatars
- Check URL accessible
- Clear browser cache
- Hard refresh: Ctrl + Shift + R

---

## Done! ✅

Fitur avatar sudah aktif!

Users bisa upload foto profil dari halaman **Profil**.

---

## What's Fixed

1. ✅ **Input text color** - Sekarang text input berwarna hitam (text-gray-900)
2. ✅ **Avatar upload** - User bisa upload foto profil
3. ✅ **Avatar display** - Avatar tampil di profile page & navigation
4. ✅ **File validation** - Max 2MB, hanya image files
5. ✅ **Loading states** - Spinner saat upload
6. ✅ **Error handling** - Clear error messages

---

## Next Steps

- [ ] Test upload foto
- [ ] Test dengan berbagai format (JPG, PNG, GIF)
- [ ] Test file size limit
- [ ] Share dengan team!

Enjoy! 🎉
