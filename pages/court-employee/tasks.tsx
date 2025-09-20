import { useEffect, useState } from 'react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
      const res = await fetch('/api/employee/tasks', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setTasks((await res.json()).tasks || []);
    }
    load();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Tasks</h1>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title} — {t.completed ? 'Done' : 'Open'}</li>
        ))}
      </ul>
    </main>
  );
}
