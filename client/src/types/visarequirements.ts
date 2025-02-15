/* eslint-disable @typescript-eslint/no-unused-vars */

type Requirement = {
  destination: string;
  /**
   * Either a number representing # of days for visa-free status, `visa on arrival`, `eta`, `e-visa`, `visa required`, or `no admission`.
   */
  requirement: string;
  passport: string;
};
