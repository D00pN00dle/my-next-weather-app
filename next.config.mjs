/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Ensures Next.js builds a static export
    distDir: 'build', // Changes the build directory to build
    basePath: '/my-next-weather-app', // Conditionally set for production
    assetPrefix: '/my-next-weather-app/', // Conditionally set for production
    trailingSlash: true, // Adds trailing slashes to URLs
    images: {
      unoptimized: true,
    },
  };
  
  export default nextConfig;

