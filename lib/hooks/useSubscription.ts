// lib/hooks/useSubscriptions.ts
import useSWR from 'swr';

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
  };
};

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return res.json();
});

export function useSubscriptions() {
  const { data, error, isLoading } = useSWR<Subscription[]>('/api/admin/subscriptions', fetcher);
  return { data, error, isLoading };
}
