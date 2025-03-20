import { Button } from '@/components/ui/button';
import HomeGlobe from '@/components/HomeGlobe';
import SlidingCountries from '@/components/SlidingCountries';

export default function Welcome() {
  return (
    <>
      <div className="items-center flex px-[15%] gap-5 h-full">
        <div className="flex-[1.5] mt-5 basis-2/3">
          <HomeGlobe />
        </div>
        <div className="flex-1 basis-1/3">
          <h1 className="mt-12 text-2xl font-bold">
            Gameify your travels, track your budget, and build your itinerary —
            one trip at a time!
          </h1>

          <div className="mt-8 flex justify-center">
            <Button className="px-36 max-w-24">GET STARTED</Button>
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              className="px-36 font-bold max-w-24"
              style={{ color: 'var(--lada-accent)' }}
            >
              I ALREADY HAVE AN ACCOUNT
            </Button>
          </div>
        </div>
      </div>

      <SlidingCountries />
    </>
  );
}
