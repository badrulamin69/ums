import { Component, signal, OnInit , DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface Circular {
  id: number; title: string; session: string; facultyId: number; facultyName: string;
  registrationStartDate: string; registrationEndDate: string;
  applicationFee: number; totalSeats: number; active: boolean;
}
interface Department { id: number; name: string; code: string; facultyId: number; }
interface DocumentUploadResponse { id: number; applicantId: number; documentType: string; fileName: string; fileUrl: string; verified: boolean; }
interface SscResultResponse { id: number; applicantId: number; board: string; examYear: number; rollNumber: string; registrationNumber: string; group: string; institution: string; gpa: number; scienceGpa: number; mathGpa: number; verified: boolean; }
interface HscResultResponse { id: number; applicantId: number; board: string; examYear: number; rollNumber: string; registrationNumber: string; group: string; institution: string; gpa: number; scienceGpa: number; mathGpa: number; verified: boolean; }

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-inner">
        @if (circular()) {
          <div class="apply-layout animate-fade-in-up">
            <div class="apply-sidebar">
              <a routerLink="/circulars" class="back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Back to Circulars
              </a>
              <div class="circular-info">
                <span class="badge badge-success">Active</span>
                <h2>{{ circular()!.title }}</h2>
                <p class="info-meta">{{ circular()!.facultyName }}</p>
                <div class="info-details">
                  <div class="info-row"><span class="info-label">Session</span><span class="info-value">{{ circular()!.session }}</span></div>
                  <div class="info-row"><span class="info-label">Seats</span><span class="info-value">{{ circular()!.totalSeats }}</span></div>
                  <div class="info-row"><span class="info-label">Fee</span><span class="info-value">{{ circular()!.applicationFee }} BDT</span></div>
                  <div class="info-row"><span class="info-label">Deadline</span><span class="info-value">{{ circular()!.registrationEndDate }}</span></div>
                </div>
              </div>
            </div>

            <div class="apply-form-card">
              <h2 class="form-title">Application Form</h2>
              <form class="apply-form" (ngSubmit)="submit()">
                <div class="form-section">
                  <h3 class="section-title">Account Credentials</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Email <span class="req">*</span></label>
                      <input type="email" class="form-control" [(ngModel)]="form.email" name="email" required placeholder="you@example.com">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Password <span class="req">*</span></label>
                      <input type="password" class="form-control" [(ngModel)]="form.password" name="password" required placeholder="Min 6 characters">
                    </div>
                  </div>
                </div>

                <div class="form-section">
                  <h3 class="section-title">Personal Information</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">First Name <span class="req">*</span></label>
                      <input type="text" class="form-control" [(ngModel)]="form.firstName" name="firstName" required placeholder="First name">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Middle Name</label>
                      <input type="text" class="form-control" [(ngModel)]="form.middleName" name="middleName" placeholder="Middle name">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Last Name <span class="req">*</span></label>
                      <input type="text" class="form-control" [(ngModel)]="form.lastName" name="lastName" required placeholder="Last name">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Phone <span class="req">*</span></label>
                      <input type="tel" class="form-control" [(ngModel)]="form.phone" name="phone" required placeholder="+8801XXXXXXXXX">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Gender <span class="req">*</span></label>
                      <select class="form-select" [(ngModel)]="form.gender" name="gender" required>
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Date of Birth <span class="req">*</span></label>
                      <input type="date" class="form-control" [(ngModel)]="form.dateOfBirth" name="dateOfBirth" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">National ID / Birth Certificate</label>
                    <input type="text" class="form-control" [(ngModel)]="form.nationalId" name="nationalId" placeholder="NID or Birth Certificate number">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Address</label>
                    <input type="text" class="form-control" [(ngModel)]="form.address" name="address" placeholder="Your address">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Profile Photo</label>
                    <input type="file" class="form-control" (change)="onPhotoSelected($event)" accept=".jpg,.jpeg,.png">
                    @if (photoPreview()) {
                      <div class="photo-preview">
                        <img [src]="photoPreview()" alt="Photo preview" class="preview-img">
                      </div>
                    }
                  </div>
                </div>

                <div class="form-section">
                  <h3 class="section-title">SSC / O-Level Result</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Board</label>
                      <select class="form-select" [(ngModel)]="sscForm.board" name="sscBoard">
                        <option value="">Select board</option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Comilla">Comilla</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Jessore">Jessore</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Barisal">Barisal</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Dinajpur">Dinajpur</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Exam Year</label>
                      <input type="number" class="form-control" [(ngModel)]="sscForm.examYear" name="sscExamYear" min="2000">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Roll Number</label>
                      <input type="text" class="form-control" [(ngModel)]="sscForm.rollNumber" name="sscRollNumber">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Registration Number</label>
                      <input type="text" class="form-control" [(ngModel)]="sscForm.registrationNumber" name="sscRegistrationNumber">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Group</label>
                      <input type="text" class="form-control" [(ngModel)]="sscForm.group" name="sscGroup" placeholder="e.g. Science">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Institution</label>
                      <input type="text" class="form-control" [(ngModel)]="sscForm.institution" name="sscInstitution">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">GPA</label>
                      <input type="number" class="form-control" [(ngModel)]="sscForm.gpa" name="sscGpa" min="0" max="5" step="0.01">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Science GPA</label>
                      <input type="number" class="form-control" [(ngModel)]="sscForm.scienceGpa" name="sscScienceGpa" min="0" max="5" step="0.01">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Math GPA</label>
                      <input type="number" class="form-control" [(ngModel)]="sscForm.mathGpa" name="sscMathGpa" min="0" max="5" step="0.01">
                    </div>
                  </div>
                </div>

                <div class="form-section">
                  <h3 class="section-title">HSC / A-Level Result</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Board</label>
                      <select class="form-select" [(ngModel)]="hscForm.board" name="hscBoard">
                        <option value="">Select board</option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Comilla">Comilla</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Jessore">Jessore</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Barisal">Barisal</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Dinajpur">Dinajpur</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Exam Year</label>
                      <input type="number" class="form-control" [(ngModel)]="hscForm.examYear" name="hscExamYear" min="2000">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Roll Number</label>
                      <input type="text" class="form-control" [(ngModel)]="hscForm.rollNumber" name="hscRollNumber">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Registration Number</label>
                      <input type="text" class="form-control" [(ngModel)]="hscForm.registrationNumber" name="hscRegistrationNumber">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Group</label>
                      <input type="text" class="form-control" [(ngModel)]="hscForm.group" name="hscGroup" placeholder="e.g. Science">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Institution</label>
                      <input type="text" class="form-control" [(ngModel)]="hscForm.institution" name="hscInstitution">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">GPA</label>
                      <input type="number" class="form-control" [(ngModel)]="hscForm.gpa" name="hscGpa" min="0" max="5" step="0.01">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Science GPA</label>
                      <input type="number" class="form-control" [(ngModel)]="hscForm.scienceGpa" name="hscScienceGpa" min="0" max="5" step="0.01">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Math GPA</label>
                      <input type="number" class="form-control" [(ngModel)]="hscForm.mathGpa" name="hscMathGpa" min="0" max="5" step="0.01">
                    </div>
                  </div>
                </div>

                <div class="form-section">
                  <h3 class="section-title">Department Preference</h3>
                  <div class="form-group">
                    <label class="form-label">Preferred Department</label>
                    <select class="form-select" [(ngModel)]="form.preferredDepartmentId" name="preferredDepartmentId">
                      <option [ngValue]="null">Select department (optional)</option>
                      @for (dept of departments(); track dept.id) {
                        <option [ngValue]="dept.id">{{ dept.name }} ({{ dept.code }})</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="form-footer">
                  @if (!isValid()) {
                    <span class="validation-hint">Fill all required fields (*) to submit</span>
                  }
                  <button type="submit" class="btn btn-gold" [disabled]="!isValid() || saving()">
                    @if (saving()) {
                      <span class="spinner-sm"></span> Submitting...
                    } @else {
                      Submit Application
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        } @else if (loading()) {
          <div class="loading-state">
            <div class="skeleton-card" style="height:400px"></div>
          </div>
        } @else {
          <div class="error-state animate-fade-in-up">
            <h2>Circular Not Found</h2>
            <p>The admission circular you're looking for doesn't exist or is no longer active.</p>
            <a routerLink="/circulars" class="btn btn-gold">View All Circulars</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 3rem 2rem 5rem; }
    .page-inner { max-width: 1100px; margin: 0 auto; }

    .success-state, .error-state {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
    }
    .success-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 3rem;
      text-align: center;
      max-width: 420px;
      width: 100%;
    }
    .success-icon svg { color: var(--color-success); }
    .success-card h2, .error-state h2 {
      font-family: var(--font-display);
      font-size: var(--fs-h2);
      margin-bottom: 0.75rem;
    }
    .success-card p, .error-state p {
      color: var(--color-text-secondary);
      font-size: var(--fs-small);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .success-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }
    .loading-state { display: flex; justify-content: center; padding: 4rem 0; }

    .apply-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      align-items: start;
    }
    .apply-sidebar {
      position: sticky;
      top: 80px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: var(--fs-small);
      color: var(--color-text-muted);
      text-decoration: none;
      margin-bottom: 1.5rem;
      transition: color var(--duration-fast) var(--ease-out);
    }
    .back-link:hover { color: var(--color-gold); }
    .circular-info {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
    }
    .circular-info h2 {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      margin: 0.75rem 0 0.25rem;
    }
    .info-meta {
      font-size: var(--fs-small);
      color: var(--color-text-muted);
      margin-bottom: 1rem;
    }
    .info-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: var(--fs-small);
    }
    .info-label { color: var(--color-text-muted); }
    .info-value { font-weight: var(--fw-semibold); color: var(--color-text-primary); }

    .apply-form-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 2rem;
    }
    .form-title {
      font-family: var(--font-display);
      font-size: var(--fs-h2);
      margin-bottom: 1.5rem;
    }
    .apply-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-border);
    }
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-label {
      margin-bottom: 0.375rem;
    }
    .req { color: var(--color-danger); }
    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }
    .validation-hint {
      font-size: var(--fs-small);
      color: var(--color-danger);
    }
    .spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    .error-state .btn { margin-top: 0.5rem; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .photo-preview {
      margin-top: 0.5rem;
    }
    .preview-img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
    }

    @media (max-width: 768px) {
      .apply-layout { grid-template-columns: 1fr; }
      .apply-sidebar { position: static; }
    }
  `],
})
export class ApplyComponent implements OnInit {
  circular = signal<Circular | null>(null);
  departments = signal<Department[]>([]);
  loading = signal(true);
  saving = signal(false);
  submitted = signal(false);
  circularId = 0;
  applicantId: number | null = null;
  photoFile = signal<File | null>(null);
  photoPreview = signal<string | null>(null);
  sscResult = signal<SscResultResponse | null>(null);
  hscResult = signal<HscResultResponse | null>(null);

  form: any = {
    email: '', password: '',
    firstName: '', middleName: '', lastName: '',
    phone: '', gender: '', dateOfBirth: '',
    address: '', nationalId: '', circularId: 0, preferredDepartmentId: null,
  };

  sscForm: any = {
    board: '', examYear: new Date().getFullYear() - 5, rollNumber: '',
    registrationNumber: '', group: '', institution: '',
    gpa: 0, scienceGpa: 0, mathGpa: 0,
  };

  hscForm: any = {
    board: '', examYear: new Date().getFullYear() - 2, rollNumber: '',
    registrationNumber: '', group: '', institution: '',
    gpa: 0, scienceGpa: 0, mathGpa: 0,
  };
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.circularId = Number(this.route.snapshot.paramMap.get('id'));
    this.form.circularId = this.circularId;

    this.crud.getById<Circular>('admission-circulars', this.circularId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (c) => {
        this.circular.set(c);
        this.loading.set(false);
        if (c.facultyId) {
          this.crud.listAll<Department>(`departments/faculty/${c.facultyId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (d) => this.departments.set(d),
          });
        }
      },
      error: () => this.loading.set(false),
    });
  }

  isValid(): boolean {
    return this.form.email && this.form.password && this.form.password.length >= 6 &&
           this.form.firstName && this.form.lastName && this.form.phone &&
           this.form.gender && this.form.dateOfBirth && this.form.circularId > 0;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.photoFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.photoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    if (!this.isValid()) {
      this.toast.error('Please fill in all required fields (email, password, name, phone, gender, date of birth)');
      return;
    }
    this.saving.set(true);

    this.crud.create<any, any>('applicants', this.form).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.applicantId = res?.id ?? res?.data?.id;
        this.toast.success('Application submitted!');
        this.submitAdditionalData();
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(err?.error?.message || 'Failed to submit application');
      },
    });
  }

  private submitAdditionalData(): void {
    const id = this.applicantId;
    if (!id) { this.saving.set(false); return; }

    const tasks: Promise<void>[] = [];

    if (this.photoFile()) {
      tasks.push(this.uploadPhoto(id));
    }

    if (this.hasSscData()) {
      tasks.push(this.submitSscResult(id));
    }

    if (this.hasHscData()) {
      tasks.push(this.submitHscResult(id));
    }

    if (tasks.length === 0) {
      this.saving.set(false);
      this.router.navigate(['/verify-email-sent']);
      return;
    }

    Promise.all(tasks).then(() => {
      this.saving.set(false);
      this.router.navigate(['/verify-email-sent']);
    }).catch((err) => {
      this.saving.set(false);
      this.toast.error(err?.message || 'Some uploads failed');
    });
  }

  private uploadPhoto(applicantId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = this.photoFile();
      if (!file) { resolve(); return; }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('applicantId', applicantId.toString());
      formData.append('documentType', 'PHOTO');

      this.crud.uploadFile<DocumentUploadResponse>('applicant-documents', formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => resolve(),
        error: (err) => reject(err),
      });
    });
  }

  private submitSscResult(applicantId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.crud.create<any, any>(`applicants/${applicantId}/ssc-results`, this.sscForm).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => resolve(),
        error: (err) => reject(err),
      });
    });
  }

  private submitHscResult(applicantId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.crud.create<any, any>(`applicants/${applicantId}/hsc-results`, this.hscForm).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => resolve(),
        error: (err) => reject(err),
      });
    });
  }

  private hasSscData(): boolean {
    return !!(this.sscForm.board && this.sscForm.rollNumber && this.sscForm.gpa);
  }

  private hasHscData(): boolean {
    return !!(this.hscForm.board && this.hscForm.rollNumber && this.hscForm.gpa);
  }
}