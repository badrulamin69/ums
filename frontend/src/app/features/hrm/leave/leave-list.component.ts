import { Component, signal, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface LeaveRequest {
  id: number; employeeId: number; employeeName: string; leaveType: string;
  startDate: string; endDate: string; reason: string; status: string;
}

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [PageHeaderComponent, DataTableComponent],
  template: `
    <app-page-header title="Leave Requests" subtitle="Manage employee leave applications" />

    <app-data-table
      [columns]="columns"
      [rows]="rows()"
      [page]="currentPage()"
      [totalPages]="totalPages()"
      [totalElements]="totalElements()"
      [loading]="loading()"
      emptyTitle="No leave requests"
      emptySubtitle="Leave requests will appear here."
      (pageChange)="loadPage($event)"
    />
  `,
  styles: [`:host { display: block; max-width: 1200px; }`],
})
export class LeaveListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'employeeName', label: 'Employee', sortable: true },
    { key: 'leaveType', label: 'Type', sortable: true, width: '120px' },
    { key: 'startDate', label: 'Start', width: '120px' },
    { key: 'endDate', label: 'End', width: '120px' },
    { key: 'reason', label: 'Reason' },
    { key: 'status', label: 'Status', width: '110px', align: 'center' },
  ];
  rows = signal<LeaveRequest[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);

  constructor(private crud: CrudService, private toast: ToastService) {}
  ngOnInit(): void { this.loadPage(0); }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<LeaveRequest>('leave-requests', page, 10).subscribe({
      next: (d) => { this.rows.set(d.content); this.currentPage.set(d.number); this.totalPages.set(d.totalPages); this.totalElements.set(d.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
