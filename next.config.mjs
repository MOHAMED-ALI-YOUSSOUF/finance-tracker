/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        dangerouslyAllowSVG:true,
        remotePatterns:[{
          protocol:"https",
          hostname:"*"
        }]
      },
      ignoreall:true
};

export default nextConfig;
