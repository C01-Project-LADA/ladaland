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

  const [hoverD, setHoverD] = useState();

  // const getRandomColor = useCallback(() => {
  //   // Base color: #14C600 (r: 20, g: 198, b: 0)
  //   const base = { r: 20, g: 198, b: 0 };
  //   const variation = 100; // Variation range for each channel

  //   // Generate a random offset in the range [-variation, variation]
  //   const randomOffset = () =>
  //     Math.floor(Math.random() * (variation * 2 + 1)) - variation;

  //   // Compute new RGB values and clamp them between 0 and 255
  //   const r = Math.min(255, Math.max(0, base.r + randomOffset()));
  //   const g = Math.min(255, Math.max(0, base.g + randomOffset()));
  //   const b = Math.min(255, Math.max(0, base.b + randomOffset()));

  //   // Convert the RGB values
  //   return `rgba(${r}, ${g}, ${b}, 0.8)`;
  // }, []);

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
        polygonCapColor={() => 'rgba(20, 198, 0, 0.7)'}
        polygonSideColor={() => '#14c600'}
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        onPolygonHover={setHoverD}
        onPolygonClick={(polygon) => {
          // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
          console.log(polygon.properties.ISO_A2);
        }}
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        polygonLabel={({ properties: d }) => d.ADMIN}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}
