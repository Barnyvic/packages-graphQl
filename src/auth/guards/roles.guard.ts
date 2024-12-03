import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../../users/enums/role.enum';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const user = gqlContext.getContext().req.user;

    // Handle both role and roles properties
    const userRoles = user?.roles || (user?.role ? [user.role] : []);

    if (!user || !userRoles.length) {
      return false;
    }

    const hasRole = this.matchRoles(requiredRoles, userRoles);

    return hasRole;
  }

  private matchRoles(requiredRoles: Role[], userRoles: Role[]): boolean {
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
