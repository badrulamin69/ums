import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CrudService } from '../../../core/services/crud.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  registrationNumber: string;
  enrollmentNumber: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  departmentName: string;
  facultyName: string;
  admissionDate: string;
  active: boolean;
}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header title="My Profile" subtitle="View and manage your profile information" />

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
      } @else if (profile()) {
        <div class="profile-grid">
          <div class="card card-elevated animate-fade-in-up stagger-1">
            <div class="card-header"><h3>Personal Information</h3></div>
            <div class="card-body">
              <div class="field-grid">
                <div class="field">
                  <label class="form-label">Full Name</label>
                  <div class="field-value">{{ profile()!.name }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Email</label>
                  <div class="field-value">{{ profile()!.email }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Date of Birth</label>
                  <div class="field-value">{{ profile()!.dateOfBirth || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Gender</label>
                  <div class="field-value">{{ profile()!.gender || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Phone</label>
                  <div class="field-value">{{ profile()!.phone || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Address</label>
                  <div class="field-value">{{ profile()!.address || '--' }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card card-elevated animate-fade-in-up stagger-2">
            <div class="card-header"><h3>Academic Information</h3></div>
            <div class="card-body">
              <div class="field-grid">
                <div class="field">
                  <label class="form-label">Registration No.</label>
                  <div class="field-value text-gold" style="font-weight:600">{{ profile()!.registrationNumber || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Enrollment No.</label>
                  <div class="field-value">{{ profile()!.enrollmentNumber || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Faculty</label>
                  <div class="field-value">{{ profile()!.facultyName || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Department</label>
                  <div class="field-value">{{ profile()!.departmentName || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Admission Date</label>
                  <div class="field-value">{{ profile()!.admissionDate || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Status</label>
                  <span class="badge" [class]="profile()!.active ? 'badge-success' : 'badge-danger'">
                    {{ profile()!.active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="card card-elevated">
          <div class="card-body">
            <div class="empty-state">
              <p>Profile information not available. Please contact the registrar's office.</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 900px; }
    .profile-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .field { display: flex; flex-direction: column; gap: 0.375rem; }
    .field-label { font-size: var(--fs-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .field-value { font-size: var(--fs-body); color: var(--color-text-primary); padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); }
    .skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .skeleton-field { display: flex; flex-direction: column; }
    .empty-state { text-align: center; padding: 2rem; color: var(--color-text-muted); font-size: var(--fs-small); }
    @media (max-width: 640px) { .field-grid, .skeleton-grid { grid-template-columns: 1fr; } }
  `],
})
export class StudentProfileComponent implements OnInit {
  profile = signal<StudentProfile | null>(null);
  loading = signal(true);

  constructor(
    private crud: CrudService,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    const userId = this.auth.getUserId();
    if (!userId) {
      this.loading.set(false);
      this.toast.error('Unable to identify user');
      return;
    }
    this.crud.getById<StudentProfile>('students/user', userId).subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Failed to load profile');
      },
    });
  }
}
