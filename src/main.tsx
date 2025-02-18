import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1078875363188-eji1sqmjjuk06i2gh0vcea4du5b26gin.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);