import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
    const session = await getServerSession(req, res, authOptions);
    console.log('🔥 [Stripe Checkout] Session:', session);
  
    if (!session?.user?.email) {
      console.error('❌ No session or user email found.');
      return res.status(401).end('Unauthorized');
    }
  
    const { priceId, mode } = req.body;
    console.log('🧾 [Stripe Checkout] Request body:', { priceId, mode });
  
    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: mode || 'subscription',
        payment_method_types: ['card'],
        customer_email: session.user.email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?status=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?status=cancelled`,
        metadata: {
          email: session.user.email,
        },
      });
  
      console.log('✅ [Stripe Checkout] Session created:', checkoutSession.id);
      res.status(200).json({ url: checkoutSession.url });
    } catch (err: any) {
      console.error('❌ [Stripe Checkout] Stripe error:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  