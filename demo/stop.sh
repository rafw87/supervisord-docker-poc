#!/bin/bash

set -x

PORT="${1:-8080}"
EXIT_CODE="${2:-0}"
DELAY_MS="${3:-3000}"

jq -n ".exitCode=${EXIT_CODE} | .delay=${DELAY_MS}" | curl \
        --location --request POST "http://localhost:${PORT}/stop" \
        --header 'Content-Type: application/json' -d @-
