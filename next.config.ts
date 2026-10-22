import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/webp"],
    remotePatterns: supabaseHostname
      ? [{ protocol: "https" as const, hostname: supabaseHostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  async headers() {
    return [
      {
        // Scoped to the live hub: only YouTube may be framed here, the page may
        // not be framed by other sites, and plugins/base-URI hijacking are off.
        // Scripts are deliberately not restricted, so Next.js hydration and the
        // site's existing inline JSON-LD keep working without nonces.
        source: "/live",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
              "child-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join("; "),
          },
          // YouTube embeds require a Referer (missing referrers cause player error 153).
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/heritage/land-and-landscap",
        destination: "/heritage/land-and-landscape",
        permanent: true,
      },
      {
        source: "/families/contribute",
        destination: "/families",
        permanent: true,
      },
      {
        source: "/oriki/contribute",
        destination: "/oriki",
        permanent: true,
      },
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
