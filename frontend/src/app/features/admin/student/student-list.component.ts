import { Component, signal, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { CrudService } from '../../../core/services/crud.service';

interface Student {
  id: number; userId: number; registrationNumber: string; firstName: string;
  middleName: string; lastName: string; cgpa: number; active: boolean;
  name?: string;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [PageHeaderComponent, DataTableComponent],
  template: `
    <app-page-header title="Students" subtitle="Manage enrolled students" />
    <app-data-table
      [columns]="columns"
      [rows]="rows()"
      [page]="currentPage()"
      [totalPages]="totalPages()"
      [totalElements]="totalElements()"
      [loading]="loading()"
      trackBy="registrationNumber"
      emptyTitle="No students enrolled"
      emptySubtitle="Students appear here after enrollment from the admission process."
      (pageChange)="loadPage($event)"
    />
  `,
  styles: [`
    :host { display: block; max-width: 1200px; }
  `],
})
export class StudentListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'registrationNumber', label: 'Reg. No.', sortable: true, width: '140px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'cgpa', label: 'CGPA', width: '80px', align: 'center' },
    { key: 'active', label: 'Status', width: '100px', align: 'center' },
  ];
  rows = signal<Student[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);

  constructor(private crud: CrudService) {}
  ngOnInit(): void { this.loadPage(0); }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<Student>('students', page, 10).subscribe({
      next: (d) => {
        const students = (d.content || []).map(s => ({
          ...s,
          name: [s.firstName, s.middleName, s.lastName].filter(Boolean).join(' '),
        }));
        this.rows.set(students);
        this.currentPage.set(d.number);
        this.totalPages.set(d.totalPages);
        this.totalElements.set(d.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
