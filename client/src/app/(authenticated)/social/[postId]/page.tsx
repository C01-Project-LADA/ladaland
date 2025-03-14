import PostDetails from '@/components/PostDetails';

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return (
    <div
      className="pl-[20px] pt-[30px]"
      style={{ width: 'clamp(200px, 50vw, 500px)' }}
    >
      <PostDetails postId={postId} />
    </div>
  );
}
