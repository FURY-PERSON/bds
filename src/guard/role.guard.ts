import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { UsersService } from "src/users/users.service";

@Injectable()
export default class RoleGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private userService: UsersService
    ) {

    }

    async canActivate(context: ExecutionContext) {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]);

      if(!requiredRoles) {
        return true
      }

      const request = context.switchToHttp().getRequest();

      const {login} = request.user;
      const user = await this.userService.getByLogin(login);

      try {
        return user.roles.some((role) => requiredRoles.includes(role.name));
      } catch(error) {
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
      }
    }
}
