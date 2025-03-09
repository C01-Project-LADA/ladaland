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
import { useRef } from 'react';
import { motion, animate } from 'motion/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ct from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

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
  const likeRef = useRef<HTMLDivElement>(null);

  const liked = post.userVote === 'LIKE';
  const disliked = post.userVote === 'DISLIKE';

  function handleLike() {
    if (!liked) {
      if (likeRef.current) {
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
      }
      likePost();
    }
  }

  function handleDislike() {
    if (!disliked) {
      dislikePost();
    }
  }

  return (
    <div className="p-[20px] bg-white rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex gap-5">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={`@${post.username}`}
            />
            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
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
                <button className="hover:bg-[#e9e9e9] duration-150 w-full flex items-center py-3 px-4 gap-3 font-bold text-gray-500 leading-none text-left">
                  <Plane />
                  Plan a trip here
                </button>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      <p className="mt-2 break-words">{post.content}</p>

      <div className="mt-2 flex gap-8">
        <Button
          variant="ghost"
          elevated={false}
          className="py-0 px-3 text-gray-500"
        >
          <MessageSquareText />
          {/* TODO: Comment count */}0
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
          {formatNumberToKorM(post.likes)}
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
          {formatNumberToKorM(post.dislikes)}
        </Button>
      </div>
    </div>
  );
}
