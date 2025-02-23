/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    basePath: '/my-next-weather-app',
    assetPrefix: '/my-next-weather-app/',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
