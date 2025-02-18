import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null); // Store user ID for queries

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Fetch authenticated user and profile data
  async function fetchProfile() {
    setLoading(true);

    // Get current session
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
    setUserId(user.id); // Store user ID

    // Fetch profile data from Supabase
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    if (profileError) {
      toast.error('Error loading profile.');
    } else {
      setProfile(data);
    }

    setLoading(false);
  }

  // ✅ Handle input changes
  function handleChange(event) {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  }

  // ✅ Save profile changes
  async function saveProfile() {
    if (!userId) {
      toast.error('Not authenticated.');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId);

    if (error) {
      toast.error('Failed to save changes.');
    } else {
      toast.success('Profile updated!');
    }

    setSaving(false);
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            onClick={saveProfile}
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
