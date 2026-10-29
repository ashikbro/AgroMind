import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/notifications')
      .then(res => setNotifications(res.data))
      .catch(() => setError('Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <Typography variant="h4" gutterBottom>Notifications</Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <div className="grid gap-4">
        {notifications.map(note => (
          <div key={note.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color={note.read ? 'textSecondary' : 'primary'}>
                  {note.type.toUpperCase()}
                </Typography>
                <Typography variant="body1">{note.message}</Typography>
                <Typography variant="caption" color="textSecondary">{new Date(note.timestamp).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
