const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  }
};

module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET' }
        ]
      }
    ]
  }
}