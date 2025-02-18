'use client';

import Globe from 'globe.gl';
import { useEffect, useRef } from 'react';

export default function Home() {
  const globe = useRef(null);

  useEffect(() => {
    if (!globe.current) return;

    const myGlobe = new Globe(globe.current)
      .width(500)
      .height(500)
      .backgroundColor('#f5f5f5');
  }, []);

  return <div id="globeViz" ref={globe} className="max-w-[500px]"></div>;
}
