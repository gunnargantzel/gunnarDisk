# 🚀 Deployment Guide - Diskgolf PWA

Denne guiden beskriver hvordan du deployer Diskgolf PWA til forskjellige plattformer.

## 📋 Forutsetninger

- **Git repository** med koden
- **Node.js** (versjon 16 eller høyere)
- **Azure App Registration** konfigurert
- **Dataverse-miljø** tilgjengelig

## 🔧 Miljøvariabler

### Lokal utvikling

Opprett en `.env.local` fil i prosjektroten:

```bash
# .env.local
REACT_APP_CLIENT_ID=f449a06d-e2c7-4a10-b7ed-f859e622b2d7
REACT_APP_TENANT_ID=fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6
REACT_APP_DATAVERSE_URL=https://org5ce5b264.crm4.dynamics.com
```

### Produksjon

Sett miljøvariabler i din deployment-plattform:

| Variabel | Beskrivelse | Eksempel |
|----------|-------------|----------|
| `REACT_APP_CLIENT_ID` | Azure App ID | `f449a06d-e2c7-4a10-b7ed-f859e622b2d7` |
| `REACT_APP_TENANT_ID` | Azure Tenant ID | `fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6` |
| `REACT_APP_DATAVERSE_URL` | Dataverse URL | `https://org5ce5b264.crm4.dynamics.com` |

## 🌐 GitHub Pages

### Automatisk deployment

1. **Aktiver GitHub Pages** i repository settings
2. **Velg source**: `GitHub Actions`
3. **Push til main branch** trigger automatisk deployment

### Manuell deployment

```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Legg til scripts i package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          REACT_APP_CLIENT_ID: ${{ secrets.REACT_APP_CLIENT_ID }}
          REACT_APP_TENANT_ID: ${{ secrets.REACT_APP_TENANT_ID }}
          REACT_APP_DATAVERSE_URL: ${{ secrets.REACT_APP_DATAVERSE_URL }}
          
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Secrets i GitHub

Gå til **Settings** → **Secrets and variables** → **Actions** og legg til:

- `REACT_APP_CLIENT_ID`
- `REACT_APP_TENANT_ID`
- `REACT_APP_DATAVERSE_URL`

## 🟢 Netlify

### Automatisk deployment

1. **Koble til GitHub** repository
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: `18`

3. **Environment variables**:
   - `REACT_APP_CLIENT_ID`
   - `REACT_APP_TENANT_ID`
   - `REACT_APP_DATAVERSE_URL`

### Netlify.toml konfigurasjon

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  REACT_APP_CLIENT_ID = "f449a06d-e2c7-4a10-b7ed-f859e622b2d7"
  REACT_APP_TENANT_ID = "fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6"
  REACT_APP_DATAVERSE_URL = "https://org5ce5b264.crm4.dynamics.com"
```

### Manuell deployment

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Login til Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

## ⚡ Vercel

### Automatisk deployment

1. **Import project** fra GitHub
2. **Framework Preset**: `Create React App`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Install Command**: `npm install`

### Vercel.json konfigurasjon

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_CLIENT_ID": "f449a06d-e2c7-4a10-b7ed-f859e622b2d7",
    "REACT_APP_TENANT_ID": "fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6",
    "REACT_APP_DATAVERSE_URL": "https://org5ce5b264.crm4.dynamics.com"
  }
}
```

### Manuell deployment

```bash
# Installer Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## ☁️ Azure Static Web Apps

### Automatisk deployment

1. **Opprett Static Web App** i Azure Portal
2. **Koble til GitHub** repository
3. **Konfigurer build settings**:
   - App location: `/`
   - API location: `(empty)`
   - Output location: `build`

### Azure Static Web Apps Workflow

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "build"
          env: |
            REACT_APP_CLIENT_ID=${{ secrets.REACT_APP_CLIENT_ID }}
            REACT_APP_TENANT_ID=${{ secrets.REACT_APP_TENANT_ID }}
            REACT_APP_DATAVERSE_URL=${{ secrets.REACT_APP_DATAVERSE_URL }}

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

## 🐳 Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  diskgolf-pwa:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_CLIENT_ID=f449a06d-e2c7-4a10-b7ed-f859e622b2d7
      - REACT_APP_TENANT_ID=fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6
      - REACT_APP_DATAVERSE_URL=https://org5ce5b264.crm4.dynamics.com
```

### Build og deploy

```bash
# Build Docker image
docker build -t diskgolf-pwa .

# Run container
docker run -p 80:80 diskgolf-pwa

# Eller med Docker Compose
docker-compose up -d
```

## 🔒 HTTPS og sikkerhet

### SSL-sertifikater

De fleste plattformer håndterer SSL automatisk, men for egen hosting:

```bash
# Bruk Let's Encrypt
certbot --nginx -d ditt-domene.com
```

### Security Headers

```nginx
# nginx.conf - Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

## 📊 Monitoring og logging

### Performance monitoring

```typescript
// src/utils/analytics.ts
export const trackEvent = (eventName: string, properties?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

// Bruk i komponenter
trackEvent('course_created', {
  course_name: courseName,
  hole_count: holeCount
});
```

### Error tracking

```typescript
// src/utils/errorTracking.ts
export const logError = (error: Error, context?: any) => {
  console.error('Application Error:', error, context);
  
  // Send til error tracking service
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  }
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions - Full pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage --watchAll=false
      - run: npm run build

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Staging
        run: |
          # Deploy til staging-miljø
          echo "Deploying to staging..."

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Production
        run: |
          # Deploy til produksjon
          echo "Deploying to production..."
```

## 🚨 Feilsøking

### Vanlige deployment-problemer

#### 1. Build feiler

```bash
# Sjekk Node.js versjon
node --version

# Rydd node_modules
rm -rf node_modules package-lock.json
npm install

# Sjekk for TypeScript-feil
npx tsc --noEmit
```

#### 2. Miljøvariabler ikke satt

```bash
# Sjekk at variabler er tilgjengelige
echo $REACT_APP_CLIENT_ID
echo $REACT_APP_TENANT_ID
```

#### 3. CORS-feil

```typescript
// Sjekk redirect URIs i Azure App Registration
// Legg til alle domener som brukes
```

#### 4. Service Worker problemer

```bash
# Rydd cache
# I nettleser: Developer Tools → Application → Storage → Clear storage
```

### Debugging tips

1. **Sjekk build logs** i deployment-plattform
2. **Verifiser miljøvariabler** er satt riktig
3. **Test lokalt** med samme miljøvariabler
4. **Sjekk nettverksforespørsler** i browser DevTools
5. **Verifiser Azure-konfigurasjon** er riktig

## 📈 Performance optimalisering

### Build optimalisering

```bash
# Analyser bundle størrelse
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Caching strategier

```typescript
// Service Worker - Caching
const CACHE_NAME = 'diskgolf-pwa-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];
```

---

**Denne deployment-guiden oppdateres med nye plattformer og best practices.** 🚀
