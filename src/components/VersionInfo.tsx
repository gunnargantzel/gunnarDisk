import React, { useState } from 'react';

interface VersionInfoProps {
  showDetails?: boolean;
}

const VersionInfo: React.FC<VersionInfoProps> = ({ showDetails = false }) => {
  const [showFullDetails, setShowFullDetails] = useState(showDetails);

  // Hent build-informasjon fra environment variabler eller package.json
  const getBuildInfo = () => {
    const buildTime = process.env.REACT_APP_BUILD_TIME || new Date().toISOString();
    const buildHash = process.env.REACT_APP_BUILD_HASH || 'local-dev';
    const buildBranch = process.env.REACT_APP_BUILD_BRANCH || 'main';
    const buildNumber = process.env.REACT_APP_BUILD_NUMBER || '1';
    
    return {
      version: '1.0.0',
      buildTime,
      buildHash: buildHash.substring(0, 8), // Kort hash
      buildBranch,
      buildNumber,
      environment: process.env.NODE_ENV || 'development'
    };
  };

  const buildInfo = getBuildInfo();

  const formatBuildTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('no-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  const copyBuildInfo = () => {
    const info = `Diskgolf PWA v${buildInfo.version}
Build: ${buildInfo.buildNumber} (${buildInfo.buildHash})
Branch: ${buildInfo.buildBranch}
Environment: ${buildInfo.environment}
Build Time: ${formatBuildTime(buildInfo.buildTime)}`;
    
    navigator.clipboard.writeText(info).then(() => {
      alert('Build-informasjon kopiert til utklippstavle!');
    }).catch(() => {
      console.log('Kunne ikke kopiere til utklippstavle');
    });
  };

  return (
    <div className="version-info-container">
      <div className="version-basic">
        <span className="version-number">v{buildInfo.version}</span>
        <span className="version-build">#{buildInfo.buildNumber}</span>
        {buildInfo.environment !== 'production' && (
          <span className="version-env">{buildInfo.environment}</span>
        )}
      </div>
      
      {showFullDetails && (
        <div className="version-details">
          <div className="version-detail-item">
            <strong>Build:</strong> {buildInfo.buildNumber} ({buildInfo.buildHash})
          </div>
          <div className="version-detail-item">
            <strong>Branch:</strong> {buildInfo.buildBranch}
          </div>
          <div className="version-detail-item">
            <strong>Environment:</strong> {buildInfo.environment}
          </div>
          <div className="version-detail-item">
            <strong>Build Time:</strong> {formatBuildTime(buildInfo.buildTime)}
          </div>
          <button 
            className="version-copy-btn"
            onClick={copyBuildInfo}
            title="Kopier build-informasjon"
          >
            📋
          </button>
        </div>
      )}
      
      <button 
        className="version-toggle-btn"
        onClick={() => setShowFullDetails(!showFullDetails)}
        title={showFullDetails ? 'Skjul detaljer' : 'Vis detaljer'}
      >
        {showFullDetails ? '▲' : '▼'}
      </button>
    </div>
  );
};

export default VersionInfo;