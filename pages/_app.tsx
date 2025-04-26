// pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider 
      session={pageProps.session}
      refetchInterval={5 * 60} // Refresh session every 5 minutes
      refetchOnWindowFocus={true}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
