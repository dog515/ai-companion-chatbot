import { getSession, useSession, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Welcome to your Dashboard, {session?.user?.name} 👋</h1>
      <p>You are logged in as <strong>{session?.user?.email}</strong></p>
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

  