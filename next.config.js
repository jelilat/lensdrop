/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.infura.io', '', 'arweave.net', 'lenster.xyz', 'lens.infura-ipfs.io']
  }
}

module.exports = nextConfig
