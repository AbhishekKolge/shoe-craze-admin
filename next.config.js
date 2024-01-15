const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_URL: 'https://shoe-craze-server.onrender.com/api/v1',
    EMAIL: 'test-admin@gmail.com',
    PASSWORD: 'Test@123',
    ACCESS_EXPIRATION_TIME: '3600000',
    TIME_BUFFER: '300000',
    ENV: 'production',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
