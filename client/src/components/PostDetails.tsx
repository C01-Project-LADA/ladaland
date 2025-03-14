'use client';

import PageBanner from '@/components/PageBanner';
import usePosts from '@/hooks/usePosts';
import { useState } from 'react';
import Post from '@/components/Post';
import useUser from '@/hooks/useUser';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostDetails({ postId }: { postId: string }) {
  const { posts, loading, refresh: fetchPosts } = usePosts(postId);

  /**
   * Currently logged in user
   */
  const { user } = useUser();

  if (posts.length === 0 && !loading) {
    return (
      <PageBanner
        title="BACK TO SOCIAL"
        message="Error! No post found."
        variant="blue"
        direction="backwards"
        backLink="/social"
      />
    );
  }

  const post = posts[0];
  console.log(post);

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
            deletePost={() => {}}
            likePost={() => {}}
            dislikePost={() => {}}
          />
        </div>
      )}

      <div>
        <div></div>
      </div>
    </>
  );
}
