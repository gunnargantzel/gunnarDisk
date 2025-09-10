import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, loginRedirectRequest, dataverseScopes } from '../authConfig';

const LoginPage: React.FC = () => {
  const { instance } = useMsal();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return; // Forhindre multiple klikk

    setIsLoggingIn(true);

    try {
      // Sjekk om det allerede er en pågående interaksjon
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        // Bruker er allerede logget inn
        setIsLoggingIn(false);
        return;
      }

      // Prøv silent login først for både Graph og Dataverse
      try {
        // Først Graph scopes
        await instance.acquireTokenSilent({
          scopes: loginRequest.scopes,
          account: accounts[0]
        });
        
        // Deretter Dataverse scopes
        await instance.acquireTokenSilent({
          scopes: dataverseScopes,
          account: accounts[0]
        });
      } catch (silentError) {
        // Hvis silent login feiler, prøv popup login først
        try {
          await instance.loginPopup(loginRequest);
          
          // Etter popup login, hent Dataverse token
          await instance.acquireTokenPopup({
            scopes: dataverseScopes,
            prompt: 'select_account'
          });
        } catch (popupError: any) {
          // Hvis popup feiler (blokkert), bruk redirect
          if (popupError.errorCode === 'popup_window_error' || 
              popupError.errorCode === 'empty_window_error') {
            console.log('Popup blokkert, bruker redirect...');
            await instance.loginRedirect(loginRedirectRequest);
          } else {
            throw popupError;
          }
        }
      }
    } catch (error: any) {
      console.error('Login feilet:', error);

      // Hvis det er en interaction_in_progress feil, prøv å vente litt
      if (error.errorCode === 'interaction_in_progress') {
        setTimeout(() => {
          setIsLoggingIn(false);
        }, 1000);
      } else {
        setIsLoggingIn(false);
      }
    }
  };

  const handleRedirectLogin = async () => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    try {
      await instance.loginRedirect(loginRedirectRequest);
    } catch (error: any) {
      console.error('Redirect login feilet:', error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Velkommen til Diskgolf PWA</h2>
      <p>Logg inn med din Microsoft-konto for å fortsette.</p>
      
      <div className="login-buttons">
        <button
          className="login-btn primary"
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Logger inn...' : 'Logg inn med Microsoft'}
        </button>
        
        <button
          className="login-btn secondary"
          onClick={handleRedirectLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Logger inn...' : 'Logg inn (Redirect)'}
        </button>
      </div>
      
      <div className="login-help">
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Hvis popup-vinduer er blokkert, bruk "Logg inn (Redirect)"</li>
          <li>Tillat popup-vinduer for denne siden for best opplevelse</li>
          <li>Redirect-metoden vil ta deg til Microsoft og tilbake</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;
