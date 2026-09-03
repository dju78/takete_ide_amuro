import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    remotePatterns: supabaseHostname
      ? [{ protocol: "https" as const, hostname: supabaseHostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        has: [{ type: "host", value: "takete.netlify.app" }],
        destination: "https://takete-ide.org/admin",
        permanent: true,
      },
      {
        source: "/admin/:path*",
        has: [{ type: "host", value: "takete.netlify.app" }],
        destination: "https://takete-ide.org/admin/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
