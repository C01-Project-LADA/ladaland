'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  EllipsisVertical,
  MessageSquareText,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

export default function Post() {
  return (
    <div className="p-[20px] bg-white rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex gap-5">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center">
              <p className="font-bold">Name</p>
              <p className="text-gray-500 ml-1">@username &middot;</p>
              <p
                className="text-gray-500 ml-1 text-sm"
                title={new Date().toString()}
              >
                2h ago
              </p>
            </div>

            <p className="text-gray-500 font-semibold">
              in <span className="underline">Canada</span>
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" elevated={false}>
          <EllipsisVertical />
        </Button>
      </div>

      <p className="mt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec sem
        nec justo tincidunt fermentum. Nullam nec sem nec justo tincidunt
      </p>

      <div className="mt-2 flex gap-8">
        <Button
          variant="ghost"
          elevated={false}
          className="py-0 px-3 text-gray-500"
        >
          <MessageSquareText />
          1k
        </Button>

        <Button
          variant="ghost"
          elevated={false}
          className="py-0 px-3 text-gray-500"
        >
          <ThumbsUp />
          1k
        </Button>

        <Button
          variant="ghost"
          elevated={false}
          className="py-0 px-3 text-gray-500"
        >
          <ThumbsDown />
          1k
        </Button>
      </div>
    </div>
  );
}
