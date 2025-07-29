import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Button } from '@mui/material';
import axios from 'axios';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'farmer' | 'admin' | 'expert';
  preferences: Record<string, unknown>;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy user settings state
  const [settings, setSettings] = React.useState({
    theme: 'light',
    notifications: true,
    email: 'user@example.com',
    name: 'John Doe',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox' && 'checked' in e.target) {
      checked = (e.target as HTMLInputElement).checked;
    }
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ...existing code...

  useEffect(() => {
    axios.get('/api/user/profile')
      .then((res: { data: UserProfileData }) => setProfile(res.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="user-profile-container">
        <h2>User Settings & Preferences</h2>
        <form className="user-settings-form">
          <label>
            Name:
            <input name="name" value={settings.name} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input name="email" value={settings.email} onChange={handleChange} />
          </label>
          <label>
            Theme:
            <select name="theme" value={settings.theme} onChange={handleChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label>
            <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange} />
            Enable Notifications
          </label>
          <button type="button" className="user-settings-save-btn">Save Settings</button>
        </form>
      </div>
      <div className="p-8">
        <Typography variant="h4" gutterBottom>Profile</Typography>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {profile && (
          <Card className="max-w-md mx-auto">
            <CardContent>
              <Avatar src={profile?.avatar ?? ''} alt={profile?.name ?? ''} sx={{ width: 80, height: 80, mb: 2 }} />
              <Typography variant="h6">{profile?.name ?? ''}</Typography>
              <Typography variant="body2">{profile?.email ?? ''}</Typography>
              <Typography variant="body2">Role: {profile?.role ?? ''}</Typography>
              {/* Add more profile details and settings here */}
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Edit Profile</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
