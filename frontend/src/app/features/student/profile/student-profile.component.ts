import { Component, signal, OnInit , DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
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

interface ApplicantProfile {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  preferredDepartmentId: number;
  preferredDepartmentName: string;
  circularTitle: string;
  applicationNumber: string;
  status: string;
  emailVerified: boolean;
  paymentCompleted: boolean;
}

interface Department {
  id: number;
  name: string;
  code: string;
}

interface AdmitCardData {
  id: number;
  applicantId: number;
  applicationNumber: string;
  admitCardNumber: string;
  examDate: string;
  examCenter: string;
  downloaded: boolean;
}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [PageHeaderComponent, RouterLink, FormsModule],
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
      } @else if (profile() || applicantProfile()) {
        <div class="profile-grid">
          <div class="card card-elevated animate-fade-in-up stagger-1">
            <div class="card-header">
              <h3>Personal Information</h3>
              @if (!editing()) {
                <button class="btn btn-outline btn-sm" (click)="startEdit()">Edit</button>
              } @else {
                <div class="edit-actions">
                  <button class="btn btn-outline btn-sm" (click)="cancelEdit()" [disabled]="saving()">Cancel</button>
                  <button class="btn btn-gold btn-sm" (click)="saveProfile()" [disabled]="saving()">
                    {{ saving() ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              }
            </div>
            <div class="card-body">
              <div class="field-grid">
                <div class="field">
                  <label class="form-label">Full Name</label>
                  <div class="field-value">{{ applicantFullName() || (profile()?.name) || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Email</label>
                  <div class="field-value">{{ applicantProfile()?.email || profile()?.email || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Date of Birth</label>
                  <div class="field-value">{{ applicantProfile()?.dateOfBirth || profile()?.dateOfBirth || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Gender</label>
                  <div class="field-value">{{ applicantProfile()?.gender || profile()?.gender || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Phone</label>
                  @if (editing()) {
                    <input class="form-input" type="text" [(ngModel)]="editPhone" placeholder="Enter phone number" />
                  } @else {
                    <div class="field-value">{{ applicantProfile()?.phone || profile()?.phone || '--' }}</div>
                  }
                </div>
                <div class="field">
                  <label class="form-label">Address</label>
                  @if (editing()) {
                    <input class="form-input" type="text" [(ngModel)]="editAddress" placeholder="Enter address" />
                  } @else {
                    <div class="field-value">{{ applicantProfile()?.address || profile()?.address || '--' }}</div>
                  }
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
                  <div class="field-value text-gold" style="font-weight:600">{{ profile()?.registrationNumber || applicantProfile()?.applicationNumber || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Enrollment No.</label>
                  <div class="field-value">{{ profile()?.enrollmentNumber || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Preferred Department</label>
                  <div class="field-value">{{ applicantProfile()?.preferredDepartmentName || profile()?.departmentName || '--' }}</div>
                </div>
                <div class="field">
                  <label class="form-label">Faculty</label>
                  <div class="field-value">{{ profile()?.facultyName || '--' }}</div>
                </div>
                @if (profile()) {
                  <div class="field">
                    <label class="form-label">Admission Date</label>
                    <div class="field-value">{{ profile()?.admissionDate || '--' }}</div>
                  </div>
                  <div class="field">
                    <label class="form-label">Status</label>
                    <span class="badge" [class]="profile()?.active ? 'badge-success' : 'badge-danger'">
                      {{ profile()?.active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                }
                @if (applicantProfile()) {
                  <div class="field">
                    <label class="form-label">Application No.</label>
                    <div class="field-value">{{ applicantProfile()?.applicationNumber }}</div>
                  </div>
                  <div class="field">
                    <label class="form-label">Application Status</label>
                    <span class="badge badge-info">{{ applicantProfile()?.status }}</span>
                  </div>
                  <div class="field">
                    <label class="form-label">Email Verified</label>
                    <span class="badge" [class]="applicantProfile()?.emailVerified ? 'badge-success' : 'badge-warning'">
                      {{ applicantProfile()?.emailVerified ? 'Verified' : 'Not Verified' }}
                    </span>
                  </div>
                  <div class="field">
                    <label class="form-label">Payment Status</label>
                    <span class="badge" [class]="applicantProfile()?.paymentCompleted ? 'badge-success' : 'badge-warning'">
                      {{ applicantProfile()?.paymentCompleted ? 'Paid' : 'Pending' }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>

          @if (admitCard()) {
            <div class="card card-elevated animate-fade-in-up stagger-3">
              <div class="card-header">
                <h3>Admit Card</h3>
                <a routerLink="/student/admit-card" class="card-header-link">View Full Details</a>
              </div>
              <div class="card-body">
                <div class="field-grid">
                  <div class="field">
                    <label class="form-label">Admit Card No.</label>
                    <div class="field-value" style="font-weight:600;color:var(--color-gold)">{{ admitCard()?.admitCardNumber }}</div>
                  </div>
                  <div class="field">
                    <label class="form-label">Application No.</label>
                    <div class="field-value">{{ admitCard()?.applicationNumber }}</div>
                  </div>
                  <div class="field">
                    <label class="form-label">Exam Date</label>
                    <div class="field-value">{{ admitCard()?.examDate }}</div>
                  </div>
                  <div class="field">
                    <label class="form-label">Exam Center</label>
                    <div class="field-value">{{ admitCard()?.examCenter || 'To be announced' }}</div>
                  </div>
                </div>
                @if (admitCard()?.downloaded) {
                  <div class="profile-downloaded-badge">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 7l2.5 2.5L10.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    PDF downloaded
                  </div>
                }
              </div>
            </div>
          }
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
    .field-value { font-size: var(--fs-body); color: var(--color-text-primary); padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); }
    .skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .skeleton-field { display: flex; flex-direction: column; }
    .empty-state { text-align: center; padding: 2rem; color: var(--color-text-muted); font-size: var(--fs-small); }

    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      h3 { margin: 0; }
    }
    .card-header-link {
      font-size: var(--fs-small); color: var(--color-gold); text-decoration: none;
      font-weight: var(--fw-medium);
      &:hover { text-decoration: underline; }
    }

    .edit-actions { display: flex; gap: 0.5rem; }

    .profile-downloaded-badge {
      display: inline-flex; align-items: center; gap: 0.375rem;
      margin-top: 1rem;
      padding: 0.375rem 0.75rem;
      background: rgba(34,197,94,0.1); color: #16a34a;
      border-radius: var(--radius-sm);
      font-size: 0.75rem; font-weight: 500;
    }

    @media (max-width: 640px) { .field-grid, .skeleton-grid { grid-template-columns: 1fr; } }
  `],
})
export class StudentProfileComponent implements OnInit {
  profile = signal<StudentProfile | null>(null);
  applicantProfile = signal<ApplicantProfile | null>(null);
  admitCard = signal<AdmitCardData | null>(null);
  loading = signal(true);
  editing = signal(false);
  saving = signal(false);

  editPhone = '';
  editAddress = '';
  private destroyRef = inject(DestroyRef);

  constructor(
    private crud: CrudService,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  applicantFullName(): string {
    const app = this.applicantProfile();
    if (!app) return '';
    return [app.firstName, app.middleName, app.lastName].filter(Boolean).join(' ');
  }

  loadProfile(): void {
    this.loading.set(true);
    const userId = this.auth.getUserId();
    if (!userId) {
      this.loading.set(false);
      this.toast.error('Unable to identify user');
      return;
    }
    this.crud.getById<StudentProfile>('students/user', userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loadApplicantProfile();
      },
      error: () => {
        this.profile.set(null);
        this.loadApplicantProfile();
      },
    });
  }

  loadApplicantProfile(): void {
    this.crud.customGet<ApplicantProfile>('applicants/me').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.applicantProfile.set(data);
        this.loadAdmitCard();
      },
      error: () => {
        this.applicantProfile.set(null);
        this.loadAdmitCard();
      },
    });
  }

  loadAdmitCard(): void {
    this.crud.customGet<AdmitCardData>('admit-cards/my').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.admitCard.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.admitCard.set(null);
        this.loading.set(false);
      },
    });
  }

  startEdit(): void {
    const app = this.applicantProfile();
    this.editPhone = app?.phone || '';
    this.editAddress = app?.address || '';
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  saveProfile(): void {
    this.saving.set(true);
    const payload: { phone?: string; address?: string } = {};
    if (this.editPhone) payload.phone = this.editPhone;
    if (this.editAddress) payload.address = this.editAddress;

    this.crud.customPut<any, ApplicantProfile>('applicants/me', payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updated) => {
        this.applicantProfile.set(updated);
        this.editing.set(false);
        this.saving.set(false);
        this.toast.success('Profile updated');
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Failed to update profile');
      },
    });
  }
}
