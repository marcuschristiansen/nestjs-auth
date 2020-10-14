import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { InboundRabbitMqDeserializer } from './shared/common/rabbitmq.deserializer';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.useGlobalPipes(new ValidationPipe());

    const configService: ConfigService = app.get(ConfigService);
    const port = configService.get<string>('port');

    const host: string = configService.get<string>('rabbitmq.host');
    const user: string = configService.get<string>('rabbitmq.user');
    const password: string = configService.get<string>('rabbitmq.password');
    const rabbitMqUrl = `amqp://${user}:${password}@${host}`;
    Logger.log(`Connecting to rabbitmq: ${rabbitMqUrl}`);

    await app.listen(port, () => {
        return Logger.log(`Server running on ${port}`);
    });

    // Connect Rabbit MQ
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [rabbitMqUrl],
            queue: configService.get<string>('rabbitmq.queueName'),
            deserializer: new InboundRabbitMqDeserializer(),
        },
    });

    await app
        .startAllMicroservicesAsync()
        .catch((err) => Logger.error('${SERVICE_NAME} not running. [RABBIT]'));
}

bootstrap();
