// lib/hooks/useSubscriptions.ts
import { useEffect, useState } from 'react';

export type Subscription = {
  id: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  status: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
};

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const res = await fetch('/api/admin/subscriptions');
        if (!res.ok) {
          throw new Error('Failed to fetch subscriptions');
        }
        const data = await res.json();
        setSubscriptions(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, []);

  return { subscriptions, loading, error };
}