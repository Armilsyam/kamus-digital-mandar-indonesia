/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: isGithubActions ? '/kamus-digital-mandar-indonesia' : '',
  trailingSlash: true,
};

export default nextConfig;
