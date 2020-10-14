export default () => ({
    port: parseInt(process.env.PORT, 10) || 8082,
    'worker-access-token': 'WG9W2ZpDBDSJmr3Ay8pxIGXvphhBpDBeKpDSJmr3Ay8pLOJmmskjHx',
    api_url: 'https://testenv.usln.rocks',
    rabbitmq: {
        host: process.env.RABBIT_MQ_HOST || 'localhost',
        queueName: process.env.RABBIT_MQ_QUEUENAME || '${QUEUE}',
        port: process.env.RABBIT_MQ_PORT || '5672',
        user: process.env.RABBIT_MQ_USR,
        password: process.env.RABBIT_MQ_PW,
    },
    postgres: {
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || '5432',
        username: process.env.POSTGRES_USERNAME || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DATABASE || 'service-auth',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
    },
    azure: {
        storage: {
            key: process.env.AZURE_STORAGE_KEY || '${STORAGE_KEY}',
            account: process.env.AZURE_STORAGE_USR || '${STORAGE_NAME}',
        },
    },
});
