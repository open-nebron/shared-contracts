#!/usr/bin/env bash
set -euo pipefail
cp ../auth-service/openapi.yaml openapi/auth.yaml
cp ../core-api/openapi.yaml     openapi/core.yaml
if [ -f ../chat-service/openapi.yaml ]; then cp ../chat-service/openapi.yaml openapi/chat.yaml; fi
if [ -f ../voice-service/openapi.yaml ]; then cp ../voice-service/openapi.yaml openapi/voice.yaml; fi
echo "openapi synced"
