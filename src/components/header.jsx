import React from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';
import NotificationBell from './notificationbell';

function Header({ darkMode, setDarkMode, currentUser }) {
    return (
        <div className="flex items-center justify-end gap-3 sm:gap-4 mb-8">
            <NotificationBell darkMode={darkMode} currentUser={currentUser} />

            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all ${darkMode
                    ? 'hover:bg-gray-700 text-yellow-400'
                    : 'hover:bg-gray-100 text-gray-600'
                    }`}
                aria-label="Toggle theme"
            >
                {darkMode ? (
                    <IoSunny className="text-2xl" />
                ) : (
                    <IoMoon className="text-2xl" />
                )}
            </button>
        </div>
    );
}

export default Header;