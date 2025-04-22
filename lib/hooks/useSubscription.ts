// lib/hooks/useSubscription.ts

import { useEffect, useState } from 'react';

export function useSubscription() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch('/api/user/subscription');
        const data = await res.json();
        setSubscription(data.subscription ?? null);
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  return { subscription, loading };
}
