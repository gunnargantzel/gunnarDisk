import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import MetadataService from '../services/metadataService';

const MetadataDebugger: React.FC = () => {
  const { instance } = useMsal();
  const [metadataService] = useState(() => new MetadataService(instance));
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fields = await metadataService.getAvailableFields();
      setAvailableFields(fields);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '20px', 
      margin: '20px 0', 
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h3>Dataverse Metadata Debugger</h3>
      
      {loading && <p>Laster metadata...</p>}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <strong>Feil:</strong> {error}
        </div>
      )}
      
      {availableFields.length > 0 && (
        <div>
          <h4>Tilgjengelige felter i cr597_disktabs tabellen:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {availableFields.map((field, index) => (
              <li key={index} style={{ 
                background: 'white', 
                margin: '5px 0', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <code>{field}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button onClick={loadMetadata} disabled={loading}>
        {loading ? 'Laster...' : 'Last metadata på nytt'}
      </button>
    </div>
  );
};

export default MetadataDebugger;
