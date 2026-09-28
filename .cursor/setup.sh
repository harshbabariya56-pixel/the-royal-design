#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ The Royal Design — project setup"

git config --local user.name "harshbabariya56-pixel"
git config --local user.email "306111431+harshbabariya56-pixel@users.noreply.github.com"
echo "  ✓ Git identity set for this repo"

WANT_REMOTE="https://github.com/harshbabariya56-pixel/the-royal-design.git"
CURRENT_REMOTE="$(git remote get-url origin 2>/dev/null || true)"
if [ "$CURRENT_REMOTE" != "$WANT_REMOTE" ]; then
  if [ -n "$CURRENT_REMOTE" ]; then
    git remote set-url origin "$WANT_REMOTE"
  else
    git remote add origin "$WANT_REMOTE"
  fi
  echo "  ✓ Git remote → harshbabariya56-pixel/the-royal-design"
else
  echo "  ✓ Git remote OK"
fi

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "  ! Created .env.local — paste Neon DATABASE_URL into it"
else
  echo "  ✓ .env.local exists"
fi

if command -v nvm >/dev/null 2>&1; then
  source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
  nvm use 20 >/dev/null 2>&1 || true
fi

if [ ! -d node_modules ]; then
  echo "  → Running npm install…"
  npm install
else
  echo "  ✓ node_modules OK"
fi

echo ""
echo "GitHub: https://github.com/harshbabariya56-pixel/the-royal-design"
echo "Auth: gh auth switch --user harshbabariya56-pixel && npx vercel login"
