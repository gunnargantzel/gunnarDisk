# 🔧 Teknisk dokumentasjon - Diskgolf PWA

Denne dokumentasjonen dekker tekniske detaljer for utviklere som jobber med Diskgolf PWA.

## 📁 Prosjektstruktur

```
diskgolf-pwa/
├── public/                 # Statiske filer
│   ├── index.html         # HTML template
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service Worker
├── src/                   # Kildekode
│   ├── components/        # React-komponenter
│   │   ├── LoginPage.tsx
│   │   ├── Dashboard.tsx
│   │   └── CourseForm.tsx
│   ├── services/          # API-tjenester
│   │   ├── dataverseService.ts
│   │   └── metadataService.ts
│   ├── hooks/             # Custom hooks
│   │   └── useDataverse.ts
│   ├── config/            # Konfigurasjon
│   │   └── dataverseConfig.ts
│   ├── authConfig.ts      # MSAL-konfigurasjon
│   ├── App.tsx           # Hovedkomponent
│   ├── App.css           # Hovedstiler
│   └── index.tsx         # Applikasjonsentry
├── docs/                  # Dokumentasjon
│   └── TECHNICAL.md
├── .github/               # GitHub Actions
│   └── workflows/
│       └── deploy.yml
├── package.json          # NPM-avhengigheter
├── tsconfig.json         # TypeScript-konfigurasjon
├── netlify.toml          # Netlify-konfigurasjon
├── vercel.json           # Vercel-konfigurasjon
└── README.md             # Hoveddokumentasjon
```

## 🏗️ Arkitektur

### Komponenthierarki

```
App
├── LoginPage (hvis ikke autentisert)
└── Dashboard (hvis autentisert)
    ├── CourseForm (ny bane)
    └── CourseList (baneliste)
```

### Dataflyt

```
User Action → Component → Hook → Service → Dataverse API
                ↓
            State Update → UI Re-render
```

## 🔐 Autentisering

### MSAL-konfigurasjon

```typescript
// authConfig.ts
export const msalConfig: Configuration = {
  auth: {
    clientId: 'f449a06d-e2c7-4a10-b7ed-f859e622b2d7',
    authority: 'https://login.microsoftonline.com/fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: { /* ... */ },
    allowNativeBroker: false
  },
};
```

### Token-håndtering

1. **Silent Token Acquisition**: Prøver å hente token i bakgrunnen
2. **Popup Token Acquisition**: Fallback hvis silent feiler
3. **Token Refresh**: Automatisk fornyelse av utløpte tokens

### Scope-separasjon

```typescript
// Microsoft Graph scopes
export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'offline_access']
};

// Dataverse scopes
export const dataverseScopes = [
  'https://org5ce5b264.crm4.dynamics.com/.default'
];
```

## 🗄️ Dataverse-integrasjon

### Service-arkitektur

```typescript
class DataverseService {
  private msalInstance: IPublicClientApplication;
  
  constructor(msalInstance: IPublicClientApplication) {
    this.msalInstance = msalInstance;
  }
  
  private async getAccessToken(): Promise<string>
  private async makeRequest(url: string, options: RequestInit): Promise<any>
  
  // Public CRUD methods
  async getAllDiskTabs(): Promise<DiskTabRecord[]>
  async createDiskTab(data: CreateDiskTabRequest): Promise<DiskTabRecord>
  async updateDiskTab(id: string, data: UpdateDiskTabRequest): Promise<DiskTabRecord>
  async deleteDiskTab(id: string): Promise<void>
}
```

### Data-modeller

```typescript
export interface DiskTabRecord {
  cr597_disktabid?: string;
  cr597_banenavn: string;
  cr597_antallkurver: number;
  cr597_beskrivelse?: string;
  cr597_lokasjon?: string;
  createdon?: string;
}

export interface CreateDiskTabRequest {
  cr597_banenavn: string;
  cr597_antallkurver: number;
  cr597_beskrivelse?: string;
  cr597_lokasjon?: string;
}
```

