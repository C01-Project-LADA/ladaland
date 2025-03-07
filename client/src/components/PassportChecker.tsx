'use client';

import styles from '@/styles/PassportChecker.module.css';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SectionHeading from '@/components/SectionHeading';
import useVisaRequirements from '@/hooks/useVisaRequirements';
import { Badge } from '@/components/ui/badge';
import ct from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import CountrySelectDialog from './CountrySelectDialog';

ct.registerLocale(en);

export default function PassportChecker() {
  const [hasPassport, setHasPassport] = useState<Record<string, Country>>({});

  const passports = useMemo(() => Object.keys(hasPassport), [hasPassport]);
  const haveMultiplePassports = passports.length > 1;

  const { visaRequirements, loading: visaReqsLoading } = useVisaRequirements({
    passports,
  });
  const visaFreeCountries = useMemo(
    () =>
      visaRequirements
        ?.filter(
          (req) =>
            req.requirement !== 'visa on arrival' &&
            req.requirement !== 'eta' &&
            req.requirement !== 'e-visa' &&
            req.requirement !== 'visa required' &&
            req.requirement !== 'no admission'
        )
        .sort(({ requirement: reqA }, { requirement: reqB }) => {
          // Sort by # of days descending, then by unknown days
          const numA = parseInt(reqA, 10);
          const numB = parseInt(reqB, 10);
          const isNumA = !isNaN(numA);
          const isNumB = !isNaN(numB);

          if (!isNumA && !isNumB) return reqA.localeCompare(reqB);
          if (!isNumA) return 1;
          if (!isNumB) return -1;

          return numB - numA;
        }) || [],
    [visaRequirements]
  );
  const visaOnArrivalCountries = useMemo(
    () =>
      visaRequirements?.filter(
        (req) => req.requirement === 'visa on arrival'
      ) || [],
    [visaRequirements]
  );
  const etaCountries = useMemo(
    () => visaRequirements?.filter((req) => req.requirement === 'eta') || [],
    [visaRequirements]
  );
  const eVisaCountries = useMemo(
    () => visaRequirements?.filter((req) => req.requirement === 'e-visa') || [],
    [visaRequirements]
  );
  const visaRequiredCountries = useMemo(
    () =>
      visaRequirements?.filter((req) => req.requirement === 'visa required') ||
      [],
    [visaRequirements]
  );
  const noAdmissionCountries = useMemo(
    () =>
      visaRequirements?.filter((req) => req.requirement === 'no admission') ||
      [],
    [visaRequirements]
  );

  function removePassport(country: Country) {
    setHasPassport((prev) => {
      const newPassports = { ...prev };
      delete newPassports[country.code];
      return newPassports;
    });
  }

  const countrySkeletons = Array.from({ length: 6 }, (_, i) => i).map(
    (_, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <Skeleton className="w-[35px] h-[26.25px] rounded-md" />

        <Skeleton className="w-[80px] h-4 rounded-md" />
      </div>
    )
  );

  return (
    <div className="max-w-full">
      <CountrySelectDialog
        title="Add a passport"
        description="Search for a passport to check its passport index."
        countriesSelected={hasPassport}
        setCountriesSelected={setHasPassport}
        dialogTrigger={
          <div className="mb-5 w-fit">
            <Button variant="secondary" className="font-medium">
              <Plus /> ADD PASSPORT
            </Button>
          </div>
        }
      />

      {Object.values(hasPassport).length !== 0 && (
        <>
          <div className="border-gray-300 border pt-2 pl-4 pr-4 rounded-md">
            {Object.values(hasPassport).map((country) => (
              <div
                key={country.code}
                className="flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`fi !w-[50px] max-w-[80px] aspect-[4/3] fi-${country.code.toLowerCase()} bg-muted rounded-md`}
                  />
                  <p className="text-gray-800 font-medium">{country.name}</p>
                  {haveMultiplePassports && (
                    <p className="text-gray-600 text-xs -ml-3 mb-[-10px]">
                      {country.code}
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  elevated={false}
                  size="icon"
                  onClick={() => removePassport(country)}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <SectionHeading
              title="Visa-free access"
              subtitle={`${visaFreeCountries.length} countr${
                visaFreeCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : visaFreeCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className={`fi !w-[35px] max-w-[80px] aspect-[4/3] fi-${req.destination.toLowerCase()} bg-muted rounded-md`}
                      />
                      <p className="text-gray-800 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p
                          className="text-gray-600 text-xs -ml-1 mb-[-10px] mr-1"
                          title={`Use this passport to access ${ct.getName(
                            req.destination,
                            'en'
                          )} visa-free`}
                        >
                          {req.passport}
                        </p>
                      )}
                      <Badge>{req.requirement}</Badge>
                    </div>
                  ))}
            </div>
          </div>
          <div className="mt-10">
            <SectionHeading
              title="Visa on arrival"
              subtitle={`${visaOnArrivalCountries.length} countr${
                visaOnArrivalCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : visaOnArrivalCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className={`fi !w-[35px] max-w-[80px] aspect-[4/3] fi-${req.destination.toLowerCase()} bg-muted rounded-md`}
                      />
                      <p className="text-gray-800 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p
                          className="text-gray-600 text-xs -ml-1 mb-[-10px]"
                          title={`Use this passport to access ${ct.getName(
                            req.destination,
                            'en'
                          )} with visa on arrival`}
                        >
                          {req.passport}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="mt-10">
            <SectionHeading
              title="eTA"
              subtitle={`${etaCountries.length} countr${
                etaCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : etaCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className={`fi !w-[35px] max-w-[80px] aspect-[4/3] fi-${req.destination.toLowerCase()} bg-muted rounded-md`}
                      />
                      <p className="text-gray-800 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p
                          className="text-gray-600 text-xs -ml-1 mb-[-10px]"
                          title={`Use this passport to access ${ct.getName(
                            req.destination,
                            'en'
                          )} with an eTA`}
                        >
                          {req.passport}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="mt-10">
            <SectionHeading
              title="e-Visa"
              subtitle={`${eVisaCountries.length} countr${
                eVisaCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : eVisaCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className={`fi !w-[35px] max-w-[80px] aspect-[4/3] fi-${req.destination.toLowerCase()} bg-muted rounded-md`}
                      />
                      <p className="text-gray-800 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p
                          className="text-gray-600 text-xs -ml-1 mb-[-10px]"
                          title={`Use this passport to access ${ct.getName(
                            req.destination,
                            'en'
                          )} with an e-Visa`}
                        >
                          {req.passport}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="mt-10 mb-10">
            <SectionHeading
              title="Visa required"
              subtitle={`${visaRequiredCountries.length} countr${
                visaRequiredCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : visaRequiredCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className={`fi !w-[35px] max-w-[80px] aspect-[4/3] fi-${req.destination.toLowerCase()} bg-muted rounded-md`}
                      />
                      <p className="text-gray-800 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p
                          className="text-gray-600 text-xs -ml-1 mb-[-10px]"
                          title={`This passport requires visa to access ${ct.getName(
                            req.destination,
                            'en'
                          )}`}
                        >
                          {req.passport}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>

          {noAdmissionCountries.length !== 0 && (
            <div className="mt-10 mb-10">
              <SectionHeading
                title="No admission"
                subtitle={`${noAdmissionCountries.length} countr${
                  noAdmissionCountries.length === 1 ? 'y' : 'ies'
                }`}
              />
              <div className={styles.country_results}>
                {visaReqsLoading
                  ? countrySkeletons
                  : noAdmissionCountries.map((req) => (
                      <div
                        key={req.destination}
                        className="flex items-center gap-1.5"
                      >
                        <span
                          className={`fi !w-[35px] max-w-[80px] aspect-[4/3] fi-${req.destination.toLowerCase()} bg-muted rounded-md`}
                        />
                        <p className="text-gray-800 text-sm">
                          {ct.getName(req.destination, 'en')}
                        </p>
                        {haveMultiplePassports && (
                          <p
                            className="text-gray-600 text-xs -ml-1 mb-[-10px]"
                            title={`This passport is not admitted in ${ct.getName(
                              req.destination,
                              'en'
                            )}`}
                          >
                            {req.passport}
                          </p>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
