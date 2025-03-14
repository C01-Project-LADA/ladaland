import React from 'react';
import PageBanner from '@/components/PageBanner';

export default function PostDetails() {
  return (
    <div
      className="pl-[20px] pt-[30px]"
      style={{ width: 'clamp(200px, 50vw, 500px)' }}
    >
      <PageBanner
        title="BACK TO SOCIAL"
        message="See trending locations and posts from around the world!"
        variant="blue"
        direction="backwards"
        backLink="/social"
      />
      <div>Post Details</div>
    </div>
  );
}
