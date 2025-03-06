'use client';

import dynamic from 'next/dynamic';
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });
import {
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
        polygonCapColor={() => 'rgba(20, 198, 0, 0.7)'}
        polygonSideColor={() => '#14c600'}
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        onPolygonHover={setHoverD}
        onPolygonClick={(polygon) => {
          // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
          console.log(polygon.properties.ISO_A2);
        }}
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        polygonLabel={({ properties: d }) => (
          <div className="p-2 w-fit flex gap-2">
            <div className="flex-[3]">
              <p className="text-xl font-bold leading-none">{d.ADMIN}</p>
              <p className="text-xs mt-1 font-light text-gray-300">
                {(d.CONTINENT as string).toUpperCase()}
              </p>
              <p className="text-sm mt-2 font-light leading-none">
                Click to plan your next plan trip here!
              </p>
              {/* <p>Visited 09/24/2024</p> */}
            </div>
            <div className="flex-1">
              <span
                className={`fi !w-full aspect-[4/3] fi-${(
                  d.ISO_A2 as string
                ).toLowerCase()} rounded-md`}
              />
            </div>
          </div>
        )}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}
