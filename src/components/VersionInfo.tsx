import React from 'react';

interface VersionInfoProps {
  showDate?: boolean;
  className?: string;
}

const VersionInfo: React.FC<VersionInfoProps> = ({ showDate = true, className = '' }) => {
  const APP_VERSION = '1.0.0';
  const BUILD_DATE = new Date().toLocaleDateString('no-NO');

  return (
    <div className={`version-info ${className}`}>
      <span>v{APP_VERSION}</span>
      {showDate && <span> • {BUILD_DATE}</span>}
    </div>
  );
};

export default VersionInfo;
