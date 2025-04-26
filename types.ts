// types.ts
export type SubscriptionWithUser = {
  id: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  status: 'active' | 'canceled'; // Explicit status types
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
};