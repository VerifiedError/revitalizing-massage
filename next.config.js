/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'square-web-production-f.squarecdn.com',
      },
    ],
  },
  // Empty turbopack config to acknowledge Turbopack usage
  turbopack: {},
}

module.exports = nextConfig
