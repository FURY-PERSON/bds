import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "src/decorators/roles.decorator";

@Injectable()
export default class RoleGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private reflector: Reflector
    ) {

    }

    canActivate(context: ExecutionContext) {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]);

      if(!requiredRoles) {
        return false
      }

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
        return user.roles.some((role) => requiredRoles.includes(role.name));
      } catch(error) {
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
      }
    }
}
