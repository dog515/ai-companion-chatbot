// manage subscription API here
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).end('Unauthorized');

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.stripeCustomerId) return res.status(400).end('Missing Stripe customer ID');

    const billingPortalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return res.status(200).json({ url: billingPortalSession.url });
  } catch (error: any) {
    console.error('[Manage Subscription]', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
