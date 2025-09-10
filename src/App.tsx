import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import CourseForm from './components/CourseForm';
import './App.css';

const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Diskgolf PWA</h1>
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
    </div>
  );
};

export default App;
