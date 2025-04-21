import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { priceId, mode }: { priceId: string; mode: 'subscription' | 'payment' } = req.body;

    if (!priceId || !mode) {
      return res.status(400).json({ error: 'Missing priceId or mode' });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?status=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?status=cancelled`,
      metadata: {
        email: session.user.email,
      },
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('❌ [Stripe Checkout] Error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
