# Logo Update - Sistem Absensi Karyawan

## Changes Made

Logo `public/logo.png` telah ditambahkan ke berbagai bagian aplikasi:

### 1. ✅ Navigation Bar (DashboardNav)
- Logo ditampilkan di sebelah kiri navbar
- Size: 40x40 pixels
- Menggunakan Next.js Image component untuk optimasi

**Location:** `components/DashboardNav.tsx`

```tsx
<Image
  src="/logo.png"
  alt="Logo"
  width={40}
  height={40}
  className="object-contain"
/>
```

---

### 2. ✅ Login Page
- Logo ditampilkan di atas judul
- Size: 80x80 pixels
- Centered alignment

**Location:** `app/login/page.tsx`

```tsx
<Image
  src="/logo.png"
  alt="Logo"
  width={80}
  height={80}
  className="object-contain"
/>
```

---

### 3. ✅ Browser Tab (Favicon & Metadata)
- Logo digunakan sebagai favicon
- Metadata title & description updated
- Apple touch icon

**Location:** `app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: "Sistem Absensi Karyawan",
  description: "Aplikasi absensi karyawan berbasis web...",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};
```

---

## Visual Preview

### Navigation Bar
```
┌─────────────────────────────────────────────────┐
│ [🖼️ Logo] Absensi App  Dashboard  Absensi  ... │
└─────────────────────────────────────────────────┘
```

### Login Page
```
┌─────────────────────────────────┐
│                                 │
│          [🖼️ Logo]              │
│                                 │
│   Sistem Absensi Karyawan       │
│   Silakan login untuk melanjutkan│
│                                 │
│   [Login dengan Google]         │
│                                 │
└─────────────────────────────────┘
```

### Browser Tab
```
[🖼️] Sistem Absensi Karyawan
```

---

## Logo Specifications

**File:** `public/logo.png`

**Recommended Specs:**
- Format: PNG with transparency
- Size: 512x512 pixels (or larger)
- Aspect ratio: 1:1 (square)
- Background: Transparent or white

**Current Usage:**
- Navbar: 40x40px
- Login: 80x80px
- Favicon: 32x32px (auto-scaled)

---

## How to Replace Logo

### Option 1: Replace File
1. Prepare your logo (PNG format, square, transparent background)
2. Rename to `logo.png`
3. Replace file in `public/logo.png`
4. Refresh browser (Ctrl+F5)

### Option 2: Use Different Filename
1. Add your logo to `public/` folder (e.g., `my-logo.png`)
2. Update references in:
   - `components/DashboardNav.tsx`
   - `app/login/page.tsx`
   - `app/layout.tsx`
3. Change `/logo.png` to `/my-logo.png`

---

## Additional Customization

### Change Logo Size in Navbar
Edit `components/DashboardNav.tsx`:

```tsx
<Image
  src="/logo.png"
  alt="Logo"
  width={50}  // Change this
  height={50} // Change this
  className="object-contain"
/>
```

### Change Logo Size in Login
Edit `app/login/page.tsx`:

```tsx
<Image
  src="/logo.png"
  alt="Logo"
  width={100}  // Change this
  height={100} // Change this
  className="object-contain"
/>
```

### Add Logo to Other Pages
Use the same pattern:

```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={40}
  height={40}
  className="object-contain"
/>
```

---

## Optimization

Next.js Image component automatically:
- ✅ Optimizes image size
- ✅ Lazy loads images
- ✅ Serves WebP format when supported
- ✅ Responsive images
- ✅ Prevents layout shift

No additional configuration needed!

---

## Troubleshooting

### Logo not showing
1. Check file exists: `public/logo.png`
2. Check file name is correct (case-sensitive)
3. Clear browser cache (Ctrl+F5)
4. Check browser console for errors

### Logo looks blurry
1. Use higher resolution image (512x512 or larger)
2. Ensure PNG format with transparency
3. Check `object-contain` class is applied

### Logo too big/small
1. Adjust `width` and `height` props
2. Keep aspect ratio 1:1 for best results
3. Use `object-contain` to maintain aspect ratio

---

## Files Modified

1. ✅ `components/DashboardNav.tsx` - Added logo to navbar
2. ✅ `app/login/page.tsx` - Added logo to login page
3. ✅ `app/layout.tsx` - Updated metadata & favicon

---

## Next Steps

Logo sudah terintegrasi! Sekarang Anda bisa:

1. ✅ Test tampilan logo di navbar
2. ✅ Test tampilan logo di login page
3. ✅ Check favicon di browser tab
4. ✅ Replace dengan logo custom jika perlu

---

## Summary

✅ Logo ditampilkan di 3 tempat:
- Navigation bar (40x40)
- Login page (80x80)
- Browser tab (favicon)

✅ Menggunakan Next.js Image untuk optimasi

✅ Easy to customize & replace

Aplikasi sekarang memiliki branding yang konsisten! 🎨
