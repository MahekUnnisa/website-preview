# Deployment Guide

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Deployment

### Option 1: Docker CLI

```bash
# Build the image
docker build -t zeroai-website:latest .

# Run the container
docker run -d \
  --name zeroai-website \
  -p 3000:80 \
  --restart unless-stopped \
  zeroai-website:latest

# View logs
docker logs -f zeroai-website

# Stop and remove
docker stop zeroai-website
docker rm zeroai-website
```

### Option 2: Docker Compose (Recommended)

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Environment Setup

The application uses environment variables for configuration. Create a `.env` file:

```env
VITE_API_URL=https://api.zeroai.com
VITE_APP_NAME=ZeroAI
```

## Performance Optimizations

The production build includes:

- **Code splitting** - Vendor chunks separated for better caching
- **Minification** - JavaScript and CSS minified with Terser
- **Gzip compression** - Nginx configured for gzip compression
- **Cache headers** - Static assets cached for 1 year
- **Multi-stage build** - Docker image optimized to ~25MB

## Nginx Configuration

The production Dockerfile includes an optimized Nginx configuration with:

- Gzip compression for text assets
- Long-term caching for static files
- SPA fallback routing
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Health check endpoint

## Health Checks

The Docker container includes a health check that runs every 30 seconds:

```bash
# Check container health
docker ps

# Manual health check
curl http://localhost:3000
```

## Monitoring

### Container Stats

```bash
# View resource usage
docker stats zeroai-website
```

### Logs

```bash
# View all logs
docker logs zeroai-website

# Follow logs
docker logs -f zeroai-website

# Last 100 lines
docker logs --tail 100 zeroai-website
```

## Scaling

For production deployments, consider:

1. **Load Balancer** - Use nginx or HAProxy
2. **CDN** - CloudFlare, AWS CloudFront
3. **Container Orchestration** - Kubernetes, Docker Swarm
4. **CI/CD** - GitHub Actions, GitLab CI

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs zeroai-website

# Inspect container
docker inspect zeroai-website
```

### Build fails

```bash
# Clear node_modules and rebuild
rm -rf node_modules
npm install
npm run build
```

### Port already in use

```bash
# Use a different port
docker run -p 8080:80 zeroai-website:latest
```

## Production Checklist

- [ ] Update environment variables
- [ ] Configure domain and SSL
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Enable security headers
- [ ] Test health checks
- [ ] Configure log rotation
- [ ] Set up CDN for static assets
- [ ] Enable rate limiting
- [ ] Configure firewall rules

## Support

For issues or questions:
- Email: support@zeroai.com
- GitHub: [Repository URL]
- Documentation: [Docs URL]

