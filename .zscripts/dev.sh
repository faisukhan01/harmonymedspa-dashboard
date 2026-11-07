#!/bin/bash
# Harmony MedSpa Dashboard - dev server bootstrap for the sandbox session initializer.
cd /home/z/my-project || exit 1

export PATH="/home/z/my-project/node_modules/.bin:$PATH"

# Install dependencies only when they are missing (idempotent).
if [ ! -d node_modules ] || [ ! -x node_modules/.bin/next ]; then
  bun install
fi

exec bash -c 'next dev -p 3000 2>&1 | tee dev.log'
