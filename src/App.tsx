import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import CourseForm from './components/CourseForm';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import VersionInfo from './components/VersionInfo';
import './App.css';

// Versjon informasjon (brukes som fallback)
const APP_VERSION = '1.0.0';
const BUILD_DATE = new Date().toLocaleDateString('no-NO');

const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  // Initialiser MSAL ved oppstart
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await instance.initialize();
      } catch (error) {
        console.error('MSAL initialization error:', error);
      }
    };

    initializeMsal();
  }, [instance]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left">
          <h1>Diskgolf PWA</h1>
          <VersionInfo showDetails={false} />
        </div>
        {isAuthenticated && (
          <button
            onClick={() => instance.logoutPopup()}
            className="logout-btn"
          >
            Logg ut
          </button>
        )}
      </header>

      <main className="App-main">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <LoginPage />}
          />
          <Route
            path="/course/new"
            element={isAuthenticated ? <CourseForm /> : <LoginPage />}
          />
        </Routes>
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <VersionInfo showDetails={true} />
        </div>
      </footer>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default App;
