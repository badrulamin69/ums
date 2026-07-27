import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-faculty-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <app-sidebar [collapsed]="sidebarCollapsed()" />
    <app-navbar (toggleSidebar)="sidebarCollapsed.set(!sidebarCollapsed())" />
    <main class="main-content" [class.sidebar-collapsed]="sidebarCollapsed()">
      <router-outlet />
    </main>
  `,
  styles: [`
    .main-content {
      margin-left: var(--sidebar-width);
      margin-top: var(--navbar-height);
      padding: var(--content-padding);
      min-height: calc(100vh - var(--navbar-height));
      transition: margin-left var(--duration-normal) var(--ease-out);
    }

    .main-content.sidebar-collapsed {
      margin-left: var(--sidebar-collapsed);
    }

    @media (max-width: 768px) {
      .main-content { margin-left: 0; }
    }
  `],
})
export class FacultyLayoutComponent {
  sidebarCollapsed = signal(false);
}
