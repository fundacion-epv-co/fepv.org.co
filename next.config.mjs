/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Requerido para GitHub Pages con repositorio de proyecto (no usuario)
  basePath: '/fundacion.epv.co.github.io',
  assetPrefix: '/fundacion.epv.co.github.io/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
