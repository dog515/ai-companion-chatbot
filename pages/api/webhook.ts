import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig as string, endpointSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const email = session.customer_email;
      const mode = session.mode;

      if (!email) {
        console.warn('⚠️ No email found in checkout session');
        break;
      }

      if (mode === 'subscription') {
        // ✅ Subscription successful
        await prisma.user.update({
          where: { email },
          data: { hasSubscription: true },
        });
        console.log(`✅ Subscription activated for ${email}`);
      }

      if (mode === 'payment') {
        // ✅ One-time bot creation payment successful
        await prisma.user.update({
          where: { email },
          data: { hasPaidBotCreation: true },
        });
        console.log(`✅ One-time bot creation payment for ${email}`);
      }

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      try {
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;

        const email = customer.email;
        if (!email) {
          console.warn('⚠️ No email found on customer record');
          break;
        }

        await prisma.user.update({
          where: { email },
          data: { hasSubscription: false },
        });

        console.log(`❌ Subscription canceled for ${email}`);
      } catch (err) {
        console.error('❌ Error retrieving customer for cancellation:', err);
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}
