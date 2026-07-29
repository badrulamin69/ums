import { Component, signal, OnInit , DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface SalaryStructure {
  id: number;
  employeeType: string;
  basicSalary: number;
  hra: number;
  conveyance: number;
  otherAllowances: number;
  epf: number;
  esi: number;
  tax: number;
  effectiveFrom: string;
  effectiveTo: string;
  createdAt: string;
  employeeCount: number;
}

interface SalaryStructureRequest {
  employeeType: string;
  basicSalary: number;
  hra: number;
  conveyance: number;
  otherAllowances: number;
  epf: number;
  esi: number;
  tax: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

@Component({
  selector: 'app-salary-structure-list',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent, ConfirmDialogComponent],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header title="Salary Structures" subtitle="Manage salary components for different employee types">
        <button class="btn btn-gold" (click)="openModal()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Add Salary Structure
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
            emptyTitle="No salary structures found"
            emptySubtitle="Create salary structures for employee types."
            (pageChange)="loadPage($event)"
            (rowClick)="openModal($event)"
          />
        </div>
      </div>

      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-panel animate-fade-in-up" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editing() ? 'Edit' : 'Create' }} Salary Structure</h2>
              <button class="btn-close" (click)="closeModal()">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>

            <form class="modal-body" (ngSubmit)="save()">
              <div class="form-group">
                <label class="form-label">Employee Type <span class="required">*</span></label>
                <select class="form-control" [(ngModel)]="form.employeeType" name="employeeType" required>
                  <option value="">Select type</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="ADMINISTRATIVE">Administrative</option>
                  <option value="CONTRACTUAL">Contractual</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Basic Salary <span class="required">*</span></label>
                  <input type="number" class="form-control" [(ngModel)]="form.basicSalary" name="basicSalary" required [min]="0" step="0.01" placeholder="0.00">
                </div>
                <div class="form-group">
                  <label class="form-label">HRA</label>
                  <input type="number" class="form-control" [(ngModel)]="form.hra" name="hra" [min]="0" step="0.01" placeholder="0.00">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Conveyance</label>
                  <input type="number" class="form-control" [(ngModel)]="form.conveyance" name="conveyance" [min]="0" step="0.01" placeholder="0.00">
                </div>
                <div class="form-group">
                  <label class="form-label">Other Allowances</label>
                  <input type="number" class="form-control" [(ngModel)]="form.otherAllowances" name="otherAllowances" [min]="0" step="0.01" placeholder="0.00">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">EPF</label>
                  <input type="number" class="form-control" [(ngModel)]="form.epf" name="epf" [min]="0" step="0.01" placeholder="0.00">
                </div>
                <div class="form-group">
                  <label class="form-label">ESI</label>
                  <input type="number" class="form-control" [(ngModel)]="form.esi" name="esi" [min]="0" step="0.01" placeholder="0.00">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Tax %</label>
                  <input type="number" class="form-control" [(ngModel)]="form.tax" name="tax" [min]="0" max="100" step="0.01" placeholder="0">
                </div>
                <div class="form-group">
                  <label class="form-label">Effective From <span class="required">*</span></label>
                  <input type="date" class="form-control" [(ngModel)]="form.effectiveFrom" name="effectiveFrom" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Effective To</label>
                <input type="date" class="form-control" [(ngModel)]="form.effectiveTo" name="effectiveTo" placeholder="Leave empty for no end date">
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-gold" [disabled]="!isValid() || saving()">
                  @if (saving()) { <span class="spinner-sm"></span> Saving... } @else { {{ editing() ? 'Update' : 'Create' }} }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (confirmDelete()) {
        <app-confirm-dialog
          title="Delete Salary Structure"
          [message]="'Are you sure you want to deactivate this salary structure for ' + confirmDelete()!.employeeType + '?'"
          confirmLabel="Deactivate"
          type="danger"
          (confirm)="doDelete()"
          (cancel)="confirmDelete.set(null)"
        ></app-confirm-dialog>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-title { font-family: var(--font-display); font-size: var(--fs-h1); margin-bottom: 0.25rem; }
    .page-subtitle { color: var(--color-text-muted); font-size: var(--fs-small); }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px); display: flex; align-items: center;
      justify-content: center; z-index: 10001; animation: fadeIn 0.2s var(--ease-out);
    }
    .modal-panel {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); width: 90%; max-width: 640px;
      box-shadow: var(--shadow-lg); animation: fadeInUp 0.3s var(--ease-spring);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border);
      h2 { font-family: var(--font-display); font-size: var(--fs-h3); }
    }
    .btn-close {
      background: none; border: none; color: var(--color-text-muted); padding: 4px;
      cursor: pointer; border-radius: var(--radius-sm);
      &:hover { color: var(--color-text-primary); background: var(--color-surface-elevated); }
    }
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-label { margin-bottom: 0.375rem; }
    .required { color: var(--color-danger); }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 0.75rem;
      padding-top: 1rem; margin-top: 0.5rem;
    }
    .spinner-sm {
      width: 14px; height: 14px; border: 2px solid transparent;
      border-top-color: currentColor; border-radius: 50%; animation: spin 0.6s linear infinite;
      display: inline-block;
    }
  `],
})
export class SalaryStructureListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'employeeType', label: 'Employee Type', sortable: true, width: '130px', align: 'center' },
    { key: 'basicSalary', label: 'Basic', width: '100px', align: 'right' },
    { key: 'hra', label: 'HRA', width: '100px', align: 'right' },
    { key: 'conveyance', label: 'Conveyance', width: '120px', align: 'right' },
    { key: 'otherAllowances', label: 'Other', width: '120px', align: 'right' },
    { key: 'epf', label: 'EPF', width: '100px', align: 'right' },
    { key: 'esi', label: 'ESI', width: '100px', align: 'right' },
    { key: 'tax', label: 'Tax %', width: '100px', align: 'right' },
    { key: 'effectiveFrom', label: 'Effective From', width: '120px', align: 'center' },
    { key: 'createdAt', label: 'Created', width: '120px', align: 'center' },
    { key: 'id', label: '', width: '80px', align: 'center' },
  ];

  rows = signal<SalaryStructure[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);

  showModal = signal(false);
  editing = signal<SalaryStructure | null>(null);
  saving = signal(false);
  confirmDelete = signal<SalaryStructure | null>(null);

  form: SalaryStructureRequest = {
    employeeType: '',
    basicSalary: 0,
    hra: 0,
    conveyance: 0,
    otherAllowances: 0,
    epf: 0,
    esi: 0,
    tax: 0,
    effectiveFrom: '',
    effectiveTo: '',
  };
  private destroyRef = inject(DestroyRef);

  constructor(
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<SalaryStructure>('salary-structures', page, 10).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  openModal(structure?: SalaryStructure): void {
    if (structure) {
      this.editing.set(structure);
      this.form = {
        employeeType: structure.employeeType,
        basicSalary: structure.basicSalary,
        hra: structure.hra,
        conveyance: structure.conveyance,
        otherAllowances: structure.otherAllowances,
        epf: structure.epf,
        esi: structure.esi,
        tax: structure.tax,
        effectiveFrom: structure.effectiveFrom,
        effectiveTo: structure.effectiveTo || '',
      };
    } else {
      this.editing.set(null);
      this.form = {
        employeeType: '',
        basicSalary: 0,
        hra: 0,
        conveyance: 0,
        otherAllowances: 0,
        epf: 0,
        esi: 0,
        tax: 0,
        effectiveFrom: '',
        effectiveTo: '',
      };
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editing.set(null);
  }

  isValid(): boolean {
    return !!(this.form.employeeType && this.form.basicSalary >= 0 && this.form.effectiveFrom);
  }

  save(): void {
    if (!this.isValid()) return;
    this.saving.set(true);

    const obs = this.editing()
      ? this.crud.update<SalaryStructureRequest>('salary-structures', this.editing()!.id, this.form)
      : this.crud.create<SalaryStructureRequest>('salary-structures', this.form);

    obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success(this.editing() ? 'Salary structure updated' : 'Salary structure created');
        this.closeModal();
        this.loadPage(this.currentPage());
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  doDelete(): void {
    const structure = this.confirmDelete();
    if (!structure) return;

    this.crud.delete('salary-structures', structure.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success('Salary structure deactivated');
        this.confirmDelete.set(null);
        this.loadPage(this.currentPage());
      },
    });
  }
}