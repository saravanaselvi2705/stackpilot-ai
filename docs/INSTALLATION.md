# StackPilot AI — Local Installation & Setup Guide

This guide describes how to install, configure, and execute StackPilot AI on a local developer environment.

## 🛠️ System Requirements

- **Operating System**: Linux, macOS, or Windows WSL2
- **Node.js**: v20.x LTS or higher
- **Package Manager**: npm v10.x+
- **Database**: MongoDB v7.0+ (Local service or MongoDB Atlas cluster)

---

## 📥 Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/saravanaselvi2705/stackpilot-ai.git
cd stackpilot-ai
```

### 2. Install Workspace Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `apps/api/.env`:
```bash
cp .env.example apps/api/.env
```

Ensure variables are set:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/stackpilot
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Automated Database Seeding
On server boot, the system automatically checks for Super Admin existence. If absent, it seeds:
- **Default Super Admin**: `admin@stackpilot.ai`
- **Default Password**: `password123`
- **Roles & Permissions**: Full predefined enterprise permission matrix.

---

## 🧪 Testing Compilation & Build

To test TypeScript compilation across both frontend and backend:
```bash
# Check TypeScript errors
npx tsc --noEmit --prefix apps/api
npx tsc -b apps/web

# Build workspace production bundles
npm run build
```
