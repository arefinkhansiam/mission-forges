# Mission Forge 2026 — Local Setup & Deployment Guide

## 1. System Requirements & Prerequisites
- **Node.js:** v18.18.0 or newer (v20+ recommended) or **Bun** v1.0+
- **Package Manager:** `npm`, `pnpm`, or `bun`
- **Graphics Support:** Modern browser with WebGL2 support (Chrome 90+, Edge 90+, Firefox 88+, Safari 15+)
- **Hardware Acceleration:** Enabled in browser settings for 60 FPS 3D rendering

---

## 2. Quickstart Installation

### 2.1. Clone and Install Dependencies
```bash
git clone https://github.com/arefinkhansiam/mission-forges.git
cd mission-forges
npm install
```

### 2.2. Configure Environment (Optional)
Create a `.env` file in the root directory to supply a custom NASA Open APIs key:
```ini
# Optional NASA Open Data API Key (falls back to DEMO_KEY if omitted)
VITE_NASA_API_KEY=DEMO_KEY

# Application Port (defaults to 8080)
PORT=8080
```

### 2.3. Launch the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:8080
```

---

## 3. Production Build & Verification

```bash
# Verify TypeScript types
cmd.exe /c "npx tsc --noEmit"

# Build production bundle with Vite and TanStack Start
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Docker Deployment

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 8080
CMD ["npm", "start"]
```

Build and run the container:
```bash
docker build -t mission-forge:2026 .
docker run -p 8080:8080 mission-forge:2026
```
