import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [notifications, setNotifications] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  // ✅ Fetch user settings from Supabase
  async function fetchSettings() {
    setLoading(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error('User not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    const user = session.user;
    setUserId(user.id);

    const { data, error } = await supabase
      .from('settings')
      .select('dark_mode, notifications')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setDarkMode(data.dark_mode);
      setNotifications(data.notifications);
      localStorage.setItem('darkMode', data.dark_mode);
      updateDarkModeClass(data.dark_mode);
    }

    setLoading(false);
  }

  // ✅ Update dark mode state & persist in localStorage
  function toggleDarkMode() {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    updateDarkModeClass(newDarkMode);
  }

  function updateDarkModeClass(enable) {
    if (enable) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // ✅ Save settings to Supabase
  async function saveSettings() {
    if (!userId) {
      toast.error('Not authenticated.');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('settings')
      .upsert({
        id: userId,
        dark_mode: darkMode,
        notifications: notifications,
      });

    if (error) {
      toast.error('Failed to save settings.');
    } else {
      toast.success('Settings updated!');
    }

    setSaving(false);
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold">Settings</h2>

      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <div className="space-y-4 mt-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dark Mode
            </span>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-md ${
                darkMode ? 'bg-indigo-600 text-white' : 'bg-gray-300'
              }`}
            >
              {darkMode ? 'On' : 'Off'}
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Notifications
            </span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
