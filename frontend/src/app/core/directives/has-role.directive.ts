import { Directive, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private requiredRoles: string[] = [];

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService,
  ) {
    effect(() => {
      const roles = this.auth.currentUserRoles();
      this.updateView(roles);
    });
  }

  @Input() set hasRole(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView(this.auth.currentUserRoles());
  }

  private updateView(currentRoles: string[]): void {
    const hasAccess = this.requiredRoles.length === 0 || currentRoles.some(r => this.requiredRoles.includes(r));
    this.viewContainer.clear();
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
