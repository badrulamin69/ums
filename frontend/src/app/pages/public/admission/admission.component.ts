import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdmissionService } from '../../../services/admission.service';
import { AdmissionCircularResponse } from '../../../models/admission.model';

@Component({
  selector: 'app-admission',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Admission Information</h1>
        <p>Browse open admission circulars and apply today.</p>
      </div>

      <div class="circular-grid" *ngIf="circulars.length">
        <div class="card circular-card" *ngFor="let c of circulars">
          <div class="circular-header">
            <h3>{{c.title}}</h3>
            <span class="badge" [class]="c.active ? 'badge-success' : 'badge-danger'">
              {{c.active ? 'Active' : 'Closed'}}
            </span>
          </div>
          <div class="circular-meta">
            <div class="meta-row">
              <span class="meta-label">Session</span>
              <span class="meta-value">{{c.session}}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Faculty</span>
              <span class="meta-value">{{c.facultyName}}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Seats</span>
              <span class="meta-value">{{c.totalSeats}}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Application Fee</span>
              <span class="meta-value">{{c.applicationFee | currency:'BDT':'symbol':'1.0-0'}}</span>
            </div>
          </div>
          <div class="circular-dates">
            <div class="date-box">
              <span class="date-label">Registration Opens</span>
              <span class="date-value urgent">{{c.registrationStartDate | date:'mediumDate'}}</span>
            </div>
            <div class="date-box">
              <span class="date-label">Registration Closes</span>
              <span class="date-value">{{c.registrationEndDate | date:'mediumDate'}}</span>
            </div>
          </div>
          <a routerLink="/register" class="btn btn-accent" style="width:100%;margin-top:1rem;" *ngIf="c.active">
            Apply for this Circular
          </a>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && circulars.length === 0">
        <p>No admission circulars available at this time.</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading admission information...</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .circular-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.25rem;
    }
    .circular-card { padding: 1.5rem; }
    .circular-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      h3 { font-size: 1.125rem; color: var(--primary); flex: 1; }
    }
    .circular-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      .meta-label { color: var(--text-muted); }
      .meta-value { font-weight: 500; }
    }
    .circular-dates {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--bg-page);
      border-radius: var(--radius);
    }
    .date-box {
      text-align: center;
      .date-label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem; }
      .date-value { font-weight: 600; font-size: 0.9375rem; }
      .date-value.urgent { color: var(--urgent); }
    }
    .empty-state, .loading-state {
      text-align: center;
      padding: 4rem 0;
      color: var(--text-muted);
    }
    @media (max-width: 768px) {
      .circular-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class AdmissionComponent implements OnInit {
  circulars: AdmissionCircularResponse[] = [];
  loading = true;

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.admissionService.getAdmissionCirculars().subscribe({
      next: (res: any) => {
        this.circulars = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
