import { ConsumerDeserializer, IncomingRequest } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

/**
 * This deserializer is responsible for mapping our message format
 * to the nest format. Nest.js requires a pattern (for identifying
 * the message) as well as a data object:
 * {
 *   pattern: <messageType>,
 *   data: <dataObject>
 * }
 * See: https://dev.to/nestjs/integrate-nestjs-with-external-services-using-microservice-transporters-part-3-4m20
 */
export class InboundRabbitMqDeserializer implements ConsumerDeserializer {
    private readonly logger = new Logger('InboundRabbitMqDeserializer');

    deserialize(value: any, options?: Record<string, any>): IncomingRequest {
        this.logger.verbose(
            `<<-- deserializing inbound message:\n${JSON.stringify(
                value
            )}\n\twith options: ${JSON.stringify(options)}`
        );
        return { ...value };
    }
}
