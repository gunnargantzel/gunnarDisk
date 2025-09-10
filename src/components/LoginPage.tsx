import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

const LoginPage: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error('Login feilet:', e);
    });
  };

  return (
    <div className="login-container">
      <h2>Velkommen til Diskgolf PWA</h2>
      <p>Logg inn med din Microsoft-konto for å fortsette.</p>
      <button className="login-btn" onClick={handleLogin}>
        Logg inn med Microsoft
      </button>
    </div>
  );
};

export default LoginPage;
