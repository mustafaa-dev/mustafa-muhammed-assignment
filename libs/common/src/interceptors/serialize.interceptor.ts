import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

export const SerializePaginated = (dto: any) => {
  return UseInterceptors(new SerializePaginatedInterceptor(dto));
};
export const Serialize = (dto: any) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializePaginatedInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return {
          data: plainToInstance(this.dto, data.data, {
            excludeExtraneousValues: true,
          }),
          meta: data.meta,
        };
      }),
    );
  }
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
