#!/usr/bin/env bash
set -euo pipefail
mkdir -p src/generated
npx openapi-typescript openapi/auth.yaml -o src/generated/auth.d.ts
npx openapi-typescript openapi/core.yaml -o src/generated/core.d.ts
if [ -s openapi/chat.yaml ]; then npx openapi-typescript openapi/chat.yaml -o src/generated/chat.d.ts; fi
if [ -s openapi/voice.yaml ]; then npx openapi-typescript openapi/voice.yaml -o src/generated/voice.d.ts; fi
# Generate event TypeScript types
npx json-schema-to-typescript -i "events/*.json" -o src/generated/events.ts --cwd events
echo "types generated"
