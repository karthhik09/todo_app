/**
 * Main Application Component
 * Handles routing, authentication, and settings (theme, sidebar)
 */

import React, { useState, useEffect } from 'react';
import LoginPage from './pages/loginpage';
import SignupPage from './pages/signuppage';
import DashboardPage from './pages/dashboard';
import SettingsPage from './pages/settings';
import { emailService } from './services/emailservice';

function App() {
  //State Management
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  //Initialize email service
  useEffect(() => {
    emailService.init();
  }, []);

  //Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  //Save theme preference when changed
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  //Session Management, restore user session if exists
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  //Page Props
  const pageProps = {
    onNavigate: setCurrentPage,
    currentUser,
    setCurrentUser,
    darkMode,
    setDarkMode,
    sidebarOpen,
    setSidebarOpen
  };

  //Pages to display
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