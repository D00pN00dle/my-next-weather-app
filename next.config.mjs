/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Ensures Next.js builds a static export
    basePath: '/my-next-weather-app', // Set to your GitHub repo name (case-sensitive)
    assetPrefix: '/my-next-weather-app/', // Base path for Next.js app
    trailingSlash: true, // Adds trailing slashes to URLs
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
