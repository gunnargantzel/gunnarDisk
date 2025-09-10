# 🥏 Diskgolf PWA - Disc Golf Course Registration App

En Progressive Web App (PWA) for registrering og administrasjon av disc golf-baner med integrasjon mot Microsoft Entra ID og Dataverse.

## 📋 Innhold

- [Oversikt](#oversikt)
- [Funksjoner](#funksjoner)
- [Teknisk arkitektur](#teknisk-arkitektur)
- [Installasjon og oppsett](#installasjon-og-oppsett)
- [Azure-konfigurasjon](#azure-konfigurasjon)
- [Dataverse-integrasjon](#dataverse-integrasjon)
- [Utvikling](#utvikling)
- [Deployment](#deployment)
- [Feilsøking](#feilsøking)
- [API-referanse](#api-referanse)
- [Bidrag](#bidrag)

## 🎯 Oversikt

Diskgolf PWA er en mobilvennlig webapplikasjon som lar brukere:
- Registrere nye disc golf-baner
- Se oversikt over alle registrerte baner
- Søke og filtrere baner
- Administrere baner med CRUD-operasjoner
- Autentisere seg via Microsoft Entra ID
- Lagre data i Microsoft Dataverse

## ✨ Funksjoner

### 🔐 Autentisering
- **Microsoft Entra ID** integrasjon
- **Single Sign-On (SSO)** støtte
- **Automatisk token-oppdatering**
- **Sikker utlogging**

### 📱 PWA-funksjoner
- **Offline-støtte** via Service Worker
- **Installerbar** på mobile enheter
- **Responsivt design** for alle skjermstørrelser
- **App-like opplevelse**

### 🏌️ Disc Golf-funksjoner
- **Registrering av baner** med:
  - Banenavn (`cr597_banenavn`)
  - Antall kurver (`cr597_antallkurver`)
  - Beskrivelse (`cr597_beskrivelse`)
  - Lokasjon (`cr597_lokasjon`)
- **Søk og filtrering**
- **CRUD-operasjoner** (Create, Read, Update, Delete)
- **Versjonsinformasjon** i header og footer

## 🏗️ Teknisk arkitektur

### Frontend
- **React 18** med TypeScript
- **React Router** for navigasjon
- **MSAL (Microsoft Authentication Library)** for autentisering
- **PWA** med Service Worker
- **Responsive CSS** med mobile-first design

### Backend/Integrasjon
- **Microsoft Entra ID** for autentisering
- **Microsoft Dataverse** for datalagring
- **REST API** for CRUD-operasjoner
- **OAuth 2.0** med PKCE for sikkerhet

### Byggeverktøy
- **Create React App** som base
- **TypeScript** for type-sikkerhet
- **ESLint** for kodekvalitet
- **GitHub Actions** for CI/CD

## 🚀 Installasjon og oppsett

### Forutsetninger
- **Node.js** (versjon 16 eller høyere)
- **npm** eller **yarn**
- **Git**
- **Microsoft Azure-konto** med Entra ID
- **Dataverse-miljø**

### Lokal utvikling

1. **Klon repositoriet:**
```bash
git clone https://github.com/ditt-brukernavn/diskgolf-pwa.git
cd diskgolf-pwa
```

2. **Installer avhengigheter:**
```bash
npm install
```

3. **Start utviklingsserver:**
```bash
npm start
```

4. **Åpne i nettleser:**
```
http://localhost:3000
```

### Bygge for produksjon

```bash
npm run build
```

## 🔧 Azure-konfigurasjon

### 1. App-registrering i Entra ID

1. Gå til [Azure Portal](https://portal.azure.com)
2. Naviger til **Entra ID** > **App registrations**
3. Klikk **New registration**
4. Fyll ut:
   - **Name**: `Diskgolf PWA`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `Single-page application (SPA)` → `http://localhost:3000`

5. **Noter ned:**
   - **Application (client) ID**
   - **Directory (tenant) ID**

### 2. API-tillatelser

1. Gå til **API permissions**
2. Legg til:
   - **Microsoft Graph** → `User.Read`
   - **Dataverse** → `https://org5ce5b264.crm4.dynamics.com/.default`

3. **Grant admin consent** for alle tillatelser

### 3. Autentisering

1. Gå til **Authentication**
2. Legg til **Redirect URIs**:
   - `http://localhost:3000` (utvikling)
   - `https://ditt-domene.com` (produksjon)
3. Aktiver **Implicit grant and hybrid flows**:
   - ✅ **Access tokens**
   - ✅ **ID tokens**

## 🗄️ Dataverse-integrasjon

### Tabellstruktur

Applikasjonen bruker `cr597_DiskTab` tabellen med følgende felt:

| Felt | Type | Beskrivelse |
|------|------|-------------|
| `cr597_disktabid` | GUID | Primærnøkkel |
| `cr597_banenavn` | Text | Banenavn |
| `cr597_antallkurver` | Number | Antall kurver |
| `cr597_beskrivelse` | Text | Beskrivelse av banen |
| `cr597_lokasjon` | Text | Lokasjon |
| `createdon` | DateTime | Opprettelsesdato |

### API-endepunkter

- **GET** `/api/data/v9.2/cr597_disktabs` - Hent alle baner
- **POST** `/api/data/v9.2/cr597_disktabs` - Opprett ny bane
- **GET** `/api/data/v9.2/cr597_disktabs({id})` - Hent spesifikk bane
- **PATCH** `/api/data/v9.2/cr597_disktabs({id})` - Oppdater bane
- **DELETE** `/api/data/v9.2/cr597_disktabs({id})` - Slett bane

## 💻 Utvikling

### Prosjektstruktur

```
src/
├── components/          # React-komponenter
│   ├── LoginPage.tsx   # Påloggingsside
│   ├── Dashboard.tsx   # Hovedside med baneliste
│   └── CourseForm.tsx  # Skjema for ny bane
├── services/           # API-tjenester
│   ├── dataverseService.ts
│   └── metadataService.ts
├── hooks/              # Custom React hooks
│   └── useDataverse.ts
├── config/             # Konfigurasjonsfiler
│   └── dataverseConfig.ts
├── authConfig.ts       # MSAL-konfigurasjon
├── App.tsx            # Hovedkomponent
└── index.tsx          # Applikasjonsentry
```

### Utviklingskommandoer

```bash
# Start utviklingsserver
npm start

# Bygge for produksjon
npm run build

# Kjøre tester
npm test

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Kodekvalitet

- **TypeScript** for type-sikkerhet
- **ESLint** for kodekvalitet
- **Prettier** for kodeformatering
- **Husky** for pre-commit hooks

## 🚀 Deployment

### GitHub Pages

1. **Aktiver GitHub Pages** i repository settings
2. **Push til main branch** trigger automatisk deployment
3. **Appen er tilgjengelig** på `https://ditt-brukernavn.github.io/diskgolf-pwa`

### Netlify

1. **Koble til GitHub** repository
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Environment variables**:
   - `REACT_APP_CLIENT_ID`: Din Azure App ID
   - `REACT_APP_TENANT_ID`: Din Azure Tenant ID

### Vercel

1. **Import project** fra GitHub
2. **Build settings**:
   - Framework: `Create React App`
   - Build command: `npm run build`
   - Output directory: `build`

## 🔍 Feilsøking

### Vanlige problemer

#### 1. MSAL `interaction_in_progress` feil
```typescript
// Løsning: Legg til timeout og state management
if (error.errorCode === 'interaction_in_progress') {
  setTimeout(() => {
    setIsLoggingIn(false);
  }, 1000);
}
```

#### 2. Scope-feil (AADSTS70011)
```typescript
// Løsning: Separer Graph og Dataverse scopes
export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'offline_access']
};

export const dataverseScopes = [
  'https://org5ce5b264.crm4.dynamics.com/.default'
];
```

#### 3. Dataverse API-feil
- Sjekk at **API-tillatelser** er riktig konfigurert
- Verifiser at **tabellnavn** og **feltnavn** stemmer
- Kontroller **tenant ID** og **client ID**

### Debugging

1. **Aktiver MSAL logging:**
```typescript
system: {
  loggerOptions: {
    loggerCallback: (level, message, containsPii) => {
      console.log(message);
    }
  }
}
```

2. **Sjekk nettverksforespørsler** i Developer Tools
3. **Verifiser tokens** i Application tab
4. **Test API-endepunkter** direkte

## 📚 API-referanse

### DataverseService

```typescript
class DataverseService {
  // Hent alle baner
  async getAllDiskTabs(): Promise<DiskTabRecord[]>
  
  // Hent spesifikk bane
  async getDiskTabById(id: string): Promise<DiskTabRecord>
  
  // Opprett ny bane
  async createDiskTab(data: CreateDiskTabRequest): Promise<DiskTabRecord>
  
  // Oppdater bane
  async updateDiskTab(id: string, data: UpdateDiskTabRequest): Promise<DiskTabRecord>
  
  // Slett bane
  async deleteDiskTab(id: string): Promise<void>
}
```

### useDataverse Hook

```typescript
const {
  loading,
  error,
  clearError,
  getAllDiskTabs,
  createDiskTab,
  updateDiskTab,
  deleteDiskTab
} = useDataverse();
```

## 🤝 Bidrag

1. **Fork** repositoriet
2. **Opprett feature branch**: `git checkout -b feature/ny-funksjon`
3. **Commit endringer**: `git commit -m 'Legg til ny funksjon'`
4. **Push til branch**: `git push origin feature/ny-funksjon`
5. **Opprett Pull Request**

### Bidragskrav

- Følg eksisterende kodekonvensjoner
- Skriv tester for nye funksjoner
- Oppdater dokumentasjon
- Sjekk at alle tester passerer

## 📄 Lisens

Dette prosjektet er lisensiert under MIT-lisensen. Se [LICENSE](LICENSE) filen for detaljer.

## 📞 Support

For spørsmål eller problemer:

- **GitHub Issues**: [Opprett issue](https://github.com/ditt-brukernavn/diskgolf-pwa/issues)
- **Email**: din-email@example.com
- **Discord**: [Join vår server](https://discord.gg/ditt-server)

---

**Utviklet med ❤️ for disc golf-samfunnet** 🥏