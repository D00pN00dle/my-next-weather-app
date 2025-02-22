/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Ensures Next.js builds a static export
    basePath: process.env.NODE_ENV === 'production' ? '/my-next-weather-app' : '', // Conditionally set for production
    assetPrefix: process.env.NODE_ENV === 'production' ? '/my-next-weather-app/' : '', // Conditionally set for production
    trailingSlash: true, // Adds trailing slashes to URLs
    images: {
      unoptimized: true,
    },
  };
  
  export default nextConfig;

