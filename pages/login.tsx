import { getProviders, signIn, signOut, useSession } from 'next-auth/react';

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Welcome, {session.user?.name} 👋</h1>
        <p>You are logged in as <strong>{session.user?.email}</strong></p>
        {session.user?.image && (
          <img
            src={session.user.image}
            alt="Profile"
            style={{ borderRadius: '50%', width: 64, height: 64, marginTop: '1rem' }}
          />
        )}
        <br />
        <button onClick={() => signOut()} style={{ marginTop: '2rem' }}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>Login</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
}


