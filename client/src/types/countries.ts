/* eslint-disable @typescript-eslint/no-unused-vars */

type Country = {
  name: string;
  code: string;
};

type GlobeCountry = {
  type: string;
  properties: GlobeCountryProperties;
};

type GlobeCountryProperties = {
  ABBREV: string;
  FORMAL_EN: string;
  CONTINENT: string;
  ISO_A2: string;
  ISO_A3: string;
  NAME: string;
};
