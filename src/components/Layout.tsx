import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Dumbbell, 
  Home,
  LogOut, 
  Settings, 
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Progress', href: '/progress', icon: BarChart3 },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen flex-col md:flex-row">
        {/* Mobile Menu Button */}
        <div className="md:hidden p-4 bg-white shadow flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 mr-4">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center">
            <Dumbbell className="w-8 h-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold">Z Health</span>
          </div>
        </div>

        {/* Sidebar for Desktop & Mobile */}
        <div className={`fixed inset-y-0 left-0 w-64 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex md:flex-col bg-white border-r transition-transform ease-in-out duration-300 z-50`}>
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Dumbbell className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">Z Health</span>
            </div>
            <nav className="mt-5 flex-grow flex flex-col px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      item.href === location.pathname
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                    onClick={() => setMenuOpen(false)} // Close menu on selection
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="px-2 pb-4">
              <button className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden relative z-0">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
                {/* Last Sync Section */}
                <div className="mt-4 text-gray-500 text-sm text-center">Last Sync: Just now</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
