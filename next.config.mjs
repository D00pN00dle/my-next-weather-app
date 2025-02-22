/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'build',
    basePath: '/my-next-weather-app',
    assetPrefix: '/my-next-weather-app/',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
