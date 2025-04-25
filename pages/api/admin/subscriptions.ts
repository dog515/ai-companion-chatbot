// pages/api/admin/subscriptions.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('📌 [Admin API] Hitting subscriptions endpoint');

  const session = await getServerSession(req, res, authOptions);
  console.log('👤 Session:', session);

  if (!session) {
    console.error('❌ No session found.');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    console.log('✅ Subscriptions fetched:', subscriptions.length);
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error('🔥 [Admin API] Failed to fetch subscriptions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



