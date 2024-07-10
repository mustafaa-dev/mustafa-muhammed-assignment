import { LoggerService } from '@app/services';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = process.hrtime.bigint();
    const handler = context.getHandler();
    const controllerName = context.getClass().name;
    const handlerName = handler.name;
    const req = context.switchToHttp().getRequest();
    const sanitizedReq = {
      method: req.method,
      url: req.url,
      body: req.body,
      query: req.query,
      params: req.params,
    };

    this.logger.debug(
      `${handlerName} | Request: ${JSON.stringify(sanitizedReq)}`,
      {
        context: `${controllerName} :: Request`,
      },
    );

    return next.handle().pipe(
      tap((response) => {
        const sanitizedRes = {
          status: response.statusCode,
          data: response,
        };
        this.logger.debug(
          `${handlerName} | Response: ${JSON.stringify(sanitizedRes)} | Took : ${
            (process.hrtime.bigint() - now) / BigInt(1000)
          }μs`,
          { context: `${controllerName} :: Response` },
        );
      }),
      catchError((error) => {
        this.logger.error(`${handlerName} | Error: ${error.message}`, {
          context: `${controllerName} :: Error`,
        });
        throw error;
      }),
    );
  }
}
