import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionWithUser } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedSubscriptions: SubscriptionWithUser[] = subscriptions.map(sub => ({
      ...sub,
      status: sub.status as 'active' | 'canceled', // Explicit type assertion
      createdAt: sub.createdAt.toISOString(),
      updatedAt: sub.updatedAt.toISOString(),
      currentPeriodEnd: sub.currentPeriodEnd?.toISOString() || '',
    }));

    return res.status(200).json(formattedSubscriptions);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}