import React from 'react';
import { Bell, Lock, Eye, Globe, Moon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-900">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 rounded-lg p-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">Manage notification preferences</p>
                </div>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-900">
                Configure
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 rounded-lg p-2">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Privacy</h3>
                  <p className="text-sm text-gray-500">Control your privacy settings</p>
                </div>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-900">
                Manage
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 rounded-lg p-2">
                  <Globe className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Language</h3>
                  <p className="text-sm text-gray-500">Change display language</p>
                </div>
              </div>
              <select className="text-sm text-gray-900 rounded-md border-gray-300">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 rounded-lg p-2">
                  <Moon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Theme</h3>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
              </div>
              <select className="text-sm text-gray-900 rounded-md border-gray-300">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}