# Multi-stage build: build with Node, serve with lightweight nginx
FROM node:24.13.0-alpine3.23 AS builder

WORKDIR /app

# Install dependencies (including devDependencies required by the build)
COPY package*.json ./
RUN npm ci

# VITE_* is not needed here: nginx entrypoint emits /runtime-env.js from container env (see docker-compose `environment`).
COPY . .

RUN npm run build

# Final stage: serve the static site with nginx
FROM nginx:stable-alpine-slim

RUN apk add --no-cache jq

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
