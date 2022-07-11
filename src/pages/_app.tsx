import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  WagmiConfig,
  createClient,
  chain,
  configureChains,
} from "wagmi";

import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { ApolloProvider } from '@apollo/client'

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import client from 'src/apollo'

import Head from 'next/head'
import Footer from '@components/Footer/Footer'
import { AppWrapper } from '@components/utils/AppContext'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

const { chains, provider, webSocketProvider } = configureChains([chain.polygon], [
  infuraProvider({ infuraId }),
  publicProvider(),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Lensdrop",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <WagmiConfig client={wagmiClient}>
        <ApolloProvider client={client}>
          <div>
              <Head>
                <title>Lensdrop</title>
                <link rel="shortcut icon" href="/air-hot-balloon.png" />
                <meta property="og:title" content="Lensdrop" />
                <meta property="og:image" content="/air-hot-balloon.png" />
                <meta property="og:description" content="Airdrop tokens to your Lens protocol followers with Lensdrop" />
                <meta property="og:url" content="https://lensdrop.xyz" />

                <meta property="twitter:title" content="Lensdrop" />
                <meta property="twitter:site" content="@tjelailah" />
                <meta property="twitter:image" content="/air-hot-balloon.png" />
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:description" content="Airdrop tokens to your Lens protocol followers with Lensdrop" />
              </Head>
              <Component {...pageProps} />
              <Footer />
          </div>
        </ApolloProvider>
      </WagmiConfig>
    </AppWrapper>
  )
  
}

export default MyApp
