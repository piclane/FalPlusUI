#!/usr/bin/env sh

# Start two SSH tunnels in the background and ensure they are cleaned up on exit (e.g., Ctrl+C).

set -eu

cleanup() {
  # Be idempotent and quiet
  for pid in ${PID1:-} ${PID2:-}; do
    if [ -n "${pid}" ] 2>/dev/null && kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}" 2>/dev/null || true
      # Wait for it to exit to avoid zombies
      wait "${pid}" 2>/dev/null || true
    fi
  done
}

trap cleanup INT TERM EXIT

# Tunnel 1: local 8091 -> remote localhost:8080
ssh -N -L 8091:localhost:8080 foltia@kirari.piclane.xxuz.com &
PID1=$!

# Tunnel 2: local 8092 -> remote localhost:80
ssh -N -L 8092:localhost:80 foltia@kirari.piclane.xxuz.com &
PID2=$!

# Wait until both background ssh processes exit (or until interrupted)
wait

