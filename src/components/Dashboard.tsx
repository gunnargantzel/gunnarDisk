import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useDataverse } from '../hooks/useDataverse';
import { DiskTabRecord } from '../services/dataverseService';

const Dashboard: React.FC = () => {
  const { accounts } = useMsal();
  const { getAllDiskTabs, deleteDiskTab, loading, error, clearError } = useDataverse();
  const [courses, setCourses] = useState<DiskTabRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const user = accounts[0];

  // Hent alle diskgolfbaner ved lasting
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await getAllDiskTabs();
    setCourses(data);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Er du sikker på at du vil slette denne diskgolfbanen?')) {
      const success = await deleteDiskTab(id);
      if (success) {
        await loadCourses(); // Reload data
      }
    }
  };

  const filteredCourses = courses.filter(course =>
    course.cr597_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Velkommen, {user?.name || user?.username}!</p>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={clearError}>Lukk</button>
        </div>
      )}
      
      <div className="course-list">
        <div className="course-list-header">
          <h3>Registrerte Diskgolfbaner</h3>
          <div className="search-box">
            <input
              type="text"
              placeholder="Søk etter diskgolfbane..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <p>Laster diskgolfbaner...</p>
        ) : filteredCourses.length === 0 ? (
          <p>{searchTerm ? 'Ingen resultater funnet.' : 'Ingen diskgolfbaner registrert ennå.'}</p>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.cr597_disktabid} className="course-item">
              <div className="course-info">
                <h4>{course.cr597_id}</h4>
                <p>Antall kurver: {course.cr597_holes}</p>
                {course.cr597_description && <p>Beskrivelse: {course.cr597_description}</p>}
                {course.cr597_location && <p>Lokasjon: {course.cr597_location}</p>}
                {course.createdon && (
                  <p>Registrert: {new Date(course.createdon).toLocaleDateString('no-NO')}</p>
                )}
              </div>
              <div className="course-actions">
                <button 
                  onClick={() => handleDelete(course.cr597_disktabid!)}
                  className="delete-btn"
                >
                  Slett
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Link to="/course/new">
        <button className="add-course-btn">
          Legg til ny diskgolfbane
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;
