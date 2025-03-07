import { useState, useEffect } from 'react';

// TODO: Delete once we can get actual posts from the API
const mockPost1: Post = {
  id: '1',
  userId: '1',
  country: 'CA',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec sem nec justo tincidunt fermentum. Nullam nec sem nec justo tincidunt',
  createdAt: new Date(1741365088777),
  updatedAt: new Date(1741365088777),
  username: 'shadcn',
  likes: 19950,
  dislikes: 5949,
};
const mockPost2: Post = {
  id: '2',
  userId: '2',
  country: 'US',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec sem nec justo tincidunt fermentum. Nullam nec sem nec justo tincidunt',
  createdAt: new Date(1741362088777),
  updatedAt: new Date(1741362088777),
  username: 'john_doe',
  likes: 19950,
  dislikes: 5949,
};

export default function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace below useEffect code with API call to get posts
    setTimeout(() => {
      setPosts([mockPost1, mockPost2]);
      setLoading(false);
    }, 2000);
  }, []);

  return { posts, loading, error };
}
