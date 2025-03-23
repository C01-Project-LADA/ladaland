import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import '@/envConfig'

const url = process.env.API_URL;

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [postsCount, setPostsCount] = useState<number | null>(null);
  const [totalLikes, setTotalLikes] = useState<number | null>(null);
  const [tripsCount, setTripsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = (): Promise<User> => {
    setLoading(true);
    return fetch(`${url}/me`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(
        (data: {
          user: User;
          postsCount: number;
          totalLikes: number;
          tripsCount: number;
        }) => {
          setUser(data.user);
          setPostsCount(data.postsCount);
          setTotalLikes(data.totalLikes);
          setTripsCount(data.tripsCount);
          setLoading(false);
          return data.user;
        }
      )
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        throw err;
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    postsCount,
    totalLikes,
    tripsCount,
    setUser,
    loading,
    error,
    refresh: fetchUser,
  };
}
