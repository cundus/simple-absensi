@echo off
echo ========================================
echo   Initial Push ke GitHub
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git tidak terinstall!
    echo Download dari: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo IMPORTANT: Pastikan Anda sudah:
echo 1. Create repository di GitHub
echo 2. Copy repository URL
echo.
set /p repo_url="Paste GitHub repository URL (https://github.com/username/repo-name.git): "

if "%repo_url%"=="" (
    echo ERROR: Repository URL tidak boleh kosong!
    pause
    exit /b 1
)

echo.
echo [1/6] Initializing git repository...
git init

echo.
echo [2/6] Adding all files...
git add .

echo.
echo [3/6] Creating initial commit...
git commit -m "Initial commit: Sistem Absensi Karyawan"

echo.
echo [4/6] Adding remote repository...
git remote add origin %repo_url%

echo.
echo [5/6] Renaming branch to main...
git branch -M main

echo.
echo [6/6] Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Possible solutions:
    echo 1. Check repository URL is correct
    echo 2. Check you have access to the repository
    echo 3. You may need Personal Access Token
    echo    Get it from: https://github.com/settings/tokens
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! ✓
echo ========================================
echo.
echo Project berhasil di-push ke GitHub!
echo.
echo Next steps:
echo 1. Buka repository di GitHub
echo 2. Verify semua file sudah ada
echo 3. Setup Vercel deployment (optional)
echo.
echo Repository URL: %repo_url%
echo.
pause
