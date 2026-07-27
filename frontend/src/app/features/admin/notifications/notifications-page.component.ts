import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt: string;
  createdAt: string;
}

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent, ConfirmDialogComponent],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header title="Notifications" subtitle="View and manage your notifications">
        <button class="btn btn-ghost btn-sm" (click)="markAllAsRead()" [disabled]="!hasUnread() || markingAll()">
          Mark all as read
        </button>
      </app-page-header>

      <div class="card card-elevated">
        <div class="card-body">
          <app-data-table
            [columns]="columns"
            [rows]="rows()"
            [page]="currentPage()"
            [totalPages]="totalPages()"
            [totalElements]="totalElements()"
            [loading]="loading()"
            emptyTitle="No notifications"
            emptySubtitle="You're all caught up!"
            (pageChange)="loadPage($event)"
          />
        </div>
      </div>

      @if (showMarkAllDialog()) {
        <app-confirm-dialog
          title="Mark All as Read"
          message="Are you sure you want to mark all notifications as read?"
          confirmLabel="Mark All"
          type="info"
          (confirm)="doMarkAllAsRead()"
          (cancel)="showMarkAllDialog.set(false)"
        />
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-title { font-family: var(--font-display); font-size: var(--fs-h1); margin-bottom: 0.25rem; }
    .page-subtitle { color: var(--color-text-muted); font-size: var(--fs-small); }
  `],
})
export class NotificationsPageComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'message', label: 'Message', width: '200px' },
    { key: 'createdAt', label: 'Received', width: '120px', align: 'center' },
    { key: 'read', label: 'Status', width: '100px', align: 'center' },
    { key: 'id', label: '', width: '80px', align: 'center' },
  ];

  rows = signal<Notification[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);

  showMarkAllDialog = signal(false);
  markingAll = signal(false);

  constructor(
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<Notification>('notifications', page, 10).subscribe({
      next: (data) => {
        this.rows.set(data.content || []);
        this.currentPage.set(data.number);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  hasUnread(): boolean {
    return this.rows().some(row => !row.read);
  }

  markAllAsRead(): void {
    this.showMarkAllDialog.set(true);
  }

  doMarkAllAsRead(): void {
    this.markingAll.set(true);
    const unreadIds = this.rows().filter(row => !row.read).map(row => row.id);

    if (unreadIds.length === 0) {
      this.showMarkAllDialog.set(false);
      this.markingAll.set(false);
      return;
    }

    const requests = unreadIds.map(id =>
      this.crud.customPost(`notifications/${id}/read`, {})
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.toast.success('All notifications marked as read');
        this.loadPage(this.currentPage());
      },
      error: () => {
        this.toast.error('Failed to mark notifications as read');
      },
      complete: () => {
        this.showMarkAllDialog.set(false);
        this.markingAll.set(false);
      },
    });
  }
}