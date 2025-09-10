# Diskgolf PWA

En Progressive Web App for registrering av diskgolfbaner med pålogging mot Entra ID og lagring i Dataverse.

## Funksjoner

- 🔐 Pålogging med Entra ID (Microsoft Azure AD)
- 📱 PWA-støtte for mobil og desktop
- 🏌️ Registrering av diskgolfbaner med navn og antall kurver
- 📊 Dashboard for oversikt over registrerte baner
- 🔄 Responsiv design

## Installasjon

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

## Konfigurasjon

### Entra ID Setup

1. Gå til Azure Portal → App registrations
2. Opprett ny registrering
3. Legg til redirect URI: `http://localhost:3000` (og din produksjons-URL)
4. Kopier Application (client) ID til `src/authConfig.ts`
5. Legg til API permissions hvis nødvendig for Dataverse

### Tenant ID

Prosjektet er konfigurert for tenant ID: `fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6`

## Utvikling

- `npm start` - Start utviklingsserver
- `npm run build` - Bygg for produksjon
- `npm test` - Kjør tester

## Neste steg

- [ ] Integrasjon med Dataverse
- [ ] Lagring av diskgolfbane-data
- [ ] Utvidet funksjonalitet (redigering, sletting)
- [ ] Offline-støtte
- [ ] Push-notifikasjoner
