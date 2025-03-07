import PageBanner from '@/components/PageBanner';
import SocialPage from '@/components/Social';

export default function Social() {
  return (
    <div
      className="pl-[20px] pt-[30px]"
      style={{ width: 'clamp(200px, 50vw, 500px)' }}
    >
      <PageBanner
        title="SOCIAL"
        message="See trending locations and posts from around the world!"
        variant="blue"
        direction="backwards"
      />

      <SocialPage />
    </div>
  );
}
