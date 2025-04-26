import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSubscriptions } from '@/lib/hooks/useSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SubscriptionsTable } from '@/components/admin/SubscriptionsTable';
import { SubscriptionWithUser } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const { data: session, status } = useSession();
  const { data: subscriptions, isLoading, error } = useSubscriptions();

  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'loading') return;
      const session = await getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router, status]);

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">All Active Subscriptions</h2>
              <p className="text-muted-foreground mb-4">View and manage current subscriptions.</p>

              {isLoading ? (
                <p>Loading subscriptions...</p>
              ) : error ? (
                <p className="text-red-500">Failed to load subscriptions.</p>
              ) : subscriptions?.length === 0 ? (
                <p>No active subscriptions found.</p>
              ) : (
                <SubscriptionsTable subscriptions={subscriptions || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">User Accounts</h2>
              <p className="text-muted-foreground">Browse all registered users.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Payment History</h2>
              <p className="text-muted-foreground">Track incoming payments from Stripe.</p>
              <Button className="mt-2">Download CSV</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}