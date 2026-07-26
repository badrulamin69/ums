import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicService } from '../../../services/academic.service';
import { AdmissionService } from '../../../services/admission.service';
import { YearLevelResponse, YearLevelRequest } from '../../../models/academic.model';
import { DepartmentResponse } from '../../../models/admission.model';

@Component({
  selector: 'app-year-levels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Year Levels</h1>
        <p>Manage year levels per department</p>
      </div>

      <div class="toolbar">
        <select class="form-input filter-select" [(ngModel)]="selectedDepartmentId" (ngModelChange)="onDepartmentChange()">
          <option [ngValue]="0">All Departments</option>
          <option *ngFor="let d of departments" [ngValue]="d.id">{{ d.name }}</option>
        </select>
        <button class="btn btn-accent btn-sm" (click)="showForm = true">Add Year Level</button>
      </div>

      <div class="table-container" *ngIf="yearLevels.length">
        <table>
          <thead>
            <tr>
              <th>Year Number</th>
              <th>Name</th>
              <th>Department Name</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let yl of yearLevels">
              <td>{{ yl.yearNumber }}</td>
              <td>{{ yl.name }}</td>
              <td>{{ yl.departmentName }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && yearLevels.length === 0">
        <p>{{ selectedDepartmentId ? 'No year levels found for this department.' : 'No year levels found.' }}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading year levels...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm = false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>Add Year Level</h3>
        <button class="btn-close" (click)="showForm = false">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-label">Department *</label>
          <select class="form-input" [(ngModel)]="formModel.departmentId" name="departmentId" required>
            <option [ngValue]="0">Select Department</option>
            <option *ngFor="let d of departments" [ngValue]="d.id">{{ d.name }}</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Year Number *</label>
            <input type="number" class="form-input" [(ngModel)]="formModel.yearNumber" name="yearNumber" required />
          </div>
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input type="text" class="form-input" [(ngModel)]="formModel.name" name="name" required />
          </div>
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="showForm = false">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; }
    .filter-select { max-width: 240px; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-light); }
  `],
})
export class YearLevelsComponent implements OnInit {
  yearLevels: YearLevelResponse[] = [];
  departments: DepartmentResponse[] = [];
  loading = true;
  saving = false;
  showForm = false;
  errorMsg = '';
  selectedDepartmentId = 0;

  formModel = { departmentId: 0, yearNumber: 0, name: '' };

  constructor(
    private academicService: AcademicService,
    private admissionService: AdmissionService,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.admissionService.getAllDepartments().subscribe({
      next: (res: any) => {
        this.departments = res.data || [];
        if (this.departments.length > 0) {
          this.selectedDepartmentId = this.departments[0].id;
          this.loadYearLevels();
        } else {
          this.loading = false;
        }
      },
      error: () => (this.loading = false),
    });
  }

  onDepartmentChange(): void {
    if (this.selectedDepartmentId) {
      this.loadYearLevels();
    } else {
      this.yearLevels = [];
    }
  }

  loadYearLevels(): void {
    if (!this.selectedDepartmentId) return;
    this.loading = true;
    this.academicService.getYearLevelsByDepartment(this.selectedDepartmentId).subscribe({
      next: (res: any) => {
        this.yearLevels = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSubmit(): void {
    if (!this.formModel.departmentId || !this.formModel.yearNumber || !this.formModel.name) return;
    this.saving = true;
    this.errorMsg = '';

    const req: YearLevelRequest = {
      departmentId: this.formModel.departmentId,
      yearNumber: this.formModel.yearNumber,
      name: this.formModel.name,
    };

    this.academicService.createYearLevel(req).subscribe({
      next: () => {
        this.showForm = false;
        this.saving = false;
        this.selectedDepartmentId = req.departmentId;
        this.loadYearLevels();
      },
      error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
    });
  }
}
