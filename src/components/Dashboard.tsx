import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

interface Course {
  id: string;
  name: string;
  holes: number;
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  const { accounts } = useMsal();
  const [courses, setCourses] = useState<Course[]>([
    // Eksempeldata for demonstrasjon
    {
      id: '1',
      name: 'Oslo Diskgolfpark',
      holes: 18,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2', 
      name: 'Bergen Fjellbane',
      holes: 9,
      createdAt: new Date('2024-01-20')
    }
  ]);

  const user = accounts[0];

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Velkommen, {user?.name || user?.username}!</p>
      
      <div className="course-list">
        <h3>Registrerte Diskgolfbaner</h3>
        {courses.length === 0 ? (
          <p>Ingen diskgolfbaner registrert ennå.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-item">
              <h4>{course.name}</h4>
              <p>Antall kurver: {course.holes}</p>
              <p>Registrert: {course.createdAt.toLocaleDateString('no-NO')}</p>
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
