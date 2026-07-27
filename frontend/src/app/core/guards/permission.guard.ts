import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Permission } from '../enums/permission.enum';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredPermissions = (route.data['permissions'] as Permission[]) ?? [];

  if (requiredPermissions.length === 0) return true;

  const decoded = auth.getDecodedToken();
  if (!decoded) {
    router.navigate(['/login']);
    return false;
  }

  const userRoles = decoded.roles ?? [];
  const hasPermission = requiredPermissions.some((p) => {
    return userRoles.some((role) => {
      const rolePrefix = role.replace('ROLE_', '');
      return p.toUpperCase().includes(rolePrefix) || rolePrefix === 'ADMIN';
    });
  });

  if (hasPermission) return true;

  router.navigate(['/login']);
  return false;
};
