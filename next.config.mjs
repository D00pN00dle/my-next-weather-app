/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Ensures Next.js builds a static export
    basePath: '/my-next-weather-app', // GitHub Pages serve from a subdirectory
    assetPrefix: '/my-next-weather-app/', // Needed for loading assets correctly
    trailingSlash: true, // Adds trailing slashes to URLs
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
