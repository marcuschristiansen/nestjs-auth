import {
    Catch,
    RpcExceptionFilter,
    ArgumentsHost,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(BadRequestException)
export class MqExceptionFilter implements RpcExceptionFilter<RpcException> {
    private readonly logger: Logger = new Logger('MqExceptionFilter');

    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        this.logger.error(exception.message);
        return throwError(exception.message);
    }
}
