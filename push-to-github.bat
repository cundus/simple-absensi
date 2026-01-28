@echo off
echo ========================================
echo   Push Project ke GitHub
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

echo [1/5] Checking git status...
git status

echo.
echo [2/5] Adding all files...
git add .

echo.
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update project

echo [3/5] Committing changes...
git commit -m "%commit_message%"

echo.
echo [4/5] Pushing to GitHub...
git push

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Possible solutions:
    echo 1. Run: git remote add origin https://github.com/username/repo-name.git
    echo 2. Run: git push -u origin main
    echo 3. Check your GitHub credentials
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Done! ✓
echo.
echo Project successfully pushed to GitHub!
echo Check your repository at: https://github.com
echo.
pause
