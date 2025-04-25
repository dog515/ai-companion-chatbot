import { useSubscriptions } from '@/lib/hooks/useSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const { data: subscriptions, isLoading, error: isError } = useSubscriptions();
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
      <p className="text-muted-foreground mb-2">View and manage current subscriptions.</p>

      {isLoading && <p>Loading subscriptions...</p>}
      {isError && <p className="text-red-500">Failed to load subscriptions.</p>}
      {!isLoading && !isError && subscriptions.length === 0 && (
        <p className="text-muted-foreground">No active subscriptions found.</p>
      )}
      {!isLoading && !isError && subscriptions.length > 0 && (
        <ul className="space-y-2 mt-4">
          {subscriptions.map((sub: any) => (
            <li key={sub.id} className="border rounded p-3">
              <div><strong>Email:</strong> {sub.user?.email}</div>
              <div><strong>Status:</strong> {sub.status}</div>
              <div><strong>Plan:</strong> {sub.stripePriceId}</div>
              <div><strong>Next Billing:</strong> {new Date(sub.currentPeriodEnd).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
</TabsContent>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">User Accounts</h2>
              <p className="text-muted-foreground">Browse all registered users.</p>
              {/* Add real data from API here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Payment History</h2>
              <p className="text-muted-foreground">Track incoming payments from Stripe.</p>
              <Button className="mt-2">Download CSV</Button>
              {/* Add real data from API here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}