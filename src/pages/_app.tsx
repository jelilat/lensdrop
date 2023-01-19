import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import { DynamicContextProvider, EvmNetwork } from '@dynamic-labs/sdk-react';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';

import client from 'src/apollo'

import Head from 'next/head'
import Footer from '@components/Footer/Footer'
import { AppWrapper } from '@components/utils/AppContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ID!,
        initialAuthenticationMode: 'connect-only',
      }}
      >
        <DynamicWagmiConnector>
          <ApolloProvider client={client}>
            <div>
                <Head>
                  <title>Lensdrop</title>
                  <link rel="shortcut icon" href="/lensdrop.png" />
                  <meta property="og:title" content="Lensdrop" />
                  <meta property="og:image" content="/lensdrop.png" />
                  <meta property="og:description" content="Airdrop tokens to your Lens protocol followers with Lensdrop" />
                  <meta property="og:url" content="https://lensdrop.xyz" />

                  <meta property="twitter:title" content="Lensdrop" />
                  <meta property="twitter:site" content="@lensdropxyz" />
                  <meta property="twitter:image" content="/lensdrop.png" />
                  <meta property="twitter:card" content="summary" />
                  <meta property="twitter:description" content="Airdrop tokens to your Lens protocol followers with Lensdrop" />
                  <script defer data-domain="lensdrop.xyz,lensverse.web" src="https://plausible.io/js/script.js"></script>
                </Head>
                  <Component {...pageProps} />
                {/* <Footer /> */}
            </div>
          </ApolloProvider>
      </DynamicWagmiConnector>
    </DynamicContextProvider>
    </AppWrapper>
  )
  
}

export default MyApp
