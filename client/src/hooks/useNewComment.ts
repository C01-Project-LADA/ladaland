import { useState } from 'react';
import axios from 'axios';

const url = process.env.NEXT_PUBLIC_API_URL;

export default function useNewComment(postId: string) {
  /**
   * Content of the new comment
   */
  const [content, setContent] = useState<string>('');
  /**
   * Whether the comment is currently being processed & submitted
   */
  const [posting, setPosting] = useState(false);
  /**
   * Possible error message when submitting comment
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle new Comment submit
   */
  async function handleSubmit() {
    if (!location) {
      setError('Please select a location');
      return;
    }
    if (!content.trim()) {
      setError('Comment content cannot be empty');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      await axios.post(
        `${url}/comments`,
        { content, postId },
        { withCredentials: true }
      );

      setContent('');
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
    content,
    setContent,
    posting,
    handleSubmit,
    error,
    clearError,
  };
}
