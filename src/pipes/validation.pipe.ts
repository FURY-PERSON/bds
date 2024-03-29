import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if(!value) {
            return undefined
        }

        if (metadata.type === 'param') {
            return typeof value === 'object' ? value[Object.keys(value)[0]] : value
        }

        let obj = plainToInstance(metadata.metatype!, value);

        if (metadata.type === 'query') { 
            return value;
        } 
        if(obj?.buffer) {
            return obj
        }
        const errors = await validate(obj, {forbidUnknownValues: false, skipUndefinedProperties: true});

        if (errors.length) {
            const messages = errors.map((err) => {
                return `${err.property} - ${Object.values(
                    err.constraints!,
                ).join(', ')}`;
            });
            throw new ValidationException(messages.join('. '));
        }
        return value;
    }
}
