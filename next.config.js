/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/beejhealth' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/beejhealth' : ''
}

module.exports = nextConfig