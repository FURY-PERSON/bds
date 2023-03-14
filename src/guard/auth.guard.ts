import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Exception } from 'src/exceptions/types/exception';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest<TUser extends User>(err: Exception, user: TUser) {
        if (err || !user) {
            throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
        }
        return user;
    }
}
