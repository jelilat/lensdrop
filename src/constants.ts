// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === 'true'

export const APP_NAME = 'Lensdrop'
export const DESCRIPTION =
  'Lensdrop is an app that helps you gain more followers and boost engagements on Lens Protocol 🌿'
export const DEFAULT_OG = '/lensblog.png'

// Misc
export const CONTACT_EMAIL = 'support@lensdrop.xyz'
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

export const ERRORS = {
  notMined:
    'A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.'
}

// Addresses
export const MULTISENDER_ADDRESS = "0x36a98Bfbd74361D8062c7d4B9532bD1172942143"
export const LENSDROP_CONTRACT_ADDRESS = "0xA84b97DF8eE0aF62777dAC4EDC488694f5000184"
