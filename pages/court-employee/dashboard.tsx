import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
      const res = await fetch('/api/employee/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setStats(data.stats);
      }
    }
    load();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Court Employee — Dashboard</h1>
      {profile && (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Mobile:</strong> {profile.mobile}</p>
        </div>
      )}
      {stats && (
        <div>
          <p><strong>Total Cases:</strong> {stats.totalCases}</p>
          <p><strong>Pending Tasks:</strong> {stats.pendingTasks}</p>
          <p><strong>Unread Notifications:</strong> {stats.unreadNotifications}</p>
        </div>
      )}
    </main>
  );
}
