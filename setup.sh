#!/usr/bin/env bash
# ============================================================
#  Ajaia Docs — One-command setup & start script
#  Usage: bash setup.sh [--seed] [--dev] [--build]
# ============================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()  { echo -e "${BLUE}[ajaia]${NC} $1"; }
ok()   { echo -e "${GREEN}  ✔${NC} $1"; }
warn() { echo -e "${YELLOW}  ⚠${NC} $1"; }
err()  { echo -e "${RED}  ✘${NC} $1"; exit 1; }

# ── Parse args ──────────────────────────────────────────────
DO_SEED=false
DO_DEV=false
DO_BUILD=false

for arg in "$@"; do
  case "$arg" in
    --seed)  DO_SEED=true ;;
    --dev)   DO_DEV=true ;;
    --build) DO_BUILD=true ;;
    --help|-h)
      echo "Usage: bash setup.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --seed    Seed the database with sample users & documents"
      echo "  --dev     Start the development server after setup"
      echo "  --build   Build for production after setup"
      echo "  --help    Show this help message"
      echo ""
      echo "Examples:"
      echo "  bash setup.sh              # Install deps, init DB"
      echo "  bash setup.sh --seed --dev # Full setup + seed + start dev server"
      exit 0
      ;;
    *) warn "Unknown option: $arg" ;;
  esac
done

# ── 1. Check prerequisites ─────────────────────────────────
log "Checking prerequisites..."

if ! command -v node &> /dev/null; then
  err "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  err "Node.js 18+ is required (found v$(node -v))"
fi
ok "Node.js $(node -v)"

if ! command -v npm &> /dev/null; then
  err "npm is not installed."
fi
ok "npm $(npm -v)"

# ── 2. Install dependencies ────────────────────────────────
log "Installing dependencies..."
npm install --legacy-peer-deps 2>&1 | tail -3

# Approve Prisma install scripts if needed
npm install-scripts approve @prisma/client prisma @prisma/engines esbuild 2>/dev/null || true
ok "Dependencies installed"

# ── 3. Set up environment ──────────────────────────────────
if [ ! -f .env ]; then
  log "Creating .env from template..."
  cp .env.example .env
  ok "Created .env"
else
  ok ".env already exists"
fi

# ── 4. Generate Prisma Client ──────────────────────────────
log "Generating Prisma Client..."
npx prisma generate 2>&1 | grep -E "(Generated|Error)" || true
ok "Prisma Client generated"

# ── 5. Initialize database ─────────────────────────────────
log "Pushing database schema..."
npx prisma db push 2>&1 | grep -E "(sync|created|Error)" || true
ok "Database schema synced"

# ── 6. Seed database (optional) ────────────────────────────
if [ "$DO_SEED" = true ]; then
  log "Seeding database..."
  npx tsx prisma/seed.ts
  ok "Database seeded"
else
  warn "Skipping seed (use --seed to seed with sample data)"
fi

# ── 7. Done! ────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅  Ajaia Docs setup complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo "  Available commands:"
echo "    npm run dev        → Start development server (http://localhost:3000)"
echo "    npm run build      → Build for production"
echo "    npm run start      → Start production server"
echo "    npm run db:seed    → Seed database with sample data"
echo "    npm run db:studio  → Open Prisma Studio (database GUI)"
echo "    npm run test       → Run tests"
echo ""

# ── 8. Start dev server (optional) ─────────────────────────
if [ "$DO_BUILD" = true ]; then
  log "Building for production..."
  npm run build
  ok "Production build complete"
  echo ""
  echo "  Start production server: npm run start"
fi

if [ "$DO_DEV" = true ]; then
  log "Starting development server..."
  echo ""
  npm run dev
fi
