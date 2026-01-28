# 🚀 Push Project ke GitHub

Panduan lengkap untuk push project Sistem Absensi Karyawan ke GitHub.

---

## Prerequisites

- [x] Git installed di komputer
- [x] Akun GitHub (https://github.com)
- [x] Project sudah jalan di local

---

## Step 1: Install Git (Jika Belum)

### Windows
1. Download Git dari https://git-scm.com/download/win
2. Install dengan default settings
3. Verify: Buka CMD/PowerShell, ketik `git --version`

### Mac
```bash
brew install git
```

### Linux
```bash
sudo apt-get install git
```

---

## Step 2: Setup Git Config (First Time Only)

Buka terminal/CMD di folder project, lalu jalankan:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Ganti dengan nama dan email GitHub Anda.

---

## Step 3: Create GitHub Repository

1. Login ke GitHub (https://github.com)
2. Click tombol **"+"** di kanan atas → **"New repository"**
3. Isi form:
   - **Repository name**: `attendance-system` (atau nama lain)
   - **Description**: `Sistem Absensi Karyawan - Next.js & Supabase`
   - **Visibility**: 
     - ✅ **Public** (jika mau share dengan orang lain)
     - ✅ **Private** (jika mau private)
   - **JANGAN** centang "Initialize with README" (kita sudah punya)
4. Click **"Create repository"**

GitHub akan kasih instruksi, tapi ikuti step di bawah aja.

---

## Step 4: Initialize Git di Project

Buka terminal/CMD di folder `attendance-system`, lalu jalankan:

```bash
# Masuk ke folder project
cd attendance-system

# Initialize git repository
git init

# Add all files
git add .

# Commit pertama
git commit -m "Initial commit: Sistem Absensi Karyawan"
```

---

## Step 5: Connect ke GitHub & Push

Ganti `username` dan `repo-name` dengan punya Anda:

```bash
# Add remote repository
git remote add origin https://github.com/username/repo-name.git

# Rename branch ke main (jika masih master)
git branch -M main

# Push ke GitHub
git push -u origin main
```

**Contoh:**
```bash
git remote add origin https://github.com/johndoe/attendance-system.git
git branch -M main
git push -u origin main
```

Jika diminta login:
- Username: GitHub username Anda
- Password: **Personal Access Token** (bukan password biasa)

---

## Step 6: Create Personal Access Token (Jika Diminta)

Jika git minta password dan gagal:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Isi:
   - **Note**: `Git Access`
   - **Expiration**: `90 days` (atau pilih lain)
   - **Scopes**: Centang **`repo`** (full control)
4. Click **"Generate token"**
5. **COPY TOKEN** (hanya muncul sekali!)
6. Paste token sebagai password saat git push

---

## Step 7: Verify di GitHub

1. Buka repository di GitHub
2. Refresh page
3. Semua file harusnya sudah ada! ✅

---

## 🔒 Security: Protect Sensitive Files

### Files yang TIDAK boleh di-push:

- ✅ `.env.local` - Sudah di `.gitignore`
- ✅ `.env` - Sudah di `.gitignore`
- ✅ `node_modules/` - Sudah di `.gitignore`
- ✅ `.next/` - Sudah di `.gitignore`

### File `.env.example` sudah dibuat

File ini **aman** untuk di-push karena tidak ada credentials asli.

---

## 📝 Update README.md

Sebelum push, pastikan README.md sudah update dengan info:
- ✅ Project description
- ✅ Tech stack
- ✅ Setup instructions
- ✅ Features
- ✅ Screenshots (optional)

---

## 🔄 Push Updates Selanjutnya

Setelah initial push, untuk push perubahan baru:

```bash
# Check status
git status

# Add files yang berubah
git add .

# Commit dengan message
git commit -m "Add avatar upload feature"

# Push ke GitHub
git push
```

---

## 🌿 Git Workflow (Best Practice)

### Create Branch untuk Feature Baru

```bash
# Create & switch to new branch
git checkout -b feature/salary-calculation

# Make changes...

# Commit changes
git add .
git commit -m "Add salary calculation feature"

# Push branch
git push -u origin feature/salary-calculation

# Merge ke main (via GitHub Pull Request)
```

### Merge Branch

Di GitHub:
1. Go to **Pull requests** tab
2. Click **"New pull request"**
3. Select branch to merge
4. Click **"Create pull request"**
5. Review & click **"Merge pull request"**

---

## 📊 GitHub Features to Use

### 1. Issues
Track bugs dan feature requests:
- Go to **Issues** tab
- Click **"New issue"**
- Describe bug/feature

### 2. Projects
Organize tasks:
- Go to **Projects** tab
- Create Kanban board
- Add issues to board

### 3. Wiki
Documentation:
- Go to **Wiki** tab
- Create documentation pages

### 4. Releases
Version management:
- Go to **Releases** tab
- Click **"Create a new release"**
- Tag version (e.g., v1.0.0)

---

## 🚨 Common Issues

### Issue: "Permission denied"

**Solution:**
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/username/repo-name.git
```

### Issue: "Repository not found"

**Solution:**
- Check repository name spelling
- Check repository visibility (private?)
- Check GitHub username

### Issue: "Failed to push"

**Solution:**
```bash
# Pull first
git pull origin main --rebase

# Then push
git push
```

### Issue: "Merge conflict"

**Solution:**
1. Open conflicted files
2. Resolve conflicts manually
3. `git add .`
4. `git commit -m "Resolve conflicts"`
5. `git push`

---

## 📦 Clone Repository (Di Komputer Lain)

Untuk download project di komputer lain:

```bash
# Clone repository
git clone https://github.com/username/repo-name.git

# Masuk ke folder
cd repo-name

# Install dependencies
npm install

# Copy .env.example ke .env.local
cp .env.example .env.local

# Edit .env.local dengan credentials Anda

# Run development server
npm run dev
```

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Status
git status

# Add all files
git add .

# Commit
git commit -m "Your message"

# Push
git push

# Pull
git pull

# Create branch
git checkout -b branch-name

# Switch branch
git checkout branch-name

# Merge branch
git merge branch-name

# Delete branch
git branch -d branch-name

# View history
git log

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all changes
git reset --hard HEAD
```

---

## 🌟 GitHub Profile README (Bonus)

Buat file `README.md` di repository `username/username`:

```markdown
# Hi there 👋

## 🚀 Projects

- [Attendance System](https://github.com/username/attendance-system) - Employee attendance management system

## 💻 Tech Stack

- Next.js, React, TypeScript
- Supabase, PostgreSQL
- Tailwind CSS

## 📫 Contact

- Email: your.email@example.com
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
```

---

## ✅ Checklist Before Push

- [ ] `.gitignore` sudah benar
- [ ] `.env.local` TIDAK di-push
- [ ] `.env.example` sudah dibuat
- [ ] README.md sudah update
- [ ] Code sudah di-test
- [ ] No console.log() yang tidak perlu
- [ ] No commented code
- [ ] Commit message jelas

---

## 🎉 Congratulations!

Project Anda sekarang sudah di GitHub!

**Next Steps:**
1. Share repository link dengan team
2. Setup GitHub Actions untuk CI/CD (optional)
3. Deploy ke Vercel (link GitHub repo)
4. Add badges to README (build status, etc.)

---

## 📚 Resources

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf
- GitHub Desktop: https://desktop.github.com (GUI alternative)

Happy coding! 🚀
