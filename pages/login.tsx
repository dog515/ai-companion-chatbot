import { getProviders, signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>Login</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
}



