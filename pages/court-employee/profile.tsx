import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
      const res = await fetch('/api/employee/profile', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setProfile((await res.json()).profile);
    }
    load();
  }, []);

  if (!profile) return <main style={{ padding: 20 }}>Loading…</main>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Mobile:</strong> {profile.mobile}</p>
    </main>
  );
}
