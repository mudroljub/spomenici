#!/usr/bin/env bash
# Otvara aplikaciju u Chrome-u bez prozora, na ekranu telefona, i snima je.
# bash .claude/skills/spomenici-provera/scripts/aplikacija.sh <snimak.png> ["JS izraz"] [čekanje ms]
# Okruženje: HASH=#<id> otvara spomenik, W=1440 H=900 daje računar (i dalje sa dodirom).
# Ispis: EVAL <vrednost izraza>; EXC znači grešku u aplikaciji. Server se gasi i kad snimak ne uspe.
set -u
koren="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$koren" || exit 1

python -m http.server 8765 >/dev/null 2>&1 &
server=$!
ugasi() {
  kill "$server" 2>/dev/null
  # na Windowsu kill ne gasi uvek python koji je pokrenuo bash
  powershell -NoProfile -Command 'Get-NetTCPConnection -LocalPort 8765 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }' >/dev/null 2>&1
}
trap ugasi EXIT

for _ in $(seq 20); do
  curl -s -o /dev/null http://localhost:8765/ && break
  sleep 0.5
done
timeout 150 node alati/snimi.mjs "$@"
