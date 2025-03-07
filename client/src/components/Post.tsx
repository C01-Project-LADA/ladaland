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
}: {
  post: Post;
  ownedByUser?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const likeRef = useRef<HTMLDivElement>(null);

  function handleLike() {
    setLiked((prev) => {
      if (!prev && likeRef.current)
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
      return !prev;
    });
    setDisliked(false);
  }

  function handleDislike() {
    setDisliked((prev) => !prev);
    setLiked(false);
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
            <AvatarFallback>CN</AvatarFallback>
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
              in <span className="underline">{post.country}</span>
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
                  <button className="hover:bg-[#e9e9e9] duration-150 w-full flex items-center py-3 px-4 gap-3 font-bold text-red-500 leading-none text-left">
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

      <p className="mt-2">{post.content}</p>

      <div className="mt-2 flex gap-8">
        <Button
          variant="ghost"
          elevated={false}
          className="py-0 px-3 text-gray-500"
        >
          <MessageSquareText />
          {/* TODO: Comment count */}
          1k
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
          {formatNumberToKorM(post.likes + Number(liked))}
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
          {formatNumberToKorM(post.dislikes + Number(disliked))}
        </Button>
      </div>
    </div>
  );
}
