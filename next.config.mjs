/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // Wildcard for any domain
            },
        ],
    }
};

export default nextConfig;
