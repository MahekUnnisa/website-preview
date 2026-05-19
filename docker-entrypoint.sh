#!/bin/sh
set -e

# Expose every container env var whose name starts with VITE_ (set via Compose `environment`).
# Omit empty strings so Compose defaults don't override the app's built-in fallbacks as "".
JSON=$(
    jq -n 'env |
        with_entries(select(.key | test("^VITE_"))) |
        with_entries(select(.value != null and .value != ""))'
)

printf '%s\n' "window.__ENV__ = ${JSON};" > /usr/share/nginx/html/runtime-env.js

chown nginx:nginx /usr/share/nginx/html/runtime-env.js

exec nginx -g 'daemon off;'
