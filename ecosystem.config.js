/* eslint-disable @typescript-eslint/parser */
module.exports = {
    apps: [
        {
            name: 'e-voucher-server',
            script: 'yarn start:dev',
            time: true,
            instances: 1,
            autorestart: true,
            max_restarts: 50,
            watch: false,
            max_memory_restart: '1G',
            env: {
            },
        },
    ],
    deploy: {
        production: {
            user: 'user',
            host: '0.0.0.0',
            ref: 'origin/master',
            repo: 'git@github.com:repo.git',
            path: './',
            'post-deploy':
                'yarn install && yarn run build:dev && pm2 reload ecosystem.config.js --env production --only e-voucher-server',
            env: {
                PORT: 6968,
            },
        },
    },
}
