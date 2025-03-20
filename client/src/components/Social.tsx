'use client';

import styles from '@/styles/Social.module.css';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import Post from '@/components/Post';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import CountrySelectDialog from '@/components/CountrySelectDialog';
import useUser from '@/hooks/useUser';
import useNewPost from '@/hooks/useNewPost';
import usePosts from '@/hooks/usePosts';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function Social() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');
  const sortBy = searchParams.get('sortBy');
  console.log(searchQuery, sortBy);

  const [countriesSelected, setCountriesSelected] = useState<
    Record<string, Country>
  >({});

  const [isVoting, setIsVoting] = useState(false);

  /**
   * Currently logged in user
   */
  const { user, setUser, refresh: refreshUser } = useUser();

  const {
    location,
    setLocation,
    content,
    setContent,
    posting,
    handleSubmit,
    error: newPostError,
    clearError,
  } = useNewPost();

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    refresh,
  } = usePosts(undefined, searchQuery || '', sortBy || '');

  // When countries selected changes, extract the country selected and revert it back to an empty object
  useEffect(() => {
    if (Object.keys(countriesSelected).length > 0) {
      const country = Object.values(countriesSelected)[0];
      setCountriesSelected({});
      setLocation(country);
    }
  }, [countriesSelected, setLocation]);

  // When new post error changes, show a toast
  useEffect(() => {
    if (newPostError) {
      toast.error(newPostError);
      clearError();
    }
  }, [newPostError, clearError]);

  // When there is an error showing all posts, show a toast
  useEffect(() => {
    if (postsError) {
      toast.error(postsError);
    }
  }, [postsError]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function textAreaAdjust() {
    if (textareaRef.current) {
      textareaRef.current.style.height = '1px';
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 25
      }px`;
    }
  }

  const mapPinButtonRef = useRef<HTMLButtonElement>(null);

  async function createPost() {
    const previousPoints = user?.points || 0;

    await handleSubmit();
    refresh();

    try {
      const updatedUser = await refreshUser();
      setUser(updatedUser);
      const updatedPoints = updatedUser.points || 0;
      const earnedPoints = updatedPoints - previousPoints;
      if (earnedPoints > 0) {
        toast.success(`You earned ${earnedPoints} points for making this post`);
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  }

  async function deletePost(id: string) {
    try {
      await axios.delete(`http://localhost:4000/api/posts/${id}`, {
        withCredentials: true,
      });

      toast.success('Post deleted successfully');
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete post');
    }
  }

  async function likePost(id: string) {
    if (isVoting) return;
    setIsVoting(true);

    try {
      await axios.post(
        `http://localhost:4000/api/post-votes/${id}`,
        { voteType: 'LIKE' },
        { withCredentials: true }
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to like post');
    } finally {
      setIsVoting(false);
    }
  }

  async function dislikePost(id: string) {
    if (isVoting) return;
    setIsVoting(true);

    try {
      await axios.post(
        `http://localhost:4000/api/post-votes/${id}`,
        { voteType: 'DISLIKE' },
        { withCredentials: true }
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to dislike post'
      );
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <div className="mt-5">
      <div className={`${styles.new_post_container} rounded-md`}>
        <div className="px-4">
          <Avatar>
            <AvatarImage alt={`@${user?.username}`} />
            <AvatarFallback title={user?.username}>
              {user?.username[0].toUpperCase() || ''}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <div
            className="text-gray-500 text-sm font-bold mt-1 mb-1 hover:cursor-pointer"
            onClick={() => mapPinButtonRef.current?.click()}
          >
            {location ? (
              <p>
                in <span className="underline">{location.name}</span>
              </p>
            ) : (
              <span className="underline">LOCATION</span>
            )}
          </div>

          <Textarea
            ref={textareaRef}
            onKeyUp={textAreaAdjust}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="What's on your mind?"
            disabled={posting}
            style={{
              fontSize: '1.2rem',
              letterSpacing: '-0.2px',
              lineHeight: '1.3',
              color: 'black',
              scrollbarWidth: 'none',
              maxHeight: '400px',
            }}
          />

          <p className="text-xs mt-1" style={{ color: 'var(--lada-accent)' }}>
            Everyone can view and reply
          </p>

          <div className="mt-2 flex justify-between items-center">
            <div className="flex gap-2">
              <CountrySelectDialog
                title="Select location"
                description="Select a country to post about"
                countriesSelected={{}}
                setCountriesSelected={setCountriesSelected}
                dialogTrigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    elevated={false}
                    ref={mapPinButtonRef}
                  >
                    <MapPin className="scale-150" />
                  </Button>
                }
              />
            </div>
            <div className="flex gap-5 pb-2 items-end">
              <p
                className={`text-xs ${
                  content.length >= 1000 ? 'text-red-500' : ''
                }`}
              >
                {content.length}/1000
              </p>
              <Button
                variant="accent"
                disabled={
                  content.length === 0 || content.length >= 1000 || posting
                }
                onClick={createPost}
              >
                <span>POST</span>
                {posting && <Spinner />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-10 flex flex-col gap-7">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            ownedByUser={post.userId === user?.id}
            deletePost={() => deletePost(post.id)}
            likePost={() => likePost(post.id)}
            dislikePost={() => dislikePost(post.id)}
          />
        ))}

        {postsLoading &&
          [1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-48 rounded-md" />
          ))}
      </div>
    </div>
  );
}
