import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
];

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

if (!CLIENT_ID) {
  console.error("Google OAuth client_id is missing. Make sure VITE_GOOGLE_CLIENT_ID is set in your environment variables.");
}

interface Props {
  onSuccess: (token: string) => void;
}

export function GoogleFitButton({ onSuccess }: Props) {
  useEffect(() => {
    const storedToken = localStorage.getItem("google_fit_token");
    if (storedToken) {
      onSuccess(storedToken);
    }
  }, [onSuccess]);

  const login = useGoogleLogin({
    clientId: CLIENT_ID,
    onSuccess: (response) => {
      localStorage.setItem("google_fit_token", response.access_token);
      onSuccess(response.access_token);
    },
    onError: () => {
      toast.error('Failed to connect to Google Fit');
    },
    scope: GOOGLE_FIT_SCOPES.join(' '),
    redirect_uri: REDIRECT_URI,
  });

  return (
    <button
      onClick={() => login()}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Activity className="h-5 w-5 mr-2" />
      Connect Google Fit
    </button>
  );
}
