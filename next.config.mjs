/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.180.167'],
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}
