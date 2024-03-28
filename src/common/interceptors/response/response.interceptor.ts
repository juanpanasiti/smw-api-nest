import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Query } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // TODO: renew token if is close to expire
        return {
          data,
          success: true,
        };
      }),
      catchError((err) => {
        console.log('err');
        err.response['success'] = false;
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
}
