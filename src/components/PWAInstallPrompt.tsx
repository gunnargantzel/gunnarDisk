import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Sjekk om appen allerede er installert
    const checkIfInstalled = () => {
      // Sjekk om appen kjører i standalone mode (installert)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      // Sjekk om det er iOS og om appen er lagt til hjemmeskjerm
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    // Lyt etter beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Lyt etter appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installasjon akseptert');
      } else {
        console.log('PWA installasjon avvist');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Feil under PWA-installasjon:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Ikke vis prompt igjen i denne sessionen
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Ikke vis hvis appen allerede er installert eller prompt er avvist
  if (isInstalled || !showInstallPrompt || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">
          📱
        </div>
        <div className="pwa-install-text">
          <h3>Installer Diskgolf PWA</h3>
          <p>Legg til appen på hjemmeskjermen for rask tilgang og offline-funksjonalitet!</p>
        </div>
        <div className="pwa-install-buttons">
          <button 
            className="pwa-install-btn primary"
            onClick={handleInstallClick}
          >
            Installer
          </button>
          <button 
            className="pwa-install-btn secondary"
            onClick={handleDismiss}
          >
            Ikke nå
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
