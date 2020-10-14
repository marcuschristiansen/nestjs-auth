import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
    private readonly logger = new Logger('AppController');

    constructor(private readonly appService: AppService) {}

    @Get('/')
    isAlive(): string {
        return this.appService.isAlive();
    }

    @MessagePattern('unknown')
    getNotifications(@Payload() data: any) {
        this.logger.verbose('Received an unknown message: ' + data);
    }
}
