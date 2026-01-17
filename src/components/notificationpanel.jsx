import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';

function NotificationPanel({ darkMode, notifications, onClose, onDelete, onMarkAsRead }) {
    const panelRef = useRef(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const formatTime = (timestamp) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
        } catch (error) {
            return 'recently';
        }
    };

    return (
        <div
            ref={panelRef}
            className={`absolute right-0 top-12 w-80 sm:w-96 max-h-96 overflow-y-auto rounded-lg shadow-xl z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
        >
            {/* Header */}
            <div className={`sticky top-0 px-4 py-3 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                    </h3>
                    <button
                        onClick={onClose}
                        className={`p-1 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                            }`}
                    >
                        <IoClose size={20} />
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No notifications yet
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.notificationId}
                            className={`px-4 py-3 transition-colors ${!notification.isRead
                                ? darkMode
                                    ? 'bg-gray-750 hover:bg-gray-700'
                                    : 'bg-blue-50 hover:bg-blue-100'
                                : darkMode
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-50'
                                }`}
                            onClick={() => !notification.isRead && onMarkAsRead(notification.notificationId)}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'
                                        } ${!notification.isRead ? 'font-semibold' : ''}`}>
                                        {notification.message}
                                    </p>
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {formatTime(notification.createdAt)}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(notification.notificationId);
                                    }}
                                    className={`p-1 rounded-lg transition-colors flex-shrink-0 ${darkMode
                                        ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200'
                                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                                        }`}
                                    aria-label="Delete notification"
                                >
                                    <IoClose size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationPanel;
