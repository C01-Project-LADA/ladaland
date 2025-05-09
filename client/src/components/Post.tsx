'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  EllipsisVertical,
  MessageSquareText,
  ThumbsUp,
  ThumbsDown,
  Trash,
  Plane,
} from 'lucide-react';
import { formatNumberToKorM, formatLastUpdatedDate } from '@/lib/utils';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, animate } from 'motion/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ct from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import Link from 'next/link';

ct.registerLocale(en);

export default function Post({
  post,
  ownedByUser = false,
  deletePost,
  likePost,
  dislikePost,
}: {
  post: Post;
  ownedByUser?: boolean;
  deletePost?: () => void;
  likePost: () => void;
  dislikePost: () => void;
}) {
  const router = useRouter();

  const likeRef = useRef<HTMLDivElement>(null);

  const [liked, setLiked] = useState(post.userVote === 'LIKE');
  const [disliked, setDisliked] = useState(post.userVote === 'DISLIKE');

  function handleLike() {
    if (!liked && likeRef.current) {
      animate([
        [
          likeRef.current,
          { scale: 1.5, rotate: -10, y: -3 },
          { duration: 0.4, type: 'spring' },
        ],
        [
          likeRef.current,
          { scale: 1, rotate: 0, y: 0 },
          { duration: 0.3, type: 'spring' },
        ],
      ]);
      setDisliked(false);
    }
    setLiked(!liked);
    likePost();
  }

  function handleDislike() {
    if (!disliked) setLiked(false);
    setDisliked(!disliked);
    dislikePost();
  }

  const originallyLiked = post.userVote === 'LIKE';
  const originallyDisliked = post.userVote === 'DISLIKE';
  const likes =
    originallyLiked && !liked
      ? post.likes - 1
      : !originallyLiked && liked
      ? post.likes + 1
      : post.likes;
  const dislikes =
    originallyDisliked && !disliked
      ? post.dislikes - 1
      : !originallyDisliked && disliked
      ? post.dislikes + 1
      : post.dislikes;

  return (
    <div className="p-[20px] pb-[10px] pl-6 bg-white rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex gap-5">
          <Avatar>
            <AvatarImage alt={`@${post.username}`} />
            <AvatarFallback title={post.username}>
              {post.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center">
              <p className="font-bold">@{post.username}</p>
              <p className="text-gray-500 ml-1">&middot;</p>
              <p
                className="text-gray-500 ml-1 text-sm"
                title={post.createdAt.toDateString()}
              >
                {formatLastUpdatedDate(post.createdAt, post.updatedAt)}
              </p>
            </div>

            <p className="text-gray-500 font-semibold">
              in{' '}
              <span className="underline">
                {ct.getName(post.country, 'en')}
              </span>
            </p>
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" elevated={false}>
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64"
            side="left"
            align="start"
            sideOffset={-40}
          >
            <ul>
              {ownedByUser && (
                <li>
                  <button
                    className="hover:bg-[#e9e9e9] duration-150 w-full flex items-center py-3 px-4 gap-3 font-bold text-red-500 leading-none text-left"
                    onClick={deletePost}
                  >
                    <Trash />
                    Delete post
                  </button>
                </li>
              )}
              <li>
                <button
                  className="hover:bg-[#e9e9e9] duration-150 w-full flex items-center py-3 px-4 gap-3 font-bold text-gray-500 leading-none text-left"
                  onClick={() =>
                    router.push(`/trips/new?country=${post.country}`)
                  }
                >
                  <Plane />
                  Plan a trip here
                </button>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      <p className="mt-2 break-words">{post.content}</p>

      {post.imageUrl && (
        <div className="mt-5 mb-3 w-full h-64 overflow-hidden rounded-md bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={`Post image by ${post.username}`}
            className="object-contain w-full h-full"
          />
        </div>
      )}

      <div className="mt-2 flex gap-8 -ml-3">
        <Button
          variant="ghost"
          elevated={false}
          className="py-0 px-3 text-gray-500"
          asChild
        >
          <Link href={`/social/${post.id}`}>
            <MessageSquareText />
            {post.commentsCount}
          </Link>
        </Button>

        <Button
          variant="ghost"
          elevated={false}
          className={`py-0 px-3 text-gray-500 ${
            liked
              ? 'text-sky-500 font-bold hover:text-sky-500 hover:font-bold'
              : ''
          }`}
          onClick={handleLike}
        >
          <motion.div ref={likeRef}>
            <ThumbsUp fill={liked ? 'var(--lada-accent)' : 'transparent'} />
          </motion.div>
          {formatNumberToKorM(likes)}
        </Button>

        <Button
          variant="ghost"
          elevated={false}
          className={`py-0 px-3 text-gray-500 ${
            disliked
              ? 'text-sky-500 font-bold hover:text-sky-500 hover:font-bold'
              : ''
          }`}
          onClick={handleDislike}
        >
          <motion.div>
            <ThumbsDown
              fill={disliked ? 'var(--lada-accent)' : 'transparent'}
            />
          </motion.div>
          {formatNumberToKorM(dislikes)}
        </Button>
      </div>
    </div>
  );
}
