/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Requerido para GitHub Pages con repositorio de proyecto (no usuario)
  basePath: '/fepv.org.co',
  assetPrefix: '/fepv.org.co/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
