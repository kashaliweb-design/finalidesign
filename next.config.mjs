/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://srv746619.hstgr.cloud/api/:path*",
      },
    ];
  },
};

export default nextConfig;
