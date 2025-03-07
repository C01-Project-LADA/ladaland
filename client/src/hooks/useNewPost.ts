import { useState, useEffect } from 'react';

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

  // TODO: Remove this useEffect once new post submission is implemented
  useEffect(() => {
    if (posting) {
      setTimeout(() => {
        setPosting(false);
        setContent('');
        setLocation(null);
      }, 2000);
    }
  }, [posting]);

  /**
   * Handle new post submit
   */
  function handleSubmit() {
    if (!location) {
      setError('Please select a location');
      return;
    }
    // TODO: Implement new post submit
    setPosting(true);
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
