import LeaderboardPage from '@/components/LeaderboardPage';
import PageBanner from '@/components/PageBanner';

export default function Leaderboard() {
  return (
    <div
      className="pl-[20px] pt-[30px]"
      style={{ width: 'clamp(200px, 50vw, 500px)' }}
    >
      <PageBanner
        title="LEADERBOARD"
        message="View lada land's most seasoned travellers!"
        variant="blue"
      />

      <LeaderboardPage />
    </div>
  );
}
