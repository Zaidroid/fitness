import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Workouts = React.lazy(() => import('./pages/Workouts'));
const Progress = React.lazy(() => import('./pages/Progress'));
const Schedule = React.lazy(() => import('./pages/Schedule'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route 
            index 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </React.Suspense>
            } 
          />
          <Route 
            path="workouts" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Workouts />
              </React.Suspense>
            } 
          />
          <Route 
            path="progress" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Progress />
              </React.Suspense>
            } 
          />
          <Route 
            path="schedule" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Schedule />
              </React.Suspense>
            } 
          />
          <Route 
            path="profile" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Profile />
              </React.Suspense>
            } 
          />
          <Route 
            path="settings" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Settings />
              </React.Suspense>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;