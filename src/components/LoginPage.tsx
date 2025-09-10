import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, dataverseScopes } from '../authConfig';

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
        // Hvis silent login feiler, prøv popup login
        await instance.loginPopup(loginRequest);
        
        // Etter popup login, hent Dataverse token
        await instance.acquireTokenPopup({
          scopes: dataverseScopes,
          prompt: 'select_account'
        });
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

  return (
    <div className="login-container">
      <h2>Velkommen til Diskgolf PWA</h2>
      <p>Logg inn med din Microsoft-konto for å fortsette.</p>
      <button 
        className="login-btn" 
        onClick={handleLogin}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Logger inn...' : 'Logg inn med Microsoft'}
      </button>
    </div>
  );
};

export default LoginPage;
