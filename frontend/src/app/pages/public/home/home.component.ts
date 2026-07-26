import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdmissionService } from '../../../services/admission.service';
import { FacultyResponse, AdmissionCircularResponse } from '../../../models/admission.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="hero-inner container">
        <div class="hero-content">
          <h1 class="hero-title">Smart University</h1>
          <p class="hero-tagline">Empowering Minds, Shaping Futures</p>
          <p class="hero-desc">
            Join a community of scholars dedicated to academic excellence,
            innovative research, and holistic development.
          </p>
          <div class="hero-actions">
            <a routerLink="/admission" class="btn btn-accent btn-lg">Apply Now</a>
            <a routerLink="/faculties" class="btn btn-outline hero-btn">Explore Faculties</a>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-strip" *ngIf="stats.length">
      <div class="container stats-grid">
        <div class="stat-item" *ngFor="let s of stats">
          <div class="stat-value">{{s.value}}</div>
          <div class="stat-label">{{s.label}}</div>
        </div>
      </div>
    </section>

    <section class="section container" *ngIf="faculties.length">
      <h2 class="section-title">Our Faculties</h2>
      <div class="faculty-grid">
        <div class="faculty-card card" *ngFor="let f of faculties">
          <div class="faculty-icon">{{f.code}}</div>
          <h3>{{f.name}}</h3>
          <p>{{f.description}}</p>
        </div>
      </div>
    </section>

    <section class="section container" *ngIf="circulars.length">
      <h2 class="section-title">Admission Open</h2>
      <div class="admission-grid">
        <div class="card admission-card" *ngFor="let c of circulars">
          <div class="admission-badge badge badge-urgent">Open</div>
          <h3>{{c.title}}</h3>
          <div class="admission-meta">
            <span>Session: {{c.session}}</span>
            <span>Faculty: {{c.facultyName}}</span>
          </div>
          <div class="admission-dates">
            <div class="date-item">
              <span class="date-label">Registration</span>
              <span class="date-value">{{c.registrationStartDate | date:'mediumDate'}} - {{c.registrationEndDate | date:'mediumDate'}}</span>
            </div>
            <div class="date-item">
              <span class="date-label">Seats</span>
              <span class="date-value">{{c.totalSeats}}</span>
            </div>
            <div class="date-item">
              <span class="date-label">Fee</span>
              <span class="date-value">{{c.applicationFee | currency:'BDT':'symbol':'1.0-0'}}</span>
            </div>
          </div>
          <a routerLink="/admission" class="btn btn-accent" style="width:100%;margin-top:1rem;">Apply Now</a>
        </div>
      </div>
    </section>

    <section class="cta-banner">
      <div class="container cta-inner">
        <h2>Ready to Begin Your Journey?</h2>
        <p>Applications are now open for the upcoming academic session.</p>
        <a routerLink="/register" class="btn btn-accent btn-lg">Start Your Application</a>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 5rem 0 4rem;
    }
    .hero-content { max-width: 640px; }
    .hero-title {
      font-family: var(--font-serif);
      font-size: 3rem;
      font-weight: 900;
      margin-bottom: 0.75rem;
      line-height: 1.1;
    }
    .hero-tagline {
      font-size: 1.25rem;
      color: var(--accent);
      font-weight: 500;
      margin-bottom: 1rem;
    }
    .hero-desc {
      font-size: 1.0625rem;
      opacity: 0.8;
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .hero-btn {
      border-color: rgba(255,255,255,0.4);
      color: white;
      &:hover {
        background: rgba(255,255,255,0.1);
        border-color: white;
        color: white;
      }
    }
    .stats-strip {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-light);
      padding: 2rem 0;
      margin-top: -1px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
    }
    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    .section { padding: 3rem 0; }
    .faculty-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .faculty-card {
      padding: 1.5rem;
      text-align: center;
      h3 {
        font-size: 1.0625rem;
        margin-bottom: 0.5rem;
        color: var(--primary);
      }
      p {
        font-size: 0.875rem;
        color: var(--text-secondary);
        line-height: 1.6;
      }
    }
    .faculty-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(15, 42, 74, 0.08);
      color: var(--primary);
      font-weight: 700;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    .admission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem;
    }
    .admission-card {
      position: relative;
      h3 { font-size: 1.125rem; color: var(--primary); margin-bottom: 0.75rem; }
    }
    .admission-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    .admission-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1rem;
      span { font-size: 0.8125rem; color: var(--text-secondary); }
    }
    .admission-dates {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--bg-page);
      border-radius: var(--radius);
    }
    .date-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
      .date-label { color: var(--text-muted); }
      .date-value { font-weight: 500; color: var(--text-primary); }
    }
    .cta-banner {
      background: linear-gradient(135deg, var(--primary) 0%, #1a4070 100%);
      color: white;
      padding: 3.5rem 0;
      text-align: center;
      h2 {
        font-family: var(--font-serif);
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }
      p { opacity: 0.8; margin-bottom: 1.5rem; }
    }
    @media (max-width: 768px) {
      .hero-title { font-size: 2rem; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .admission-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class HomeComponent implements OnInit {
  faculties: FacultyResponse[] = [];
  circulars: AdmissionCircularResponse[] = [];
  stats = [
    { value: '6', label: 'Faculties' },
    { value: '24', label: 'Departments' },
    { value: '12,000+', label: 'Students' },
    { value: '80+', label: 'Programs' },
  ];

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.admissionService.getFaculties().subscribe({
      next: (res: any) => (this.faculties = res.data || []),
      error: () => {},
    });
    this.admissionService.getAdmissionCirculars().subscribe({
      next: (res: any) => (this.circulars = (res.data || []).filter((c: any) => c.active)),
      error: () => {},
    });
  }
}
