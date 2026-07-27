import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface Employee {
  id: number; userId: number; employeeId: string; firstName: string; middleName: string; lastName: string;
  phone: string; gender: string; employeeType: string; designationId: number; designationName: string;
  department: string; active: boolean;
}
interface Designation { id: number; name: string; }

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent],
  template: `
    <app-page-header title="Employees" subtitle="Manage university employees">
      <button class="btn btn-gold" (click)="openModal()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Add Employee
      </button>
    </app-page-header>
    <app-data-table [columns]="columns" [rows]="rows()" [page]="currentPage()" [totalPages]="totalPages()" [totalElements]="totalElements()" [loading]="loading()" trackBy="employeeId" emptyTitle="No employees" emptySubtitle="Register your first employee." (pageChange)="loadPage($event)" (rowClick)="openModal($event)" />

    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-panel wide animate-fade-in-up" (click)="$event.stopPropagation()">
          <div class="modal-header"><h2>{{ editing() ? 'Edit' : 'Create' }} Employee</h2><button class="btn-close" (click)="closeModal()"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div>
          <form class="modal-body" (ngSubmit)="save()">
            <div class="form-row">
              <div class="form-group"><label class="form-label">First Name <span class="req">*</span></label><input type="text" class="form-control" [(ngModel)]="form.firstName" name="firstName" required></div>
              <div class="form-group"><label class="form-label">Last Name <span class="req">*</span></label><input type="text" class="form-control" [(ngModel)]="form.lastName" name="lastName" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Phone <span class="req">*</span></label><input type="text" class="form-control" [(ngModel)]="form.phone" name="phone" required placeholder="+880..."></div>
              <div class="form-group"><label class="form-label">Gender <span class="req">*</span></label>
                <select class="form-select" [(ngModel)]="form.gender" name="gender" required>
                  <option value="">Select</option>
                  <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Date of Birth <span class="req">*</span></label><input type="date" class="form-control" [(ngModel)]="form.dateOfBirth" name="dateOfBirth" required></div>
              <div class="form-group"><label class="form-label">Employee Type <span class="req">*</span></label>
                <select class="form-select" [(ngModel)]="form.employeeType" name="employeeType" required>
                  <option value="">Select</option>
                  <option value="ACADEMIC">Academic</option><option value="ADMINISTRATIVE">Administrative</option><option value="CONTRACTUAL">Contractual</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Designation</label>
                <select class="form-select" [(ngModel)]="form.designationId" name="designationId">
                  <option [ngValue]="0">Select</option>
                  @for (d of designations(); track d.id) { <option [ngValue]="d.id">{{ d.name }}</option> }
                </select>
              </div>
              <div class="form-group"><label class="form-label">Department</label><input type="text" class="form-control" [(ngModel)]="form.department" name="department" placeholder="e.g. CSE"></div>
            </div>
            @if (!editing()) {
              <div class="form-group"><label class="form-label">User ID <span class="req">*</span></label><input type="number" class="form-control" [(ngModel)]="form.userId" name="userId" required placeholder="Existing user ID"></div>
            }
            <div class="modal-footer"><button type="button" class="btn btn-ghost" (click)="closeModal()">Cancel</button><button type="submit" class="btn btn-gold" [disabled]="!isValid() || saving()">{{ saving() ? 'Saving...' : (editing() ? 'Update' : 'Create') }}</button></div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10001; }
    .modal-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); width: 90%; max-width: 520px; box-shadow: var(--shadow-lg); animation: fadeInUp 0.3s var(--ease-spring); &.wide { max-width: 560px; } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border); h2 { font-family: var(--font-display); font-size: var(--fs-h3); } }
    .btn-close { background: none; border: none; color: var(--color-text-muted); padding: 4px; cursor: pointer; &:hover { color: var(--color-text-primary); } }
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-label { margin-bottom: 0.375rem; }
    .req { color: var(--color-danger); }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; }
  `],
})
export class EmployeeListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'employeeId', label: 'Emp. ID', sortable: true, width: '110px' },
    { key: 'firstName', label: 'Name', sortable: true },
    { key: 'phone', label: 'Phone', width: '130px' },
    { key: 'employeeType', label: 'Type', width: '110px' },
    { key: 'designationName', label: 'Designation' },
    { key: 'department', label: 'Dept.', width: '100px' },
    { key: 'active', label: 'Status', width: '90px', align: 'center' },
  ];
  rows = signal<Employee[]>([]);
  designations = signal<Designation[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  showModal = signal(false);
  editing = signal<Employee | null>(null);
  saving = signal(false);
  form: any = { userId: 0, firstName: '', middleName: '', lastName: '', phone: '', gender: '', dateOfBirth: '', employeeType: '', designationId: 0, gradeId: 0, department: '' };

  constructor(private crud: CrudService, private toast: ToastService) {}

  ngOnInit(): void {
    this.crud.listAll<Designation>('designations').subscribe({ next: (d) => this.designations.set(d) });
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<Employee>('employees', page, 10).subscribe({
      next: (d) => { this.rows.set(d.content); this.currentPage.set(d.number); this.totalPages.set(d.totalPages); this.totalElements.set(d.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  isValid(): boolean { return this.form.firstName && this.form.lastName && this.form.phone && this.form.gender && this.form.dateOfBirth && this.form.employeeType && (this.editing() || this.form.userId > 0); }

  openModal(item?: Employee): void {
    if (item) {
      this.editing.set(item);
      this.form = { userId: item.userId, firstName: item.firstName, middleName: item.middleName, lastName: item.lastName, phone: item.phone, gender: item.gender, dateOfBirth: '', employeeType: item.employeeType, designationId: item.designationId || 0, gradeId: 0, department: item.department };
    } else {
      this.editing.set(null);
      this.form = { userId: 0, firstName: '', middleName: '', lastName: '', phone: '', gender: '', dateOfBirth: '', employeeType: '', designationId: 0, gradeId: 0, department: '' };
    }
    this.showModal.set(true);
  }
  closeModal(): void { this.showModal.set(false); this.editing.set(null); }

  save(): void {
    if (!this.isValid()) return;
    this.saving.set(true);
    const obs = this.editing() ? this.crud.update('employees', this.editing()!.id, this.form) : this.crud.create('employees', this.form);
    obs.subscribe({
      next: () => { this.toast.success(this.editing() ? 'Updated' : 'Created'); this.closeModal(); this.loadPage(this.currentPage()); this.saving.set(false); },
      error: () => this.saving.set(false),
    });
  }
}
