# Multi-stage Dockerfile for StackPilot AI Enterprise Production

# Stage 1: Build Workspace
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production Server Setup
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install --only=production --prefix apps/api

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/dist ./apps/web/dist

EXPOSE 5000

CMD ["node", "apps/api/dist/server.js"]
