# ============================================================
#  Ajaia Online Text Editor — Windows PowerShell Setup Script
#  Usage: .\setup.ps1
# ============================================================

Write-Host "[ajaia] Checking prerequisites..." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm is not installed." -ForegroundColor Red
    exit 1
}

Write-Host "[ajaia] Installing dependencies..." -ForegroundColor Cyan
npm install --legacy-peer-deps

Write-Host "[ajaia] Approving engine scripts..." -ForegroundColor Cyan
npm install-scripts approve @prisma/client prisma @prisma/engines esbuild 2>$null

if (-not (Test-Path .env)) {
    Write-Host "[ajaia] Creating .env from .env.example..." -ForegroundColor Cyan
    Copy-Item .env.example .env
}

Write-Host "[ajaia] Preparing database schema..." -ForegroundColor Cyan
npx tsx prisma/prepare.ts

Write-Host "[ajaia] Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "[ajaia] Syncing SQLite database..." -ForegroundColor Cyan
npx prisma db push

Write-Host "[ajaia] Seeding initial test personas and documents..." -ForegroundColor Cyan
npx tsx prisma/seed.ts

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  [OK] Ajaia Online Text Editor setup complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting development server at http://localhost:3000..." -ForegroundColor Cyan
Write-Host ""

npm run dev
