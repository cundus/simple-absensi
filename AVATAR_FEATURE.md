# 📸 Avatar Upload Feature

Fitur upload foto profil untuk user menggunakan Supabase Storage.

---

## Setup Instructions

### 1. Run Database Migration

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Add avatar_url column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

### 2. Setup Storage Policies

Jalankan SQL berikut untuk setup RLS policies di Storage:

```sql
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### 3. Verify Storage Bucket

1. Buka Supabase Dashboard
2. Go to **Storage**
3. Verify bucket `avatars` sudah terbuat
4. Check policies sudah aktif

---

## Features

### Upload Photo
- ✅ Upload foto profil dari halaman profile
- ✅ Support JPG, PNG, GIF
- ✅ Maksimal ukuran 2MB
- ✅ Auto-resize dan optimize (future enhancement)
- ✅ Preview sebelum upload

### Display Avatar
- ✅ Avatar tampil di profile page header
- ✅ Avatar tampil di navigation bar
- ✅ Avatar tampil di user table (admin)
- ✅ Fallback ke initial jika tidak ada avatar

### Security
- ✅ User hanya bisa upload avatar sendiri
- ✅ User hanya bisa update avatar sendiri
- ✅ User hanya bisa delete avatar sendiri
- ✅ Public bisa view semua avatar
- ✅ File type validation
- ✅ File size validation

---

## Usage

### Upload Avatar

1. Login ke aplikasi
2. Go to **Profil** page
3. Click **Upload Foto** button
4. Pilih foto dari device
5. Foto akan otomatis terupload
6. Avatar akan langsung tampil

### Change Avatar

1. Go to **Profil** page
2. Click **Upload Foto** button
3. Pilih foto baru
4. Foto lama akan ter-replace

### Remove Avatar

Untuk remove avatar, upload foto baru atau hapus manual dari Supabase Storage.

---

## Technical Details

### File Storage Structure

```
avatars/
  ├── {user_id}-{timestamp}.jpg
  ├── {user_id}-{timestamp}.png
  └── {user_id}-{timestamp}.gif
```

### Database Schema

```sql
ALTER TABLE public.users
ADD COLUMN avatar_url TEXT;
```

### API Endpoint

**PUT /api/profile**

Request:
```json
{
  "name": "John Doe",
  "avatar_url": "https://...supabase.co/storage/v1/object/public/avatars/..."
}
```

Response:
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "https://...supabase.co/storage/v1/object/public/avatars/...",
    ...
  }
}
```

---

## Component Updates

### ProfileForm.tsx
- Added avatar upload input
- Added avatar preview
- Added loading state during upload
- Added file validation
- Added Supabase Storage integration

### ProfilePage
- Display avatar in header card
- Fallback to initial if no avatar

### DashboardNav
- Display avatar in navigation
- Fallback to initial if no avatar

### UserTable (Admin)
- Display avatar in user list
- Fallback to initial if no avatar

---

## Validation Rules

### File Type
- Allowed: `image/jpeg`, `image/png`, `image/gif`
- Rejected: PDF, video, other formats

### File Size
- Maximum: 2MB (2,097,152 bytes)
- Recommended: < 1MB for faster upload

### File Name
- Format: `{user_id}-{timestamp}.{ext}`
- Example: `abc123-1234567890.jpg`

---

## Error Handling

### Upload Errors

**"File harus berupa gambar"**
- User mencoba upload non-image file
- Solution: Pilih file JPG, PNG, atau GIF

**"Ukuran file maksimal 2MB"**
- File terlalu besar
- Solution: Compress atau resize foto

**"Gagal upload foto"**
- Network error atau Supabase error
- Solution: Coba lagi atau check internet connection

---

## Future Enhancements

### Image Processing
- [ ] Auto-resize to 400x400px
- [ ] Auto-compress untuk optimize size
- [ ] Generate thumbnail
- [ ] Support WebP format

### UI Improvements
- [ ] Drag & drop upload
- [ ] Crop tool sebelum upload
- [ ] Multiple photo upload
- [ ] Photo gallery

### Features
- [ ] Remove avatar button
- [ ] Avatar history
- [ ] Default avatar selection
- [ ] Avatar from URL

---

## Troubleshooting

### Issue: "Upload failed"

**Solution:**
1. Check Supabase Storage bucket exists
2. Check storage policies are correct
3. Check file size < 2MB
4. Check file type is image
5. Check internet connection

### Issue: "Avatar not showing"

**Solution:**
1. Check avatar_url in database
2. Check URL is accessible (public)
3. Check storage bucket is public
4. Clear browser cache
5. Check image file exists in storage

### Issue: "Permission denied"

**Solution:**
1. Check user is authenticated
2. Check storage policies are correct
3. Check user_id matches in policy
4. Re-login to refresh token

---

## Storage Costs

### Supabase Free Tier
- 1 GB storage
- 2 GB bandwidth/month

### Estimated Usage
- Average avatar size: 200 KB
- 100 users = 20 MB storage
- 1000 users = 200 MB storage

### When to Upgrade
- Storage > 800 MB
- Bandwidth > 1.5 GB/month
- Need CDN for faster delivery

---

## Security Best Practices

### Implemented
- ✅ File type validation
- ✅ File size validation
- ✅ RLS policies on storage
- ✅ User can only upload own avatar
- ✅ Public read-only access

### Recommended
- [ ] Virus scanning (enterprise)
- [ ] Content moderation (enterprise)
- [ ] Rate limiting on uploads
- [ ] Watermark for public avatars

---

## Testing Checklist

### Upload
- [ ] Upload JPG file
- [ ] Upload PNG file
- [ ] Upload GIF file
- [ ] Try upload PDF (should fail)
- [ ] Try upload > 2MB (should fail)
- [ ] Upload shows loading state
- [ ] Avatar updates after upload

### Display
- [ ] Avatar shows in profile header
- [ ] Avatar shows in navigation
- [ ] Avatar shows in user table
- [ ] Fallback shows if no avatar
- [ ] Avatar loads quickly

### Security
- [ ] User can upload own avatar
- [ ] User cannot upload other's avatar
- [ ] Public can view avatars
- [ ] Unauthenticated cannot upload

---

## Congratulations! 🎉

Fitur upload avatar sudah selesai!

Users sekarang bisa:
- ✅ Upload foto profil
- ✅ Lihat avatar di profile page
- ✅ Lihat avatar di navigation
- ✅ Update avatar kapan saja

Aplikasi semakin personal! 📸
