import { useState, useEffect } from 'react';

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useVisaRequirements({
  passports,
}: {
  passports: string[];
}) {
  const [visaRequirements, setVisaRequirements] = useState<Requirement[]>();
  const [canBeLoading, setCanBeLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!passports || passports.length === 0) {
      setVisaRequirements([]);
      setCanBeLoading(true);
      return;
    }

    if (canBeLoading) {
      setLoading(true);
      setCanBeLoading(false);
    }

    fetch(`${url}/visa-requirements`, {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passports]);

  return { visaRequirements, loading };
}
