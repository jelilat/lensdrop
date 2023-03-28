/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ipfs.infura.io', 
      '', 
      'arweave.net', 
      'lenster.xyz', 
      'lens.infura-ipfs.io',
      'ipfs.io',
      'cdn.stamp.fyi',
      'lensdrop.infura-ipfs.io',
      'images.lens.phaver.com',
    ]
  }
}

module.exports = nextConfig
