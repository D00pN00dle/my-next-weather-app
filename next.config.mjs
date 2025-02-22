/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Ensures Next.js builds a static export
    trailingSlash: true, // Adds trailing slashes to URLs
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
