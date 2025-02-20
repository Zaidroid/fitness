import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark'); // Ensure dark mode is applied
  }, []);

  function toggleDarkMode() {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-950 text-gray-300 rounded-lg shadow-md"> {/* Darker module */}
      <h2 className="text-xl font-semibold text-gray-200">Settings</h2>

      <div className="space-y-4 mt-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-300">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-md ${
              darkMode ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            {darkMode ? 'On' : 'Off'}
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-300">Enable Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}
