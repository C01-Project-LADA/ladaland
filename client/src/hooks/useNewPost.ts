import { useState } from 'react';
import axios from 'axios';
import '@/envConfig.ts'

const url = process.env.API_URL;

export default function useNewPost() {
  /**
   * Location/pin of post (CURRENTLY ONLY COUNTRY)
   */
  const [location, setLocation] = useState<Country | null>(null);
  /**
   * Content of the new post
   */
  const [content, setContent] = useState<string>('');
  /**
   * Whether the post is currently being processed & submitted
   */
  const [posting, setPosting] = useState(false);
  /**
   * Possible error message when submitting post
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle new post submit
   */
  async function handleSubmit() {
    if (!location) {
      setError('Please select a location');
      return;
    }
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      await axios.post(
        `${url}/posts`,
        { country: location.code, content },
        { withCredentials: true }
      );

      setContent('');
      setLocation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setPosting(false);
    }
  }

  /**
   * Clear error message
   */
  function clearError() {
    setError(null);
  }

  return {
    location,
    setLocation,
    content,
    setContent,
    posting,
    handleSubmit,
    error,
    clearError,
  };
}
