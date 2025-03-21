'use client';

import styles from '@/styles/Social.module.css';
import PageBanner from '@/components/PageBanner';
import usePosts from '@/hooks/usePosts';
import { useEffect, useRef, useState } from 'react';
import Post from '@/components/Post';
import useUser from '@/hooks/useUser';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useRouter, notFound } from 'next/navigation';
import axios from 'axios';
import useNewComment from '@/hooks/useNewComment';
import useComments from '@/hooks/useComments';
import Comment from './Comment';

export default function PostDetails({ postId }: { postId: string }) {
  const router = useRouter();
  const { posts, loading } = usePosts(postId);
  const post = posts[0];

  /**
   * Currently logged in user
   */
  const { user, setUser, refresh: refreshUser } = useUser();

  const [isVoting, setIsVoting] = useState(false);

  const {
    content,
    setContent,
    posting,
    handleSubmit,
    error: newCommentError,
    clearError,
  } = useNewComment(postId);

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    refresh,
  } = useComments(postId);

  // When new post error changes, show a toast
  useEffect(() => {
    if (newCommentError) {
      toast.error(newCommentError);
      clearError();
    }
  }, [newCommentError, clearError]);

  // When there is an error showing all posts, show a toast
  useEffect(() => {
    if (commentsError) {
      toast.error(commentsError);
    }
  }, [commentsError]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function textAreaAdjust() {
    if (textareaRef.current) {
      textareaRef.current.style.height = '1px';
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 25
      }px`;
    }
  }

  async function createComment() {
    const previousPoints = user?.points || 0;
    await handleSubmit();
    refresh();
    try {
      const updatedUser = await refreshUser();
      setUser(updatedUser);
      window.dispatchEvent(new CustomEvent('userPointsUpdated'));
      const updatedPoints = updatedUser.points || 0;
      const earnedPoints = updatedPoints - previousPoints;
      if (earnedPoints > 0) {
        toast.success(`You earned ${earnedPoints} points for commenting`);
      }
    } catch (error) {
      console.error('Error updating user points after comment:', error);
    }
  }  

  async function deletePost(id: string) {
    try {
      await axios.delete(`http://localhost:4000/api/posts/${id}`, {
        withCredentials: true,
      });

      toast.success('Post deleted successfully');
      router.push('/social');
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

  async function deleteComment(id: string) {
    try {
      await axios.delete(`http://localhost:4000/api/comments/${id}`, {
        withCredentials: true,
      });

      toast.success('Comment deleted successfully');
      refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete comment'
      );
    }
  }

  async function likeComment(id: string) {
    if (isVoting) return;
    setIsVoting(true);

    try {
      await axios.post(
        `http://localhost:4000/api/comment-votes/${id}`,
        { voteType: 'LIKE' },
        { withCredentials: true }
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to like comment'
      );
    } finally {
      setIsVoting(false);
    }
  }

  async function dislikeComment(id: string) {
    if (isVoting) return;
    setIsVoting(true);

    try {
      await axios.post(
        `http://localhost:4000/api/comment-votes/${id}`,
        { voteType: 'DISLIKE' },
        { withCredentials: true }
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to dislike comment'
      );
    } finally {
      setIsVoting(false);
    }
  }

  if (posts.length === 0 && !loading) {
    notFound();
  }

  return (
    <>
      <PageBanner
        title="BACK TO SOCIAL"
        message={
          loading
            ? ''
            : `@${post.username} in ${
                post.country
              }, ${post.updatedAt.toDateString()}`
        }
        variant="blue"
        direction="backwards"
        backLink="/social"
      />

      {loading ? (
        <Skeleton className="w-full h-48 rounded-md mt-5" />
      ) : (
        <div className="mt-5">
          <Post
            post={post}
            ownedByUser={post?.userId === user?.id}
            deletePost={() => deletePost(post.id)}
            likePost={() => likePost(post.id)}
            dislikePost={() => dislikePost(post.id)}
          />
        </div>
      )}

      <div className={`${styles.new_comment_container} rounded-md mt-4`}>
        <div className="px-4">
          <Avatar>
            <AvatarImage alt={`@${user?.username}`} />
            <AvatarFallback title={user?.username}>
              {user?.username[0].toUpperCase() || ''}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-500">
            Replying to{' '}
            <span style={{ color: 'var(--lada-accent)', fontWeight: 500 }}>
              @shadcn
            </span>
          </p>

          <Textarea
            ref={textareaRef}
            onKeyUp={textAreaAdjust}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Post your reply..."
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

          <div className="mt-2 flex justify-end items-center">
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
                onClick={createComment}
              >
                <span>REPLY</span>
                {posting && <Spinner />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 mb-10">
        {commentsLoading ? (
          <Skeleton className="w-full h-36 rounded-md mt-5" />
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              likeComment={() => likeComment(comment.id)}
              dislikeComment={() => dislikeComment(comment.id)}
              deleteComment={() => deleteComment(comment.id)}
              ownedByUser={comment.userId === user?.id}
            />
          ))
        )}
      </div>
    </>
  );
}
