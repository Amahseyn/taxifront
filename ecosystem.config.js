const path = require('path');

module.exports = {
  apps: [
    {
      name: 'taxifront',
      script: 'npm',
      args: 'run start',
      cwd: path.resolve(__dirname),
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};

