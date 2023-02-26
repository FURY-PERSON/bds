import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export default class JwtAuthenticationGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
        ) {

    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;
        const bearer = authHeader?.split(' ')[0];
        const token = authHeader?.split(' ')[1];

        if(bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('User unauthorized')
        }

        try {
            const user = this.jwtService.verify(token);
            request.user = user;
        } catch(error) {
            throw new UnauthorizedException(`token: ${error.message}`)
        }

        return true;
    }
}
