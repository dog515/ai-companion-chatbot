// pages/api/admin/subscriptions.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
  if (!isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error('[ADMIN_SUBSCRIPTIONS_ERROR]', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}



