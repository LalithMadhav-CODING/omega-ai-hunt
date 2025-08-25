import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import TransitionScreen from '@/components/TransitionScreen';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>OMEGA AI HUNT</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </Head>
      <TransitionScreen />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
