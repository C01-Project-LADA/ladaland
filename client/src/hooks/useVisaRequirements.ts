import { useState, useEffect } from 'react';

export default function useVisaRequirements({
  passports,
}: {
  passports: string[];
}) {
  const [visaRequirements, setVisaRequirements] = useState<Requirement[]>();

  useEffect(() => {
    if (!passports || passports.length === 0) {
      setVisaRequirements([]);
      return;
    }

    fetch('http://localhost:4000/api/visa-requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passports }),
    })
      .then((response) => response.json())
      .then((data: Requirement[]) => setVisaRequirements(data));
  }, [passports]);

  return visaRequirements;
}
