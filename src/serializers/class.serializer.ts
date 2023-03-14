import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

export function ClassSerializer(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private obj: any) {}
    intercept(
        context: ExecutionContext,
        handler: CallHandler,
    ): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(this.obj, data);
            }),
        );
    }
}
