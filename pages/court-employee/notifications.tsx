import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
      const res = await fetch('/api/employee/notifications', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setNotifs((await res.json()).notifications || []);
    }
    load();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Notifications</h1>
      <ul>
        {notifs.map(n => (
          <li key={n.id}>{n.message} {n.read ? '(read)' : '(unread)'}</li>
        ))}
      </ul>
    </main>
  );
}
