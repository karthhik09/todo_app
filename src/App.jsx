import React, { useState, useEffect } from 'react';
import LoginPage from './pages/loginpage';
import SignupPage from './pages/signuppage';
import DashboardPage from './pages/dashboard';
import SettingsPage from './pages/settings';
import { emailService } from './services/emailservice';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  // Lift sidebarOpen state to App level to persist across page navigation
  // On mobile (< 1024px), start collapsed to show only icons; on desktop, start expanded
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  // Initialize EmailJS on app mount
  useEffect(() => {
    emailService.init();
  }, []);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  // Poll for notifications and send emails
  useEffect(() => {
    if (!currentUser?.userId) return;

    const checkAndSendEmails = async () => {
      try {
        // Get all notifications
        const response = await fetch(`https://todo-backend-1fzd.onrender.com/api/notifications?userId=${currentUser.userId}`);
        const notifications = await response.json();

        // Get list of notifications we've already sent emails for
        const sentEmails = JSON.parse(localStorage.getItem('sentEmailNotifications') || '[]');

        // Find new notifications that need emails
        const newNotifications = notifications.filter(n =>
          !n.isRead && !sentEmails.includes(n.notificationId)
        );

        // Send email for each new notification
        for (const notification of newNotifications) {
          try {
            // Extract task title from notification message
            // Message format: "Reminder: Task 'Title' is due in X minutes" or "Task 'Title' is due now!"
            let taskTitle = '';
            const match = notification.message.match(/Task '([^']+)'/);
            if (match) {
              taskTitle = match[1];
            } else {
              taskTitle = notification.message;
            }

            // Format the due time
            const dueTime = new Date().toLocaleString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }).replace(',', ' at');

            await emailService.sendTaskReminderEmail(
              currentUser.email,
              currentUser.name,
              taskTitle,
              dueTime
            );

            // Mark as sent
            sentEmails.push(notification.notificationId);
            console.log(`Email sent for task: ${taskTitle}`);
          } catch (error) {
            console.error('Failed to send email:', error);
          }
        }

        // Save updated sent list
        localStorage.setItem('sentEmailNotifications', JSON.stringify(sentEmails));
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    // Check immediately and then every 10 seconds
    checkAndSendEmails();
    const interval = setInterval(checkAndSendEmails, 10000);

    return () => clearInterval(interval);
  }, [currentUser]);

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