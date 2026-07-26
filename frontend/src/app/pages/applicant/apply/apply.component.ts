import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdmissionService } from '../../../services/admission.service';
import { AuthService } from '../../../services/auth.service';
import { DepartmentResponse } from '../../../models/admission.model';
import { Gender } from '../../../models/common.model';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="apply-card card">
        <div class="auth-header">
          <h1>Apply for Admission</h1>
          <p *ngIf="circularTitle">Applying to: {{circularTitle}}</p>
        </div>

        <div class="loading-state" *ngIf="loadingCircular">
          <p>Loading circular details...</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!loadingCircular">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="firstName">First Name *</label>
              <input id="firstName" type="text" class="form-input" formControlName="firstName" />
              <div class="form-error" *ngIf="form.get('firstName')?.touched && form.get('firstName')?.invalid">
                First name is required.
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="middleName">Middle Name</label>
              <input id="middleName" type="text" class="form-input" formControlName="middleName" />
            </div>
            <div class="form-group">
              <label class="form-label" for="lastName">Last Name *</label>
              <input id="lastName" type="text" class="form-input" formControlName="lastName" />
              <div class="form-error" *ngIf="form.get('lastName')?.touched && form.get('lastName')?.invalid">
                Last name is required.
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="phone">Phone *</label>
              <input id="phone" type="tel" class="form-input" formControlName="phone" placeholder="+8801XXXXXXXXX" />
              <div class="form-error" *ngIf="form.get('phone')?.touched && form.get('phone')?.invalid">
                Valid phone number is required (10-15 digits).
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="gender">Gender *</label>
              <select id="gender" class="form-input" formControlName="gender">
                <option value="">Select gender</option>
                <option *ngFor="let g of genders" [value]="g">{{g}}</option>
              </select>
              <div class="form-error" *ngIf="form.get('gender')?.touched && form.get('gender')?.invalid">
                Gender is required.
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="dateOfBirth">Date of Birth *</label>
              <input id="dateOfBirth" type="date" class="form-input" formControlName="dateOfBirth" />
              <div class="form-error" *ngIf="form.get('dateOfBirth')?.touched && form.get('dateOfBirth')?.invalid">
                Date of birth is required.
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="preferredDepartmentId">Preferred Department</label>
              <select id="preferredDepartmentId" class="form-input" formControlName="preferredDepartmentId">
                <option value="">Select department</option>
                <option *ngFor="let d of departments" [value]="d.id">{{d.name}}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="address">Address</label>
            <textarea id="address" class="form-input" formControlName="address" rows="3" placeholder="Your permanent address"></textarea>
          </div>

          <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>

          <button type="submit" class="btn btn-accent btn-lg" style="width:100%;" [disabled]="loading || !formValid">
            {{loading ? 'Submitting Application...' : 'Submit Application'}}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, rgba(15, 42, 74, 0.03) 0%, rgba(201, 162, 39, 0.03) 100%);
    }
    .apply-card {
      width: 100%;
      max-width: 640px;
      padding: 2.5rem;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
      h1 { font-family: var(--font-serif); color: var(--primary); margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 0.9375rem; }
    }
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
    }
    .server-error { text-align: center; margin-bottom: 1rem; }
    .loading-state { text-align: center; padding: 2rem 0; color: var(--text-muted); }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-light);
      p { font-size: 0.875rem; color: var(--text-secondary); }
      a { font-weight: 500; }
    }
  `],
})
export class ApplyComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingCircular = true;
  errorMsg = '';
  circularId = 0;
  circularTitle = '';
  departments: DepartmentResponse[] = [];
  genders = Object.values(Gender);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private admissionService: AdmissionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: [''],
      preferredDepartmentId: [''],
    });

    this.circularId = Number(this.route.snapshot.paramMap.get('circularId'));

    if (!this.circularId) {
      this.router.navigate(['/admission']);
      return;
    }

    this.admissionService.getAdmissionCircularById(this.circularId).subscribe({
      next: (res: any) => {
        const circular = res.data;
        this.circularTitle = circular?.title || '';
        if (circular?.facultyId) {
          this.loadDepartments(circular.facultyId);
        } else {
          this.loadAllDepartments();
        }
        this.loadingCircular = false;
      },
      error: () => {
        this.errorMsg = 'Admission circular not found.';
        this.loadingCircular = false;
      },
    });
  }

  private loadDepartments(facultyId: number): void {
    this.admissionService.getDepartmentsByFaculty(facultyId).subscribe({
      next: (res: any) => (this.departments = res.data || []),
      error: () => (this.departments = []),
    });
  }

  private loadAllDepartments(): void {
    this.admissionService.getAllDepartments().subscribe({
      next: (res: any) => (this.departments = res.data || []),
      error: () => (this.departments = []),
    });
  }

  get formValid(): boolean {
    return this.form.valid && this.circularId > 0;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const request = {
      ...this.form.value,
      circularId: this.circularId,
      preferredDepartmentId: this.form.value.preferredDepartmentId
        ? Number(this.form.value.preferredDepartmentId)
        : null,
    };

    this.admissionService.registerApplicant(request).subscribe({
      next: () => {
        this.authService.refreshToken().subscribe({
          next: () => this.router.navigate(['/applicant']),
          error: () => this.router.navigate(['/applicant']),
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Application failed. Please try again.';
      },
    });
  }
}
