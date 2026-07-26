import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmService } from '../../../services/hrm.service';
import { EmployeeResponse } from '../../../models/hrm.model';
import { EmployeeFormComponent } from './employee-form.component';

@Component({
  selector: 'app-employee-directory',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormComponent],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Employee Directory</h1>
        <p>Manage and view all university employees</p>
      </div>

      <div class="toolbar">
        <input type="text" class="form-input search-input" placeholder="Search employees..."
               [(ngModel)]="searchTerm" (ngModelChange)="filterEmployees()" />
        <select class="form-input filter-select" [(ngModel)]="filterType" (ngModelChange)="filterEmployees()">
          <option value="">All Types</option>
          <option value="ACADEMIC">Academic</option>
          <option value="ADMINISTRATIVE">Administrative</option>
          <option value="CONTRACTUAL">Contractual</option>
        </select>
        <button class="btn btn-accent btn-sm" (click)="showForm=true; editEmployee=null">Add Employee</button>
      </div>

      <div class="table-container" *ngIf="filteredEmployees.length">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Grade</th>
              <th>Type</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of filteredEmployees">
              <td><span class="emp-id">{{e.employeeId}}</span></td>
              <td class="name-cell">
                <div class="emp-name">{{e.firstName}} {{e.middleName ? e.middleName + ' ' : ''}}{{e.lastName}}</div>
                <div class="emp-email">{{e.gender}}</div>
              </td>
              <td>{{e.department || '—'}}</td>
              <td>{{e.designationName || '—'}}</td>
              <td>{{e.gradeName || '—'}}</td>
              <td><span class="badge badge-info">{{e.employeeType}}</span></td>
              <td>{{e.phone}}</td>
              <td>
                <span class="badge" [class]="e.active ? 'badge-success' : 'badge-danger'">
                  {{e.active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="editEmployee=e; showForm=true">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="deactivate(e)" *ngIf="e.active">Deactivate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredEmployees.length === 0">
        <p>{{searchTerm || filterType ? 'No employees match your filters.' : 'No employees found.'}}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading employee directory...</p>
      </div>
    </div>

    <app-employee-form *ngIf="showForm" [editEmployee]="editEmployee" (close)="showForm=false" (saved)="loadEmployees()"></app-employee-form>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar {
      display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center;
    }
    .search-input { max-width: 320px; }
    .filter-select { max-width: 180px; }
    .emp-id { font-family: monospace; font-size: 0.8125rem; font-weight: 500; color: var(--primary); }
    .name-cell { min-width: 180px; }
    .emp-name { font-weight: 500; font-size: 0.875rem; }
    .emp-email { font-size: 0.75rem; color: var(--text-muted); }
    .actions-cell { white-space: nowrap; display: flex; gap: 0.375rem; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
  `],
})
export class EmployeeDirectoryComponent implements OnInit {
  employees: EmployeeResponse[] = [];
  filteredEmployees: EmployeeResponse[] = [];
  loading = true;
  searchTerm = '';
  filterType = '';
  showForm = false;
  editEmployee: EmployeeResponse | null = null;

  constructor(private hrmService: HrmService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.hrmService.getEmployees().subscribe({
      next: (res: any) => {
        this.employees = res.data || [];
        this.filteredEmployees = this.employees;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterEmployees(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter((e: any) => {
      const matchesSearch =
        !term ||
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.employeeId.toLowerCase().includes(term) ||
        (e.department || '').toLowerCase().includes(term);
      const matchesType = !this.filterType || e.employeeType === this.filterType;
      return matchesSearch && matchesType;
    });
  }

  deactivate(e: EmployeeResponse): void {
    if (!confirm(`Deactivate ${e.firstName} ${e.lastName}?`)) return;
    this.hrmService.deactivateEmployee(e.id).subscribe({
      next: () => this.loadEmployees(),
      error: () => {},
    });
  }
}
