import { useState, useEffect } from 'react';

export default function useVisaRequirements({
  passports,
}: {
  passports: string[];
}) {
  const [visaRequirements, setVisaRequirements] = useState<Requirement[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!passports || passports.length === 0) {
      setVisaRequirements([]);
      return;
    }

    setLoading(true);

    fetch('http://localhost:4000/api/visa-requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passports }),
    })
      .then((response) => response.json())
      .then((data: Requirement[]) => {
        setLoading(false);
        setVisaRequirements(data);
      });
  }, [passports]);

  return { visaRequirements, loading };
}
