import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  hasRole(role, user) {
    return user.roles.some((userRole) => userRole === role);
  }
}
