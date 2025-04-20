import { getSession, useSession, signOut } from 'next-auth/react';

const startCheckout = async (priceId: string, mode: 'subscription' | 'payment') => {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, mode }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
};

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Welcome to your Dashboard, {session?.user?.name} 👋</h1>
      <p>You are logged in as <strong>{session?.user?.email}</strong></p>

      {/* 🔘 Stripe Checkout Buttons */}
      <button
        onClick={() => startCheckout('price_1RFtEGELZxyuzW7jBVS6cm1v', 'subscription')}
        style={{ margin: '1rem' }}
      >
        Subscribe for $18/month
      </button>

      <button
        onClick={() => startCheckout('price_1RFtCAELZxyuzW7jI8fqZ7pZ', 'payment')}
        style={{ margin: '1rem' }}
      >
        Pay $40 to Create Your Own Bot
      </button>

      <br />

      <img
        src={session?.user?.image ?? ''}
        alt="Profile"
        style={{ borderRadius: '50%', width: 80, height: 80, marginTop: '1rem' }}
      />

      <br />
      <button onClick={() => signOut()} style={{ marginTop: '2rem' }}>
        Log out
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
