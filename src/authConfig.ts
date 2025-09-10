import { Configuration, PopupRequest } from '@azure/msal-browser';

// MSAL konfigurasjon
export const msalConfig: Configuration = {
  auth: {
    clientId: 'f449a06d-e2c7-4a10-b7ed-f859e622b2d7', // App registrering client ID
    authority: 'https://login.microsoftonline.com/fb7e0b12-d8fc-4f14-bd1a-ad9c8667a7e6',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // Denne konfigurasjonen er valgfri
    storeAuthStateInCookie: false, // Sett til true hvis du har problemer med IE11 eller Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // LogLevel.Error
            console.error(message);
            return;
          case 1: // LogLevel.Warning
            console.warn(message);
            return;
          case 2: // LogLevel.Info
            console.info(message);
            return;
          case 3: // LogLevel.Verbose
            console.debug(message);
            return;
        }
      }
    },
    allowNativeBroker: false // Disable WAM broker
  },
};

// Legg til scopes som appen trenger tilgang til
export const loginRequest: PopupRequest = {
  scopes: [
    'User.Read',
    'openid',
    'profile',
    'offline_access'
  ],
  prompt: 'select_account',
};

// Dataverse-spesifikke scopes
export const dataverseScopes = [
  'https://org5ce5b264.crm4.dynamics.com/.default'
];

// Legg til flere scopes hvis nødvendig for Dataverse
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
