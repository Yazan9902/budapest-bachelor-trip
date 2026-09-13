import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryPath = '/budapest-bachelor-trip';

const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  basePath: '',
  assetPrefix: isGitHubPages ? repositoryPath : '',
  trailingSlash: isGitHubPages,
};

export default nextConfig;
