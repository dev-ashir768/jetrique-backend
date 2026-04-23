module.exports = {
  apps: [
    {
      name: 'jetrique-backend',
      script: 'dist/server.js',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',

      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
  ],
};
