// lib/hooks/useSubscriptions.ts
import useSWR from 'swr';
import { SubscriptionWithUser } from '@/types';

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

const fetcher = (url: string) => fetch(url).then(async (res) => {
  if (!res.ok) {
    const error = new Error('Failed to fetch subscriptions');
    const errorData = await res.json();
    error.message = errorData.error || error.message;
    throw error;
  }
  return res.json();
});
export function useSubscriptions() {
  const { data, error, isLoading } = useSWR<SubscriptionWithUser[]>('/api/admin/subscriptions', fetcher);
  
  return {
    data: data || [],
    isLoading,
    error: error?.message
  };
}


