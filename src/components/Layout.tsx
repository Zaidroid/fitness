import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, Dumbbell, Home, Settings, User, Menu } from 'lucide-react';
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

  // Enable dark mode on load
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-300"> {/* Pure black background */}
      <div className="flex h-screen">
        {/* Mobile Menu Button */}
        <div className="md:hidden p-4 bg-gray-900 shadow flex justify-between items-center">
          <div className="flex items-center">
            <Dumbbell className="w-8 h-8 text-indigo-400" />
            <span className="ml-2 text-xl font-bold text-white">Z Health</span>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64 md:flex md:flex-col bg-gray-900 border-r border-gray-700 transition-transform ease-in-out duration-300`}>
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Dumbbell className="w-8 h-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-white">Z Health</span>
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
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800',
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
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-950 p-6"> {/* Darker content area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
