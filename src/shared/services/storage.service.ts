import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class StorageService {
    private readonly logger: Logger = new Logger('StorageService');

    constructor(private redisService: RedisService) {}
}
