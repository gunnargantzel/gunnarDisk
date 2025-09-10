import { Configuration, PopupRequest } from '@azure/msal-browser';

// MSAL konfigurasjon
export const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_CLIENT_ID', // Dette må endres til din app registrering client ID
    authority: 'https://login.microsoftonline.com/fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // Denne konfigurasjonen er valgfri
    storeAuthStateInCookie: false, // Sett til true hvis du har problemer med IE11 eller Edge
  },
};

// Legg til scopes som appen trenger tilgang til
export const loginRequest: PopupRequest = {
  scopes: ['User.Read'],
  prompt: 'select_account',
};

// Legg til flere scopes hvis nødvendig for Dataverse
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
