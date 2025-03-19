'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, ThumbsUp, ThumbsDown, Trash } from 'lucide-react';
import { formatNumberToKorM, formatLastUpdatedDate } from '@/lib/utils';
import { useRef, useState } from 'react';
import { motion, animate } from 'motion/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function Comment({
  comment,
  ownedByUser = false,
  deleteComment,
  likeComment,
  dislikeComment,
}: {
  comment: PostComment;
  ownedByUser?: boolean;
  deleteComment?: () => void;
  likeComment: () => void;
  dislikeComment: () => void;
}) {
  const likeRef = useRef<HTMLDivElement>(null);

  const [liked, setLiked] = useState(comment.userVote === 'LIKE');
  const [disliked, setDisliked] = useState(comment.userVote === 'DISLIKE');

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
    likeComment();
  }

  function handleDislike() {
    if (!disliked) setLiked(false);
    setDisliked(!disliked);
    dislikeComment();
  }

  const originallyLiked = comment.userVote === 'LIKE';
  const originallyDisliked = comment.userVote === 'DISLIKE';
  const likes =
    originallyLiked && !liked
      ? comment.likes - 1
      : !originallyLiked && liked
      ? comment.likes + 1
      : comment.likes;
  const dislikes =
    originallyDisliked && !disliked
      ? comment.dislikes - 1
      : !originallyDisliked && disliked
      ? comment.dislikes + 1
      : comment.dislikes;

  return (
    <div className="p-[15px] pb-[5px] bg-white rounded-md">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={`@${comment.username}`}
          />
          <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        <div
          className="flex-1 break-words"
          style={{ maxWidth: 'calc(100% - 60px)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <p className="font-bold">@{comment.username}</p>
              <p className="text-gray-500 ml-1">&middot;</p>
              <p
                className="text-gray-500 ml-1 text-sm"
                title={comment.createdAt.toDateString()}
              >
                {formatLastUpdatedDate(comment.createdAt, comment.updatedAt)}
              </p>
            </div>

            {ownedByUser && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="-mt-2 -mb-2"
                    size="icon"
                    elevated={false}
                  >
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
                    <li>
                      <button
                        className="hover:bg-[#e9e9e9] duration-150 w-full flex items-center py-3 px-4 gap-3 font-bold text-red-500 leading-none text-left"
                        onClick={deleteComment}
                      >
                        <Trash />
                        Delete comment
                      </button>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <p className="mt-1 break-words">{comment.content}</p>

          <div className="mt-1 flex gap-3 -ml-3">
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
      </div>
    </div>
  );
}
