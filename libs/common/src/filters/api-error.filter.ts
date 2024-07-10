import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '@app/services';

@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  sendErrorDevelopment = (exception: any, err: any, response: any) => {
    const status = +err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      env: process.env.NODE_ENV,
      statusCode: err.status,
      timestamp: new Date().toISOString(),
      productionMsg: err.message,

      error: exception,
    });
  };

  sendErrorProduction = (err: any, req: any, response: any) => {
    response.status(err.status).json({
      statusCode: err.status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: err.message,
    });
  };
  handleDuplicateError = (exception: any, request: any) => {
    const body = request.body;

    const status = HttpStatus.CONFLICT;
    const message = `${exception.driverError.detail.split('(')[1].split(')')[0]} ${
      exception.driverError.detail.split('=(')[1].split(')')[0]
    } already exists`;
    return { message, status };
  };

  handleTypeError = (exception: any) => {
    const status = HttpStatus.NOT_ACCEPTABLE;
    const message = exception.message;
    return { message, status };
  };

  handleHttpError = (exception: any) => {
    let message: any;
    if (typeof exception.response.message === 'string') {
      message = exception.response.message;
    } else {
      message = [...exception.response.message].join(', ');
    }
    const status = exception.getStatus();
    return { message, status };
  };

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let error = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    if (exception?.driverError?.code === '23505') {
      error = this.handleDuplicateError(exception, request);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpError(exception);
    } else if (exception instanceof TypeError) {
      error = this.handleTypeError(exception);
    }

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
      return this.sendErrorDevelopment(exception, error, response);
    } else return this.sendErrorProduction(error, request, response);
  }
}
