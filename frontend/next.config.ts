import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: {
        buildActivity: false,
        buildActivityPosition: 'bottom-right',
    },
    // Alternative: completely disable dev indicators
    // devIndicators: false,
};

export default nextConfig;