import { useState, useEffect } from 'react';

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data: { user: User }) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { user, loading, error };
}
