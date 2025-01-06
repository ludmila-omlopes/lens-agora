/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.gw.ipfs-lens.dev',
        pathname: '**',
      },
    ],
    domains: ['ik.imagekit.io', '**.gw.ipfs-lens.dev', '**.ipfscdn.io'],
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    // Handle node: scheme for URL
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'node:url': 'url'
      },
      fallback: {
        ...config.resolve.fallback,
        url: require.resolve('url')
      }
    }

    return config
  },
}

module.exports = nextConfig