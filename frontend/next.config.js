// Emmanuel Aro's project submission for evaluation.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Move the dev-mode indicator out of the bottom-left corner so it doesn't
  // overlap the persistent sidebar's user card.
  devIndicators: {
    appIsrStatus: false,
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
  experimental: {
    typedRoutes: false,
  },
};

module.exports = nextConfig;
