@echo off
title ThinkBox Setup for Windows
color 0B
cls

echo.
echo   ============================================================
echo    ThinkBox AI Operation Systems
echo    Windows Setup -- Run this ONCE to get started
echo   ============================================================
echo.

:: ── Step 1: Check Python ─────────────────────────────────────
echo   [1/4] Checking Python...

where python >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do set PYVER=%%i
    echo         Found: %PYVER%
    set PYTHON=python
    goto :checkgit
)

where python3 >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('python3 --version 2^>^&1') do set PYVER=%%i
    echo         Found: %PYVER%
    set PYTHON=python3
    goto :checkgit
)

echo.
echo   Python is not installed.
echo.
echo   Please do this now:
echo     1. Keep this window open
echo     2. Open your browser
echo     3. Go to:  python.org/downloads
echo     4. Click the big yellow Download button
echo     5. Run the installer
echo     6. IMPORTANT: check "Add Python to PATH" before clicking Install
echo     7. Come back and double-click windows-setup.bat again
echo.
pause
exit /b 1

:: ── Step 2: Check Git ────────────────────────────────────────
:checkgit
echo   [2/4] Checking Git...

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo   Git is not installed.
    echo.
    echo   Please do this now:
    echo     1. Keep this window open
    echo     2. Open your browser
    echo     3. Go to:  git-scm.com
    echo     4. Click Download for Windows
    echo     5. Run the installer -- click Next on everything (defaults are fine)
    echo     6. Come back and double-click windows-setup.bat again
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('git --version 2^>^&1') do set GITVER=%%i
echo         Found: %GITVER%

:: ── Step 3: Clone or update openclaw ─────────────────────────
:clonerepo
echo   [3/4] Setting up openclaw folder...

set OPENCLAW=%USERPROFILE%\openclaw

if exist "%OPENCLAW%\.git" (
    echo         Folder already exists -- pulling latest updates...
    cd /d "%OPENCLAW%"
    git pull origin claude/implement-chatgpt-suggestions-Mz2W4 2>&1
    goto :shortcut
)

echo         Cloning openclaw to %OPENCLAW%...
cd /d "%USERPROFILE%"
git clone https://github.com/mjunlimitedessentials/openclaw 2>&1
if %errorlevel% neq 0 (
    echo.
    echo   Could not download openclaw. Check your internet connection and try again.
    pause
    exit /b 1
)

:: Switch to the ThinkBox branch
cd /d "%OPENCLAW%"
git checkout claude/implement-chatgpt-suggestions-Mz2W4 2>&1

:: ── Step 4: Create Desktop shortcut ──────────────────────────
:shortcut
echo   [4/4] Creating desktop shortcut...

set DESKTOP=%USERPROFILE%\Desktop
set LAUNCHER=%OPENCLAW%\tools\thinkbox.bat
set SHORTCUT=%DESKTOP%\ThinkBox.lnk

:: Use PowerShell to create a proper .lnk shortcut
powershell -NoProfile -Command ^
  "$s=(New-Object -COM WScript.Shell).CreateShortcut('%SHORTCUT%');" ^
  "$s.TargetPath='%LAUNCHER%';" ^
  "$s.WorkingDirectory='%OPENCLAW%';" ^
  "$s.Description='ThinkBox AI Operation Systems';" ^
  "$s.Save()"

if exist "%SHORTCUT%" (
    echo         Shortcut created on your Desktop!
) else (
    echo         Could not create shortcut automatically.
    echo         You can find the launcher at:
    echo         %LAUNCHER%
)

:: ── Done ─────────────────────────────────────────────────────
echo.
echo   ============================================================
echo    Setup Complete!
echo   ============================================================
echo.
echo   You now have a ThinkBox icon on your Desktop.
echo   Double-click it anytime to open the menu.
echo.
echo   If the shortcut is not on your Desktop, go to:
echo   %LAUNCHER%
echo   and double-click thinkbox.bat directly.
echo.
pause
