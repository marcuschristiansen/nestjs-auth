import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Rejson from 'iorejson';

@Injectable()
export class RedisService {
    private rejson: any;
    private readonly logger: Logger = new Logger('RedisService');

    constructor(private configService: ConfigService) {
        const scheme: string = this.configService.get<string>('redis.scheme');
        const host: string = this.configService.get<string>('redis.host');
        const port: string = this.configService.get<string>('redis.port');
        const password: string = this.configService.get<string>('redis.password');
        const url = `${scheme}://:${password}@${host}:${port}`;

        this.logger.log(`Connecting to redis: ${host}`);

        this.rejson = new Rejson(url);
        this.rejson.connect();
    }

    async get(key: string, path = '.'): Promise<any> {
        this.logger.log(`get ${key} ${path}`);
        return this.rejson
            .get(key, path)
            .catch(() => this.catchError(`get: could not get ${key} ${path}`));
    }

    async set(
        key: string,
        value: string | number | boolean | any | Array<any>,
        path = '.'
    ): Promise<boolean> {
        this.logger.log(`set ${key} ${path} ${value}`);
        return this.rejson
            .set(key, path, value)
            .catch(() => this.catchError(`set: could not set ${key} ${path}`));
    }

    async mget(key: string[], path = '.'): Promise<any> {
        return this.rejson.mget(...key, path);
    }

    async delete(key: string, path = '.'): Promise<boolean> {
        this.logger.log(`del ${key} ${path}`);
        return this.rejson
            .del(key, path)
            .catch(() => this.catchError(`del: could not delete ${key} ${path}`));
    }

    private async catchError(message: string): Promise<boolean> {
        this.logger.log(message);
        return Promise.resolve(false);
    }
}
