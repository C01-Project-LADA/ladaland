'use client';

import dynamic from 'next/dynamic';
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });
import useScreenDimensions from '@/hooks/useScreenDimensions';
import { csvParseRows } from '@/lib/csvParseRows';
import indexBy from '@/lib/indexBy';
import { useRef, useState, useEffect } from 'react';
import { GlobeMethods } from 'react-globe.gl';

const COUNTRY = 'Canada';
const OPACITY = 0.22;

type Airport = {
  airportId: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  lat: string;
  lng: string;
  alt: string;
  timezone: string;
  dst: string;
  tz: string;
  type: string;
  source: string;
};

type Route = {
  airline: string;
  airlineId: string;
  srcIata: string;
  srcAirportId: string;
  dstIata: string;
  dstAirportId: string;
  codeshare: string;
  stops: string;
  equipment: string;
};

const airportParse = ([
  airportId,
  name,
  city,
  country,
  iata,
  icao,
  lat,
  lng,
  alt,
  timezone,
  dst,
  tz,
  type,
  source,
]: string[]): Airport => ({
  airportId,
  name,
  city,
  country,
  iata,
  icao,
  lat,
  lng,
  alt,
  timezone,
  dst,
  tz,
  type,
  source,
});

const routeParse = ([
  airline,
  airlineId,
  srcIata,
  srcAirportId,
  dstIata,
  dstAirportId,
  codeshare,
  stops,
  equipment,
]: string[]): Route => ({
  airline,
  airlineId,
  srcIata,
  srcAirportId,
  dstIata,
  dstAirportId,
  codeshare,
  stops,
  equipment,
});

/**
 * Code snippets taken from https://github.com/vasturiano/react-globe.gl/blob/master/example/airline-routes/us-international-outbound.html
 */
export default function HomeGlobe() {
  const { height } = useScreenDimensions();
  const globeRef = useRef<GlobeMethods>(undefined);

  const [airports, setAirports] = useState<object[]>([]);
  const [routes, setRoutes] = useState<object[]>([]);

  useEffect(() => {
    // load data
    Promise.all([
      fetch(
        'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat'
      )
        .then((res) => res.text())
        .then((d) => csvParseRows(d, airportParse)),
      fetch(
        'https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat'
      )
        .then((res) => res.text())
        .then((d) => csvParseRows(d, routeParse)),
    ]).then(([airports, routes]) => {
      const byIata = indexBy(airports, 'iata', false);

      const filteredRoutes = routes
        .filter(
          (d) =>
            byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)
        ) // exclude unknown airports
        .filter((d) => d.stops === '0') // non-stop flights only
        .map((d) =>
          Object.assign(d, {
            srcAirport: byIata[d.srcIata],
            dstAirport: byIata[d.dstIata],
          })
        )
        .filter(
          (d) =>
            d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY
        ); // international routes from country

      setAirports(airports);
      setRoutes(filteredRoutes);
    });
  }, []);

  // Point of view set to center of Canada
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointOfView({ lat: 56.1304, lng: -106.3468, altitude: 2 });
  }, []);

  return (
    <div id="globe" className="mt-5">
      <Globe
        ref={globeRef}
        width={500}
        height={height / 2}
        backgroundColor="#f5f5f5"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={routes}
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        arcStartLat={(d) => +d.srcAirport.lat}
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        arcEndLat={(d) => +d.dstAirport.lat}
        // @ts-expect-error: react-globe.gl has terrible ts support, SAD!
        arcEndLng={(d) => +d.dstAirport.lng}
        arcDashLength={0.25}
        arcDashGap={1}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={4000}
        arcColor={() => [
          `rgba(0, 255, 0, ${OPACITY})`,
          `rgba(255, 0, 0, ${OPACITY})`,
        ]}
        arcsTransitionDuration={0}
        pointsData={airports}
        pointColor={() => 'orange'}
        pointAltitude={0}
        pointRadius={0.02}
        pointsMerge={true}
      />
    </div>
  );
}
