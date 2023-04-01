import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "src/decorators/permissions.decorator";
import { UsersService } from "src/users/users.service";

@Injectable()
export default class PermissionGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private userService: UsersService
    ) {

    }

    async canActivate(context: ExecutionContext) {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass()
      ]);

      if(!requiredPermissions) {
        return true
      }

      const request = context.switchToHttp().getRequest();
      const {login} = request.user;
      const user = await this.userService.getByLogin(login);

      try {

        for(let i=0; i<requiredPermissions.length; i++) {
          if(!user.permissions.some((permission) => {
            return permission.name === requiredPermissions[i]
          })) {
            throw new ForbiddenException('Not enought permissions')
          }
        }

        return true
      } catch(error) {
        throw new ForbiddenException('Not enought permissions')
      }
    }
}
