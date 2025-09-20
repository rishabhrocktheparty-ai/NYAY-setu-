import { useEffect, useState } from 'react';

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
      const res = await fetch('/api/employee/cases', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setCases((await res.json()).cases || []);
    }
    load();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Assigned Cases</h1>
      <ul>
        {cases.map(c => (
          <li key={c.id}><strong>{c.title}</strong> — {c.status}</li>
        ))}
      </ul>
    </main>
  );
}
