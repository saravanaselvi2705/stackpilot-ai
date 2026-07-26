# StackPilot AI — Production Deployment Guide

This guide describes containerized deployment for StackPilot AI using Docker Compose, Nginx SSL reverse proxy, and health checks.

## 🐳 Docker Deployment Setup

### 1. Build and Launch Containers
Ensure Docker and Docker Compose are installed on your host server:

```bash
docker compose up -d --build
```

This starts three services:
1. `app`: Node.js Express API listening internally on port `5000`.
2. `mongo`: MongoDB 7.0 persistent database container.
3. `nginx`: Nginx reverse proxy routing port `80` to the Node.js API.

### 2. Verify Container Health
Check container logs and running status:
```bash
docker compose ps
docker compose logs -f app
```

Verify production health endpoint:
```bash
curl http://localhost/api/health
```

Expected JSON response:
```json
{
  "status": "UP",
  "timestamp": "2026-07-26T10:30:00.000Z",
  "uptimeSeconds": 120,
  "database": "Connected",
  "version": "1.0.0-rc1"
}
```

---

## 🔒 SSL & Production Nginx Setup

To attach HTTPS SSL certificates (e.g. Certbot / Let's Encrypt), update `nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name app.stackpilot.ai;

    ssl_certificate /etc/letsencrypt/live/app.stackpilot.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.stackpilot.ai/privkey.pem;

    location / {
        proxy_pass http://app:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
