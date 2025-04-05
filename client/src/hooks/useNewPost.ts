import { useState } from 'react';
import axios from 'axios';

const url = process.env.NEXT_PUBLIC_API_URL;

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
   * Image of the new post
   */
  const [image, setImage] = useState<File | null>(null);
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
      const formData = new FormData();
      formData.append('country', location.code);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await axios.post(`${url}/posts`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setContent('');
      setLocation(null);
      setImage(null);
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
    image,
    setImage,
    posting,
    handleSubmit,
    error,
    clearError,
  };
}
