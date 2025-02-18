import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Load Supabase client from environment variables
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

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch user profile from Supabase
  async function fetchProfile() {
    setLoading(true);
    
    // ✅ Check if user is authenticated before proceeding
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user || !user.user) {
      toast.error('User not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.user.id)
      .single();

    if (profileError) {
      toast.error('Error loading profile.');
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  // Handle input changes
  function handleChange(event) {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  }

  // Save profile changes
  async function saveProfile() {
    setSaving(true);
    
    // ✅ Check if user is authenticated before saving
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      toast.error('Not authenticated.');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.user.id);

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
              disabled
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
