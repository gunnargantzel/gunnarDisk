# Diskgolf PWA

En Progressive Web App for registrering av diskgolfbaner med pålogging mot Entra ID og lagring i Dataverse.

## 🚀 Live Demo

- **GitHub Pages**: [https://gunnargantzel.github.io/gunnarDisk](https://gunnargantzel.github.io/gunnarDisk)
- **Netlify**: [https://diskgolf-pwa.netlify.app](https://diskgolf-pwa.netlify.app)

## ✨ Funksjoner

- 🔐 Pålogging med Entra ID (Microsoft Azure AD)
- 📱 PWA-støtte for mobil og desktop
- 🏌️ Registrering av diskgolfbaner med navn og antall kurver
- 📊 Dashboard for oversikt over registrerte baner
- 🔄 Responsiv design
- 🚀 Automatisk deployment

## 🛠️ Installasjon

1. Installer avhengigheter:
```bash
npm install
```

2. Konfigurer Entra ID:
   - Opprett en app registrering i Azure Portal
   - Oppdater `clientId` i `src/authConfig.ts`
   - Legg til redirect URI: `http://localhost:3000`

3. Start utviklingsserveren:
```bash
npm start
```

## 🚀 Deployment

Prosjektet er konfigurert for automatisk deployment til:

- **GitHub Pages** - Automatisk ved push til main branch
- **Netlify** - Automatisk ved push til main branch
- **Vercel** - Automatisk ved push til main branch

### GitHub Pages
```bash
npm run deploy
```

### Netlify
Prosjektet er konfigurert med `netlify.toml` for automatisk deployment.

### Vercel
Prosjektet er konfigurert med `vercel.json` for automatisk deployment.

## ⚙️ Konfigurasjon

### Entra ID Setup

1. Gå til Azure Portal → App registrations
2. Opprett ny registrering
3. Legg til redirect URI: `http://localhost:3000` (og din produksjons-URL)
4. Kopier Application (client) ID til `src/authConfig.ts`
5. Legg til API permissions hvis nødvendig for Dataverse

### Tenant ID

Prosjektet er konfigurert for tenant ID: `fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6`

## 🔧 Utvikling

- `npm start` - Start utviklingsserver
- `npm run build` - Bygg for produksjon
- `npm test` - Kjør tester
- `npm run deploy` - Deploy til GitHub Pages

## 📱 PWA-funksjoner

- **Installable** - Kan installeres som app på mobil og desktop
- **Offline-støtte** - Service worker for caching
- **Responsiv** - Fungerer på alle skjermstørrelser
- **Fast loading** - Optimalisert for rask lasting

## 🔮 Neste steg

- [ ] Integrasjon med Dataverse
- [ ] Lagring av diskgolfbane-data
- [ ] Utvidet funksjonalitet (redigering, sletting)
- [ ] Push-notifikasjoner
- [ ] Kart-integrasjon for lokasjon

## 📄 Lisens

MIT License