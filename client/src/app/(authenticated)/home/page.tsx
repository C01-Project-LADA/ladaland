'use client';

import PageBanner from '@/components/PageBanner';
import dynamic from 'next/dynamic';
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });
import { useCallback, useEffect, useState } from 'react';
import countries from '@/lib/geocountries.json';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import axios from 'axios';
import { toast } from 'sonner';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

const url = process.env.NEXT_PUBLIC_API_URL;

// EXAMPLE: https://github.com/vasturiano/react-globe.gl/blob/master/example/choropleth-countries/index.html
export default function Home() {
  const router = useRouter();
  const { width, height } = useScreenDimensions();

  const [hoverD, setHoverD] = useState<GlobeCountry>();

  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [visitedMessage, setVisitedMessage] = useState<string>('Loading...');
  const { setUser, refresh: refreshUser } = useUser();

  // Fetch user visited countries and populate visitedCountries state
  useEffect(() => {
    async function fetchVisitedData() {
      try {
        const [countriesResponse, percentResponse] = await Promise.all([
          axios.get(`${url}/getVisitedCountries`, {
            withCredentials: true,
          }),
          axios.get(`${url}/visitedCountriesPercent`, {
            withCredentials: true,
          }),
        ]);

        if (countriesResponse.status === 200) {
          setVisitedCountries(countriesResponse.data.visitedCountries);
        }

        if (percentResponse.status === 200) {
          setVisitedMessage(percentResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching visited countries:', error);
        setVisitedMessage('Error loading travel progress.');
      }
    }

    fetchVisitedData();
  }, []);

  const getPolygonCapColor = useCallback(
    (d: GlobeCountry) => {
      if (visitedCountries.includes(d.properties.ISO_A2)) {
        return 'rgba(61, 255, 39, 0.7)';
      }
      return 'rgba(14, 143, 0, 0.7)';
    },
    [visitedCountries]
  );

  const handleLeftClick = useCallback(
    (d: GlobeCountry) => {
      const countryCode = d.properties.ISO_A2;
      router.push(`/trips/new?country=${countryCode}`);
    },
    [router]
  );

  /**
   * Handle right click event for a country on the 3D globe
   */
  const handleRightClick = useCallback(
    async (d: GlobeCountry) => {
      const countryCode = d.properties.ISO_A2;
      const isVisited = visitedCountries.includes(countryCode);
      const action = isVisited ? 'remove' : 'add';

      try {
        const response = await axios.post(
          `${url}/markVisitedCountries`,
          { countryCode, action },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setVisitedCountries(response.data.visitedCountries);

          const percentResponse = await axios.get(
            `${url}/visitedCountriesPercent`,
            { withCredentials: true }
          );
          if (percentResponse.status === 200) {
            setVisitedMessage(percentResponse.data.message);
          }
        }

        const updatedUser = await refreshUser();
        setUser(updatedUser);
        window.dispatchEvent(new CustomEvent('userPointsUpdated'));

        if (action == 'add') {
          toast.success(`You earned 200 points for visiting a new country!`);
        } else {
          toast.success(`You lost 200 points for unmarking a country.`);
        }
      } catch (error) {
        console.error(`Error ${action}ing country ${countryCode}:`, error);
      }
    },
    [visitedCountries, refreshUser, setUser]
  );

  return (
    <div
      className="pl-[20px] pt-[30px]"
      style={{ width: 'clamp(200px, 50vw, 500px)' }}
    >
      <PageBanner
        title="TRAVEL PROGRESS"
        message={visitedMessage}
        variant="blue"
        shadow
      />
      <div
        id="globe"
        className="-mt-10 max-w-full flex justify-center items-center"
      >
        <Globe
          width={width}
          height={height - 100}
          backgroundColor="#f5f5f5"
          globeImageUrl="/water.jpg"
          polygonsData={countries.features}
          polygonAltitude={(d) => (d === hoverD ? 0.03 : 0.01)}
          polygonStrokeColor={() => '#111'}
          // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
          polygonCapColor={getPolygonCapColor}
          polygonSideColor={() => '#14c600'}
          // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
          onPolygonHover={setHoverD}
          // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
          onPolygonClick={handleLeftClick}
          // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
          onPolygonRightClick={handleRightClick}
          // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
          polygonLabel={({ properties: d }) => (
            <div className="p-2 w-fit">
              <div className="flex gap-2 mb-2">
                <div className="flex-[3]">
                  <p className="text-xl font-bold leading-none">{d.ADMIN}</p>
                  <p className="text-xs mt-1 font-light text-gray-300">
                    {(d.CONTINENT as string).toUpperCase()}
                  </p>
                </div>
                <div className="flex-1">
                  <span
                    className={`fi !w-full aspect-[4/3] fi-${(
                      d.ISO_A2 as string
                    ).toLowerCase()} rounded-md`}
                  />
                </div>
              </div>

              <p className="text-xs mt-1 font-light leading-none">
                Click to plan your next trip here!
              </p>
              <p className="text-xs mt-2 font-light leading-none">
                {visitedCountries.includes(d.ISO_A2 as string)
                  ? 'Marked as visited'
                  : 'Right click to mark as visited!'}
              </p>
            </div>
          )}
          polygonsTransitionDuration={300}
        />
      </div>
    </div>
  );
}
