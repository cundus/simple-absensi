# Fix RLS Infinite Recursion Error

## Problem

Error: `infinite recursion detected in policy for relation "users"`

Ini terjadi karena RLS policy untuk table `users` mencoba query table `users` lagi untuk check role admin, yang menyebabkan infinite loop.

## Solution

Gunakan `auth.jwt()` untuk check role dari JWT token, bukan query table `users`.

---

## Cara Fix

### Option 1: Jalankan Schema Baru (Recommended)

1. Buka Supabase Dashboard
2. Klik **SQL Editor**
3. Klik **New query**
4. Copy isi file `supabase/schema-fixed.sql`
5. Paste ke SQL Editor
6. Klik **Run**

File ini akan:
- Drop existing policies yang bermasalah
- Buat policies baru yang menggunakan `auth.jwt()`
- Tambah trigger untuk sync role ke JWT metadata
- Update function `handle_new_user()`

---

### Option 2: Manual Fix (Jika Option 1 Gagal)

#### Step 1: Drop Existing Policies

```sql
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can delete users" ON public.users;
```

#### Step 2: Create New Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can view all users (using JWT)
CREATE POLICY "Admin can view all users"
  ON public.users FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR
    auth.uid() = id
  );

-- Admin can insert users
CREATE POLICY "Admin can insert users"
  ON public.users FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Admin can update all users
CREATE POLICY "Admin can update all users"
  ON public.users FOR UPDATE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Admin can delete users
CREATE POLICY "Admin can delete users"
  ON public.users FOR DELETE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
```

#### Step 3: Create Sync Function

```sql
CREATE OR REPLACE FUNCTION public.sync_user_role_to_jwt()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_role_to_jwt
  AFTER INSERT OR UPDATE OF role ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role_to_jwt();
```

---

## Cara Kerja Fix Ini

### Before (Bermasalah)
```sql
-- Policy ini menyebabkan infinite recursion
CREATE POLICY "Admin can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users  -- ❌ Query users lagi!
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### After (Fixed)
```sql
-- Policy ini menggunakan JWT, tidak query table
CREATE POLICY "Admin can view all users"
  ON public.users FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'  -- ✅ Dari JWT
    OR
    auth.uid() = id
  );
```

---

## Setelah Fix

### 1. Sync Role ke JWT untuk User yang Sudah Ada

Jalankan query ini untuk sync role existing users ke JWT:

```sql
-- Update JWT metadata untuk semua users
UPDATE auth.users au
SET raw_user_meta_data = 
  COALESCE(au.raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', u.role)
FROM public.users u
WHERE au.id = u.id;
```

### 2. Set Admin User

Untuk membuat user pertama menjadi admin:

```sql
-- Ganti dengan email Anda
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-email@gmail.com';
```

Trigger akan otomatis sync role ke JWT.

### 3. Logout & Login Lagi

Setelah update role:
1. Logout dari aplikasi
2. Login lagi
3. JWT baru akan include role yang sudah diupdate

---

## Verifikasi Fix Berhasil

### Test 1: Check Policies

```sql
-- Lihat semua policies untuk table users
SELECT * FROM pg_policies WHERE tablename = 'users';
```

Harus ada 6 policies.

### Test 2: Check JWT

Setelah login, check JWT token di browser console:

```javascript
// Di browser console
const { data } = await supabase.auth.getSession()
console.log(data.session.user.user_metadata)
// Harus ada: { role: 'admin' } atau { role: 'employee' }
```

### Test 3: Test Query

```sql
-- Test sebagai employee (ganti dengan user ID Anda)
SET request.jwt.claims = '{"sub": "user-id-here", "user_metadata": {"role": "employee"}}';
SELECT * FROM public.users;
-- Harus return hanya 1 row (own profile)

-- Test sebagai admin
SET request.jwt.claims = '{"sub": "user-id-here", "user_metadata": {"role": "admin"}}';
SELECT * FROM public.users;
-- Harus return semua users
```

---

## Troubleshooting

### Error: "permission denied for table users"

RLS masih aktif tapi policies belum dibuat. Jalankan ulang Step 2.

### Error: "function auth.jwt() does not exist"

Anda menggunakan Supabase versi lama. Update ke versi terbaru atau gunakan:

```sql
-- Alternative untuk Supabase lama
(current_setting('request.jwt.claims', true)::json -> 'user_metadata' ->> 'role') = 'admin'
```

### Role tidak sync ke JWT

Jalankan manual sync:

```sql
-- Sync semua users
SELECT public.sync_user_role_to_jwt() FROM public.users;
```

Atau logout & login lagi.

---

## Prevention

Untuk mencegah masalah ini di masa depan:

1. ✅ **Selalu gunakan `auth.jwt()` untuk check role**
2. ✅ **Jangan query table yang sama dalam policy**
3. ✅ **Sync role ke JWT metadata**
4. ✅ **Test policies sebelum deploy**

---

## Summary

**Root Cause:** RLS policy query table `users` untuk check role, causing infinite loop

**Solution:** Gunakan `auth.jwt()` untuk check role dari JWT token

**Steps:**
1. Drop old policies
2. Create new policies dengan `auth.jwt()`
3. Create trigger untuk sync role ke JWT
4. Sync existing users
5. Logout & login lagi

**Result:** ✅ No more infinite recursion!

---

Setelah fix ini, aplikasi akan berjalan normal tanpa error! 🎉
