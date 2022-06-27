import { chain } from 'wagmi'

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === 'true'

export const APP_NAME = 'Lensdrop'
export const DESCRIPTION =
  'Lensblogger is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿'
export const DEFAULT_OG = '/lensblogger.png'

// Git
export const GIT_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
export const GIT_COMMIT_REF = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF

// Misc
export const CONTACT_EMAIL = 'support@Lensdrop.xyz'
export const PUBLIC_URL = process.env.NEXT_PUBLIC_URL
export const RELAY_ON =
  PUBLIC_URL === 'https://Lensdrop.xyz' || PUBLIC_URL === 'http://localhost:4783'
    ? process.env.NEXT_PUBLIC_RELAY_ON === 'true'
    : false

// Messages
export const ERROR_MESSAGE = 'Something went wrong!'
export const CONNECT_WALLET = 'Please connect your wallet.'
export const WRONG_NETWORK = IS_MAINNET
  ? 'Please change network to Polygon mainnet.'
  : 'Please change network to Polygon Mumbai testnet.'
export const SIGN_ERROR = 'Failed to sign data'

// URLs
export const STATIC_ASSETS = ''
export const API_URL = 
// IS_MAINNET
  'https://api.lens.dev' 
  //  'https://api-mumbai.lens.dev'
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com'
export const RARIBLE_URL = IS_MAINNET
  ? 'https://rarible.com'
  : 'https://rinkeby.rarible.com'
export const IMAGEKIT_URL_PROD = ''
export const IMAGEKIT_URL_DEV = ''
export const IMAGEKIT_URL = IS_PRODUCTION ? IMAGEKIT_URL_PROD : IMAGEKIT_URL_DEV

// Web3
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
export const ALCHEMY_RPC = IS_MAINNET
  ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
  : `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`
export const POLYGON_MAINNET = {
  ...chain.polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' }
}
export const POLYGON_MUMBAI = {
  ...chain.polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' }
}
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id

export const ERRORS = {
  notMined:
    'A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.'
}

// Addresses
export const MULTISENDER_ADDRESS = "0x1dc04843b4B05556D8cc2587F94Ea91f016c04B6"
