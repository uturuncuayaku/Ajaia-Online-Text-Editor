@echo off
REM ============================================================
REM  Ajaia Online Text Editor — Windows Setup Script (CMD)
REM  Usage: setup.bat
REM ============================================================

echo [ajaia] Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    exit /b 1
)

echo [ajaia] Installing dependencies...
call npm install --legacy-peer-deps

echo [ajaia] Approving engine scripts...
call npm install-scripts approve @prisma/client prisma @prisma/engines esbuild >nul 2>nul

if not exist .env (
    echo [ajaia] Creating .env from .env.example...
    copy .env.example .env >nul
)

echo [ajaia] Preparing database schema...
call npx tsx prisma/prepare.ts

echo [ajaia] Generating Prisma Client...
call npx prisma generate

echo [ajaia] Syncing SQLite database...
call npx prisma db push

echo [ajaia] Seeding initial test personas and documents...
call npx tsx prisma/seed.ts

echo.
echo ============================================================
echo   [OK] Ajaia Online Text Editor setup complete!
echo ============================================================
echo.
echo Starting development server...
echo Local URL: http://localhost:3000
echo.
call npm run dev
