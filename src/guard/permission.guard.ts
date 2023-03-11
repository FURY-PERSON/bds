import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PERMISSIONS_KEY } from "src/decorators/permissions.decorator";

@Injectable()
export default class PermissionGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private reflector: Reflector
    ) {

    }

    canActivate(context: ExecutionContext) {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass()
      ]);

      if(!requiredPermissions) {
        return true
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

        for(let i=0; i<requiredPermissions.length; i++) {
          if(!user.permissions.some((permission) => {
            return permission.name === requiredPermissions[i]
          })) return false
        }

        return true
      } catch(error) {
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
      }
    }
}
