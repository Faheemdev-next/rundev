//** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'pictures-storage.storage.eu-north1.nebius.cloud',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  