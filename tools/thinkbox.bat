@echo off
title ThinkBox AI Operation Systems
color 0A
cls

echo.
echo   ============================================================
echo    ThinkBox AI Operation Systems
echo    MJUEM AI Operations System (TM)
echo   ============================================================
echo.

:: Find Python
where python >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON=python
    goto :run
)

where python3 >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON=python3
    goto :run
)

echo   ERROR: Python not found on this computer.
echo.
echo   Please install Python first:
echo     1. Open your browser
echo     2. Go to python.org/downloads
echo     3. Click Download Python
echo     4. Run the installer
echo     5. CHECK the box that says "Add Python to PATH"
echo     6. Close this window and double-click this icon again
echo.
pause
exit /b 1

:run
:: Set the folder where openclaw lives
set OPENCLAW=%USERPROFILE%\openclaw

:: Check the folder exists
if not exist "%OPENCLAW%\skills\thinkbox\scripts\thinkbox.py" (
    echo   ERROR: openclaw folder not found at:
    echo   %OPENCLAW%
    echo.
    echo   Steps to fix:
    echo     1. Open PowerShell (press Windows key, type PowerShell, press Enter)
    echo     2. Type:  cd ~
    echo     3. Type:  git clone https://github.com/mjunlimitedessentials/openclaw
    echo     4. Close PowerShell and double-click this icon again
    echo.
    pause
    exit /b 1
)

:: Run ThinkBox
%PYTHON% "%OPENCLAW%\skills\thinkbox\scripts\thinkbox.py"

:: If something crashed, keep window open so you can read the error
if %errorlevel% neq 0 (
    echo.
    echo   Something went wrong. Screenshot this window and send to ThinkBox support.
    echo.
    pause
)
