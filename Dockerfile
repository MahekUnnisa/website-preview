# Multi-stage build: build with Node, serve with lightweight nginx
FROM node:24.13.0-alpine3.23 AS builder

WORKDIR /app

# Install dependencies (including devDependencies required by the build)
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build

# Final stage: serve the static site with nginx (non-root on 8080)
FROM nginx:stable-alpine-slim

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]
