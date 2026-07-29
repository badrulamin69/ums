import { Component, signal, OnInit , DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  designationName: string;
  gradeName: string;
  departmentName: string;
  dateOfBirth: string;
  gender: string;
  joiningDate: string;
  employmentType: string;
  active: boolean;
}

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [PageHeaderComponent, RouterLink],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header [title]="employee()?.name || 'Employee Detail'" subtitle="Employee profile and details">
        <a class="btn btn-ghost" routerLink="/hrm/employees">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Back to List
        </a>
      </app-page-header>

      @if (loading()) {
        <div class="card card-elevated">
          <div class="card-body">
            <div class="skeleton-grid">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="skeleton-field">
                  <div class="skeleton" style="height:12px;width:80px;margin-bottom:8px"></div>
                  <div class="skeleton" style="height:36px;width:100%"></div>
                </div>
              }
            </div>
          </div>
        </div>
      } @else if (employee()) {
        <div class="detail-grid">
          <div class="card card-elevated animate-fade-in-up stagger-1">
            <div class="card-header"><h3>Personal Information</h3></div>
            <div class="card-body">
              <div class="field-grid">
                <div class="field">
                  <span class="field-label">Full Name</span>
                  <span class="field-value">{{ employee()!.name }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Email</span>
                  <span class="field-value">{{ employee()!.email }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Phone</span>
                  <span class="field-value">{{ employee()!.phone || '--' }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Date of Birth</span>
                  <span class="field-value">{{ employee()!.dateOfBirth || '--' }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Gender</span>
                  <span class="field-value">{{ employee()!.gender || '--' }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Status</span>
                  <span class="badge" [class]="employee()!.active ? 'badge-success' : 'badge-danger'">
                    {{ employee()!.active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="card card-elevated animate-fade-in-up stagger-2">
            <div class="card-header"><h3>Employment Information</h3></div>
            <div class="card-body">
              <div class="field-grid">
                <div class="field">
                  <span class="field-label">Designation</span>
                  <span class="field-value text-gold" style="font-weight:600">{{ employee()!.designationName || '--' }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Grade</span>
                  <span class="field-value">{{ employee()!.gradeName || '--' }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Department</span>
                  <span class="field-value">{{ employee()!.departmentName || '--' }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Employment Type</span>
                  <span class="field-value">{{ employee()!.employmentType || '--' }}</span>
                </div>
                <div class="field">
                  <span class="field-label">Joining Date</span>
                  <span class="field-value">{{ employee()!.joiningDate || '--' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="card card-elevated">
          <div class="card-body">
            <div class="empty-state"><p>Employee not found.</p></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 900px; }
    .detail-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .field { display: flex; flex-direction: column; gap: 0.375rem; }
    .field-label { font-size: var(--fs-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .field-value { font-size: var(--fs-body); color: var(--color-text-primary); padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); }
    .skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .skeleton-field { display: flex; flex-direction: column; }
    .empty-state { text-align: center; padding: 2rem; color: var(--color-text-muted); font-size: var(--fs-small); }
    .text-gold { color: var(--color-gold); }
    @media (max-width: 640px) { .field-grid, .skeleton-grid { grid-template-columns: 1fr; } }
  `],
})
export class EmployeeDetailComponent implements OnInit {
  employee = signal<Employee | null>(null);
  loading = signal(true);
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(+id);
    } else {
      this.loading.set(false);
    }
  }

  loadEmployee(id: number): void {
    this.crud.getById<Employee>('employees', id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.employee.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Failed to load employee');
      },
    });
  }
}
