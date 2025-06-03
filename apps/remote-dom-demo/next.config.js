/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_BASE_PATH ?? "",
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-src * data: blob:; object-src 'self' data:; default-src 'self'; style-src 'self' https://*.mittwald.de 'unsafe-inline'; font-src 'self' https://cdn.mittwald.de data:; connect-src *; img-src 'self' https://*.mittwald.de https://*.mittwald.systems data:; script-src 'self' 'sha256-MS6/3FCg4WjP9gwgaBGwLpRCY6fZBgwmhVCdrPrNf3E=' 'sha256-tQjf8gvb2ROOMapIxFvFAYBeUJ0v1HCbOcSmDNXGtDo=' 'sha256-4y/gEB2/KIwZFTfNqwXJq4olzvmQ0S214m9jwKgNXoc=' 'sha256-+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc='; frame-ancestors https://*.mittwald.de https://*.mittwald.systems https://*.mittwald.it http://localhost:3000",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value:
              "accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(self), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(self), screen-wake-lock=(self), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
