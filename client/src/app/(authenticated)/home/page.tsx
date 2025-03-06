'use client';

import dynamic from 'next/dynamic';
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });
import {
  useCallback,
  // useCallback,
  useState,
} from 'react';
import countries from '@/lib/geocountries.json';
import useScreenDimensions from '@/hooks/useScreenDimensions';

// EXAMPLE: https://github.com/vasturiano/react-globe.gl/blob/master/example/choropleth-countries/index.html
export default function Home() {
  const { height } = useScreenDimensions();

  const [hoverD, setHoverD] = useState<GlobeCountry>();
  // const currentCountryCode = hoverD?.properties?.ISO_A2;

  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const getPolygonCapColor = useCallback(
    (d: GlobeCountry) => {
      if (visitedCountries.includes(d.properties.ISO_A2)) {
        return 'rgba(61, 255, 39, 0.7)';
      }
      return 'rgba(14, 143, 0, 0.7)';
    },
    [visitedCountries]
  );

  const handleRightClick = useCallback(
    (d: GlobeCountry) => {
      const countryCode = d.properties.ISO_A2;
      if (visitedCountries.includes(countryCode)) {
        setVisitedCountries((prev) => prev.filter((c) => c !== countryCode));
      } else {
        setVisitedCountries((prev) => [...prev, countryCode]);
      }
    },
    [visitedCountries]
  );

  return (
    <div id="globe">
      <Globe
        width={500}
        height={height}
        backgroundColor="#f5f5f5"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        polygonsData={countries.features}
        polygonAltitude={(d) => (d === hoverD ? 0.03 : 0.01)}
        polygonStrokeColor={() => '#111'}
        // TODO: Adjust color based on visited or not
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        polygonCapColor={getPolygonCapColor}
        polygonSideColor={() => '#14c600'}
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        onPolygonHover={setHoverD}
        onPolygonClick={(polygon) => {
          // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
          console.log(polygon.properties.ISO_A2);
        }}
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
            {/* <p>Visited 09/24/2024</p> */}
          </div>
        )}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}
