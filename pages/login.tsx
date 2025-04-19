import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Login</h1>
      {providers ? (
        Object.values(providers).map((provider: any) => (
          <div key={provider.name} style={{ marginTop: '1rem' }}>
            <button
              onClick={() => signIn(provider.id)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))
      ) : (
        <p>Loading login providers...</p>
      )}
    </div>
  );
}
