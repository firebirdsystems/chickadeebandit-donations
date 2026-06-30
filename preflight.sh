#!/usr/bin/env bash
# Run before pushing: verifies the build and tests pass.
# Usage:  bash preflight.sh
# Hook:   git config core.hooksPath .githooks  (once per clone)
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
echo ""
echo "▶ Build…"
zsh -lc 'source ~/.zshrc >/dev/null 2>&1 || true; node build.mjs'
echo ""
echo "▶ Tests…"
zsh -lc 'source ~/.zshrc >/dev/null 2>&1 || true; npm test'
echo ""
echo "✓ Preflight passed"
