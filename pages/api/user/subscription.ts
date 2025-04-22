// pages/api/user/subscription.ts

import { getServerSession } from 'next-auth/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      subscriptions: {
        where: { status: 'active' },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const subscription = user.subscriptions[0];

  return res.status(200).json({ subscription });
}
