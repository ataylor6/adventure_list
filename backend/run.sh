#!/usr/bin/env bash
# Usage:
#   ./run.sh              # waitlist (default)
#   ./run.sh waitlist
#   ./run.sh full
set -euo pipefail
cd "$(dirname "$0")"

MODE="${1:-waitlist}"
if [[ "$MODE" != "waitlist" && "$MODE" != "full" ]]; then
  echo "Usage: ./run.sh [waitlist|full]"
  exit 1
fi

# shellcheck disable=SC1091
source .venv/bin/activate
echo "Starting Adventure List API in APP_MODE=$MODE"
APP_MODE="$MODE" exec uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
