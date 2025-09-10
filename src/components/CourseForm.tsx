import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    holes: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Her vil vi senere integrere med Dataverse
    console.log('Nye diskgolfbane:', formData);
    
    // For nå, bare naviger tilbake til dashboard
    alert('Diskgolfbane registrert! (Demo-modus)');
    navigate('/');
  };

  return (
    <div className="course-form">
      <h2>Registrer ny Diskgolfbane</h2>
      
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
        
        <button type="submit" className="submit-btn">
          Registrer Diskgolfbane
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
