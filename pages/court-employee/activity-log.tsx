import { useEffect, useState } from 'react';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
      const res = await fetch('/api/employee/activity-log', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setLogs((await res.json()).logs || []);
    }
    load();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Activity Log</h1>
      <ul>
        {logs.map(l => (
          <li key={l.id}>{new Date(l.createdAt).toLocaleString()} — {l.action}</li>
        ))}
      </ul>
    </main>
  );
}
