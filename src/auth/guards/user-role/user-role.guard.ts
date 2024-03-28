import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { META_ROLES } from '../../decorators';
import { User } from '../../../auth/entities/user.entity';
import { HandleAuthErrors } from '../../../common/error-handlers';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) HandleAuthErrors.userNotFoundInRequest();

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    HandleAuthErrors.userForbiddenAccess();
  }
}
