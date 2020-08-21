#!/bin/bash

set -x

PORT="${1:-8080}"
MESSAGE="${2:-Test message}"
LEVEL="${3:-info}"

curl --location --request POST "http://localhost:${PORT}/log/${LEVEL}" \
      --header 'Content-Type: text/plain' -d "${MESSAGE}"