### API-endepunkter

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/data/v9.2/cr597_disktabs` | Hent alle baner |
| POST | `/api/data/v9.2/cr597_disktabs` | Opprett ny bane |
| GET | `/api/data/v9.2/cr597_disktabs({id})` | Hent spesifikk bane |
| PATCH | `/api/data/v9.2/cr597_disktabs({id})` | Oppdater bane |
| DELETE | `/api/data/v9.2/cr597_disktabs({id})` | Slett bane |

## 🎣 Custom Hooks

### useDataverse Hook

```typescript
export const useDataverse = () => {
  const { instance } = useMsal();
  const [service] = useState(() => new DataverseService(instance));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const clearError = useCallback(() => setError(null), []);
  
  const getAllDiskTabs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await service.getAllDiskTabs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ukjent feil');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);
  
  // ... andre CRUD-metoder
  
  return {
    loading,
    error,
    clearError,
    getAllDiskTabs,
    createDiskTab,
    updateDiskTab,
    deleteDiskTab
  };
};
```

## 🎨 Styling og PWA

### CSS-arkitektur

```css
/* App.css - Mobile-first responsive design */
.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.App-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Responsive breakpoints */
@media (min-width: 768px) {
  .App-header {
    padding: 1.5rem 2rem;
  }
}
```

### PWA-konfigurasjon

```json
// public/manifest.json
{
  "short_name": "Diskgolf PWA",
  "name": "Diskgolf Course Registration App",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#ffffff"
}
```

### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'diskgolf-pwa-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 🚀 Deployment

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Environment Variables

| Variabel | Beskrivelse | Eksempel |
|----------|-------------|----------|
| `REACT_APP_CLIENT_ID` | Azure App ID | `f449a06d-e2c7-4a10-b7ed-f859e622b2d7` |
| `REACT_APP_TENANT_ID` | Azure Tenant ID | `fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6` |
| `REACT_APP_DATAVERSE_URL` | Dataverse URL | `https://org5ce5b264.crm4.dynamics.com` |

## 🧪 Testing

### Test-struktur

```
src/
├── __tests__/
│   ├── components/
│   │   ├── LoginPage.test.tsx
│   │   ├── Dashboard.test.tsx
│   │   └── CourseForm.test.tsx
│   ├── services/
│   │   └── dataverseService.test.ts
│   └── hooks/
│       └── useDataverse.test.ts
```

### Test-kommandoer

```bash
# Kjøre alle tester
npm test

# Kjøre tester i watch mode
npm test -- --watch

# Kjøre tester med coverage
npm test -- --coverage

# Kjøre spesifikke tester
npm test -- --testNamePattern="LoginPage"
```

## 🔍 Debugging

### MSAL Debugging

```typescript
// Aktiver detaljert logging
system: {
  loggerOptions: {
    loggerCallback: (level, message, containsPii) => {
      if (containsPii) return;
      console.log(`[MSAL ${level}] ${message}`);
    },
    piiLoggingEnabled: false,
    logLevel: LogLevel.Verbose
  }
}
```

### Dataverse API Debugging

```typescript
// Legg til request/response logging
private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
  console.log('Making request to:', url);
  console.log('Request options:', options);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  
  return response;
}
```

## 📊 Performance

### Optimiseringer

1. **Code Splitting**: Lazy loading av komponenter
2. **Memoization**: `useCallback` og `useMemo` for dyre operasjoner
3. **Bundle Analysis**: `npm run build` → `npm install -g serve` → `serve -s build`
4. **Service Worker**: Caching av statiske ressurser

### Monitoring

```typescript
// Performance monitoring
const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};
```

## 🔒 Sikkerhet

### Best Practices

1. **Token Storage**: Bruk `sessionStorage` for kortere levetid
2. **HTTPS**: Alltid bruk HTTPS i produksjon
3. **CORS**: Konfigurer riktige CORS-headers
4. **Input Validation**: Valider all brukerinput
5. **Error Handling**: Ikke eksponer sensitive feilmeldinger

### Security Headers

```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

## 📈 Skalering

### Fremtidige forbedringer

1. **State Management**: Redux eller Zustand for kompleks state
2. **Caching**: React Query for API-caching
3. **Offline Support**: IndexedDB for offline-datalagring
4. **Real-time Updates**: WebSocket eller SignalR
5. **Microservices**: Separer frontend og backend

### Database-optimalisering

```typescript
// Paginering for store datasett
interface PaginatedResponse<T> {
  value: T[];
  '@odata.nextLink'?: string;
  '@odata.count'?: number;
}

// Søkeoptimalisering
const searchCourses = async (query: string, page: number = 1) => {
  const url = `${API_ENDPOINTS.base}/cr597_disktabs?$filter=contains(cr597_banenavn,'${query}')&$top=20&$skip=${(page - 1) * 20}`;
  return await makeRequest(url);
};
```

---

**Denne dokumentasjonen oppdateres kontinuerlig med nye funksjoner og forbedringer.** 🔄
