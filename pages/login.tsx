import { getProviders, signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/admin/dashboard'); // Fixed path
    }
  }, [session, router]);

  if (status === 'loading') {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>Login</h1>
      <button 
        onClick={() => signIn('google', { callbackUrl: '/admin/dashboard' })}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}



