import { useState, useEffect } from 'react';
import { User } from '@/types/user';

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = (): Promise<User> => {
    setLoading(true);
    return fetch('http://localhost:4000/api/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data: { user: User }) => {
        setUser(data.user);
        setLoading(false);
        return data.user;
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        throw err;
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, setUser, loading, error, refresh: fetchUser };
}
