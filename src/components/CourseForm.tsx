import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataverse } from '../hooks/useDataverse';

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { createDiskTab, loading, error, clearError } = useDataverse();
  const [formData, setFormData] = useState({
    name: '',
    holes: '',
    description: '',
    location: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validering
    if (!formData.name.trim()) {
      alert('Vennligst oppgi banenavn');
      return;
    }
    
    if (!formData.holes || parseInt(formData.holes) < 1) {
      alert('Vennligst oppgi et gyldig antall kurver');
      return;
    }

    // Opprett diskgolfbane i Dataverse
    const result = await createDiskTab({
      cr597_id: formData.name.trim(),
      cr597_holes: parseInt(formData.holes),
      cr597_description: formData.description.trim() || undefined,
      cr597_location: formData.location.trim() || undefined
    });
    
    if (result) {
      alert('Diskgolfbane registrert!');
      navigate('/');
    } else {
      alert('Feil ved registrering av diskgolfbane. Prøv igjen.');
    }
  };

  return (
    <div className="course-form">
      <h2>Registrer ny Diskgolfbane</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={clearError}>Lukk</button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Banenavn *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="F.eks. Oslo Diskgolfpark"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="holes">Antall kurver *</label>
          <input
            type="number"
            id="holes"
            name="holes"
            value={formData.holes}
            onChange={handleInputChange}
            placeholder="F.eks. 18"
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Beskrivelse (valgfri)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Kort beskrivelse av banen"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Lokasjon (valgfri)</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="F.eks. Oslo, Norge"
          />
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Registrerer...' : 'Registrer Diskgolfbane'}
        </button>
      </form>
      
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          marginTop: '10px', 
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Avbryt
      </button>
    </div>
  );
};

export default CourseForm;
