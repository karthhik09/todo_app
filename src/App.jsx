import React, { useState, useEffect } from 'react';
import LoginPage from './pages/loginpage';
import SignupPage from './pages/signuppage';
import DashboardPage from './pages/dashboard';
import SettingsPage from './pages/settings';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  // Lift sidebarOpen state to App level to persist across page navigation
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const pageProps = {
    onNavigate: setCurrentPage,
    currentUser,
    setCurrentUser,
    darkMode,
    setDarkMode,
    sidebarOpen,
    setSidebarOpen
  };

  return (
    <>
      {currentPage === 'login' && <LoginPage {...pageProps} />}
      {currentPage === 'signup' && <SignupPage {...pageProps} />}
      {currentPage === 'dashboard' && <DashboardPage {...pageProps} />}
      {currentPage === 'settings' && <SettingsPage {...pageProps} />}
    </>
  );
}

export default App;