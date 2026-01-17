import React, { useState, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { notificationAPI } from '../services/notificationapi';
import NotificationPanel from './notificationpanel';

function NotificationBell({ darkMode, currentUser }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Fetch unread count on mount and every 30 seconds
    useEffect(() => {
        if (currentUser?.userId) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    // Fetch notifications when panel is opened
    useEffect(() => {
        if (showPanel && currentUser?.userId) {
            fetchNotifications();
        }
    }, [showPanel, currentUser]);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationAPI.getUnreadCount(currentUser.userId);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const data = await notificationAPI.getNotifications(currentUser.userId);
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await notificationAPI.deleteNotification(notificationId);
            // Remove from local state
            setNotifications(notifications.filter(n => n.notificationId !== notificationId));
            // Update unread count
            fetchUnreadCount();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            // Update local state
            setNotifications(notifications.map(n =>
                n.notificationId === notificationId ? { ...n, isRead: true } : n
            ));
            // Update unread count
            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowPanel(!showPanel)}
                className={`relative p-2 rounded-lg transition-all ${darkMode
                    ? 'hover:bg-gray-700 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                    }`}
                aria-label="Notifications"
            >
                <IoNotificationsOutline className="text-2xl" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showPanel && (
                <NotificationPanel
                    darkMode={darkMode}
                    notifications={notifications}
                    onClose={() => setShowPanel(false)}
                    onDelete={handleDeleteNotification}
                    onMarkAsRead={handleMarkAsRead}
                />
            )}
        </div>
    );
}

export default NotificationBell;
