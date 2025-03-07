'use client';

import styles from '@/styles/Social.module.css';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image, MapPin } from 'lucide-react';
import Post from '@/components/Post';
import { Spinner } from '@/components/ui/spinner';

const mockPost: Post = {
  id: '1',
  userId: '1',
  country: 'Canada',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec sem nec justo tincidunt fermentum. Nullam nec sem nec justo tincidunt',
  createdAt: new Date(1741365088777),
  updatedAt: new Date(1741365088777),
  username: 'shadcn',
  likes: 19950,
  dislikes: 5949,
};

export default function Social() {
  // TEMP: Remove this when we have custom hooks
  const [posting, setPosting] = useState(false);
  useEffect(() => {
    if (posting) {
      setTimeout(() => {
        setPosting(false);
        setNewPostText('');
      }, 2000);
    }
  }, [posting]);

  function handleNewPostSubmit() {
    setPosting(true);
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newPostText, setNewPostText] = useState('');

  function textAreaAdjust() {
    if (textareaRef.current) {
      textareaRef.current.style.height = '1px';
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 25
      }px`;
    }
  }

  return (
    <div className="mt-5">
      <div className={`${styles.new_post_container} rounded-md`}>
        <div className="px-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <p className="text-gray-500 text-sm font-bold mt-1 mb-1">LOCATION</p>

          <Textarea
            ref={textareaRef}
            onKeyUp={textAreaAdjust}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            rows={4}
            placeholder="What's on your mind?"
            style={{
              fontSize: '1.2rem',
              letterSpacing: '-0.2px',
              lineHeight: '1.3',
              color: 'black',
              scrollbarWidth: 'none',
            }}
          />

          <p className="text-xs text-sky-500 mt-1">
            Everyone can view and reply
          </p>

          <div className="mt-2 flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2"
                elevated={false}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="scale-150" />
              </Button>

              <Button variant="ghost" size="icon" elevated={false}>
                <MapPin className="scale-150" />
              </Button>
            </div>
            <div className="flex gap-5 pb-2 items-end">
              <p
                className={`text-xs ${
                  newPostText.length >= 1000 ? 'text-red-500' : ''
                }`}
              >
                {newPostText.length}/1000
              </p>
              <Button
                variant="accent"
                disabled={
                  newPostText.length === 0 ||
                  newPostText.length >= 1000 ||
                  posting
                }
                onClick={handleNewPostSubmit}
              >
                <span>POST</span>
                {posting && <Spinner />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-10">
        <Post post={mockPost} />
      </div>
    </div>
  );
}
