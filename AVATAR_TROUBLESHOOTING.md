# 🔧 Avatar Upload Troubleshooting

Panduan mengatasi error saat upload foto profil.

---

## Error: "new row violates row-level security policy"

### Penyebab
Storage RLS policy terlalu strict atau belum di-setup dengan benar.

### Solusi 1: Run Fix Script (RECOMMENDED)

1. Buka **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy & paste dari file `supabase/fix-storage-policies.sql`:

```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Create simplified policies
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
5. Logout & login lagi
6. Try upload foto lagi

### Solusi 2: Manual via Dashboard

1. Go to **Storage** di Supabase Dashboard
2. Click bucket **avatars**
3. Go to **Policies** tab
4. Delete semua existing policies
5. Click **New Policy**
6. Create 4 policies:

**Policy 1: Upload**
- Name: `Authenticated users can upload avatars`
- Target roles: `authenticated`
- Policy command: `INSERT`
- WITH CHECK: `bucket_id = 'avatars'`

**Policy 2: Update**
- Name: `Authenticated users can update avatars`
- Target roles: `authenticated`
- Policy command: `UPDATE`
- USING: `bucket_id = 'avatars'`

**Policy 3: Delete**
- Name: `Authenticated users can delete avatars`
- Target roles: `authenticated`
- Policy command: `DELETE`
- USING: `bucket_id = 'avatars'`

**Policy 4: Select**
- Name: `Anyone can view avatars`
- Target roles: `public`
- Policy command: `SELECT`
- USING: `bucket_id = 'avatars'`

7. Save all policies
8. Logout & login lagi
9. Try upload foto lagi

---

## Error: "Bucket not found"

### Penyebab
Storage bucket `avatars` belum dibuat.

### Solusi

1. Go to **Storage** di Supabase Dashboard
2. Click **New bucket**
3. Name: `avatars`
4. Public: **Yes** (checked)
5. Click **Create bucket**

Atau run SQL:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

---

## Error: "File too large"

### Penyebab
File lebih dari 2MB.

### Solusi

1. Compress foto menggunakan:
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)
   - Photoshop / GIMP
2. Atau resize foto ke ukuran lebih kecil (max 1000x1000px)
3. Try upload lagi

---

## Error: "Invalid file type"

### Penyebab
File bukan image (JPG/PNG/GIF).

### Solusi

1. Convert file ke JPG atau PNG
2. Pastikan file extension benar (.jpg, .png, .gif)
3. Try upload lagi

---

## Avatar tidak tampil setelah upload

### Penyebab 1: Cache browser

**Solusi:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Reload page

### Penyebab 2: URL tidak public

**Solusi:**
1. Check bucket `avatars` is **Public**
2. Go to Storage > avatars > Settings
3. Enable **Public bucket**
4. Try upload lagi

### Penyebab 3: File tidak ada di storage

**Solusi:**
1. Go to Storage > avatars
2. Check file ada di folder
3. If not, try upload lagi

---

## Error: "Permission denied"

### Penyebab
User tidak authenticated atau token expired.

### Solusi

1. Logout dari aplikasi
2. Login lagi
3. Try upload lagi

Atau check di console browser:
```javascript
// Check if user authenticated
const { data: { user } } = await supabase.auth.getUser()
console.log(user) // Should not be null
```

---

## Upload sangat lambat

### Penyebab
File terlalu besar atau internet lambat.

### Solusi

1. Compress foto ke < 500KB
2. Check internet connection
3. Try upload di waktu lain
4. Use smaller image size

---

## Verify Setup

Run SQL ini untuk verify setup:

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Check policies
SELECT 
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%avatar%';

-- Check column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'avatar_url';
```

Expected results:
- Bucket `avatars` exists with `public = true`
- 4 policies exist (INSERT, UPDATE, DELETE, SELECT)
- Column `avatar_url` exists in `users` table

---

## Debug Mode

Enable debug mode di ProfileForm.tsx:

```typescript
const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('Upload started')
  const file = e.target.files?.[0]
  console.log('File:', file)
  
  // ... rest of code
  
  try {
    console.log('Uploading to:', filePath)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })
    
    console.log('Upload error:', uploadError)
    console.log('Public URL:', publicUrl)
    
    // ... rest of code
  } catch (err) {
    console.error('Upload failed:', err)
  }
}
```

Check browser console untuk error details.

---

## Still Not Working?

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Go to **Logs** > **Storage**
3. Look for errors related to avatars bucket
4. Check error message

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try upload foto
4. Look for failed requests
5. Check response error

### Contact Support

If masih error setelah semua solusi di atas:

1. Screenshot error message
2. Check Supabase logs
3. Check browser console
4. Create issue di GitHub (if using GitHub)
5. Contact Supabase support

---

## Prevention

### Best Practices

1. ✅ Always compress images before upload
2. ✅ Use JPG for photos (smaller size)
3. ✅ Use PNG for graphics/logos
4. ✅ Keep file size < 500KB
5. ✅ Test upload in development first
6. ✅ Verify policies before production

### Monitoring

1. Monitor storage usage di Supabase Dashboard
2. Set up alerts for storage quota
3. Regular cleanup of old avatars
4. Backup important avatars

---

## Quick Fix Checklist

Jika upload error, coba langkah ini secara berurutan:

- [ ] Run `fix-storage-policies.sql`
- [ ] Logout & login lagi
- [ ] Clear browser cache
- [ ] Check file size < 2MB
- [ ] Check file type is image
- [ ] Check bucket `avatars` exists
- [ ] Check bucket is public
- [ ] Check internet connection
- [ ] Try different browser
- [ ] Check Supabase logs

---

## Success! ✅

Jika upload berhasil, Anda akan lihat:
- ✅ Avatar preview update immediately
- ✅ Success message "Profile berhasil diupdate"
- ✅ Avatar tampil di navigation bar
- ✅ Avatar tampil di profile header
- ✅ File ada di Storage > avatars

Enjoy your new profile photo! 📸
