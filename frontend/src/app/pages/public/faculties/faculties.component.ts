import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdmissionService } from '../../../services/admission.service';
import { FacultyResponse, DepartmentResponse } from '../../../models/admission.model';

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Faculties & Departments</h1>
        <p>Explore our academic divisions and find the right program for you.</p>
      </div>

      <div class="faculty-list">
        <div class="faculty-block card" *ngFor="let f of faculties">
          <div class="faculty-header">
            <div class="faculty-icon">{{f.code}}</div>
            <div>
              <h2>{{f.name}}</h2>
              <p class="faculty-desc" *ngIf="f.description">{{f.description}}</p>
            </div>
          </div>
          <div class="departments" *ngIf="departmentsByFaculty[f.id]?.length">
            <h4>Departments</h4>
            <div class="dept-grid">
              <div class="dept-item" *ngFor="let d of departmentsByFaculty[f.id]">
                <span class="dept-code">{{d.code}}</span>
                <span class="dept-name">{{d.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && faculties.length === 0">
        <p>No faculties found.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .faculty-list { display: flex; flex-direction: column; gap: 1.25rem; }
    .faculty-block { padding: 1.5rem; }
    .faculty-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      h2 { font-size: 1.25rem; color: var(--primary); margin-bottom: 0.25rem; }
      .faculty-desc { font-size: 0.875rem; color: var(--text-secondary); }
    }
    .faculty-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: rgba(15, 42, 74, 0.08);
      color: var(--primary);
      font-weight: 700;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .departments {
      h4 {
        font-size: 0.8125rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        margin-bottom: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-light);
      }
    }
    .dept-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.5rem;
    }
    .dept-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.875rem;
      background: var(--bg-page);
      border-radius: var(--radius);
      font-size: 0.875rem;
    }
    .dept-code {
      font-weight: 600;
      color: var(--primary);
      font-size: 0.75rem;
      min-width: 40px;
    }
    .dept-name { color: var(--text-primary); }
    .empty-state {
      text-align: center;
      padding: 4rem 0;
      color: var(--text-muted);
    }
  `],
})
export class FacultiesComponent implements OnInit {
  faculties: FacultyResponse[] = [];
  departmentsByFaculty: Record<number, DepartmentResponse[]> = {};
  loading = true;

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.admissionService.getFaculties().subscribe({
      next: (res: any) => {
        this.faculties = res.data || [];
        this.faculties.forEach((f: any) => {
          this.admissionService.getDepartmentsByFaculty(f.id).subscribe({
            next: (dRes: any) => (this.departmentsByFaculty[f.id] = dRes.data || []),
            error: () => (this.departmentsByFaculty[f.id] = []),
          });
        });
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
