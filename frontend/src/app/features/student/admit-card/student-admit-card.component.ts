import { Component, signal, OnInit , DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

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
  selector: 'app-student-admit-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="page animate-fade-in-up">
      <div class="page-header">
        <div>
          <h1 class="page-title">Admit Card</h1>
          <p class="page-subtitle">View and download your examination admit card</p>
        </div>
        @if (admitCard()) {
          <div class="header-actions">
            <button class="btn btn-outline" (click)="downloadPdf()" [disabled]="downloading()">
              @if (downloading()) {
                <span class="spinner-sm"></span> Generating...
              } @else {
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12h8M8 4v8M5 9l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Download PDF
              }
            </button>
            <button class="btn btn-gold" (click)="printCard()">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6V1h8v5M4 12H2.5A1.5 1.5 0 011 10.5v-3A1.5 1.5 0 012.5 6h11A1.5 1.5 0 0115 7.5v3a1.5 1.5 0 01-1.5 1.5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9h8v6H4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Print
            </button>
          </div>
        }
      </div>

      @if (loading()) {
        <div class="card card-elevated">
          <div class="card-body">
            <div class="empty-state">
              <div class="spinner"></div>
              <p>Loading admit card...</p>
            </div>
          </div>
        </div>
      } @else if (error()) {
        <div class="card card-elevated">
          <div class="card-body">
            <div class="empty-state error-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="#ef4444" stroke-width="2"/>
                <path d="M24 16v10M24 30v2" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <h3>Unable to Load Admit Card</h3>
              <p>{{ error() }}</p>
              <button class="btn btn-outline" (click)="loadAdmitCard()">Try Again</button>
            </div>
          </div>
        </div>
      } @else if (admitCard()) {
        <div class="admit-card-wrapper" id="admit-card">
          <div class="admit-card">
            <div class="card-header-section">
              <div class="university-name">Smart University</div>
              <div class="card-title">Examination Admit Card</div>
            </div>

            <div class="card-body-section">
              <div class="info-grid">
                <div class="info-row">
                  <span class="info-label">Admit Card Number</span>
                  <span class="info-value highlight">{{ admitCard()!.admitCardNumber }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Application Number</span>
                  <span class="info-value">{{ admitCard()!.applicationNumber }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Exam Date</span>
                  <span class="info-value">{{ admitCard()!.examDate | date:'fullDate' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Exam Center</span>
                  <span class="info-value">{{ admitCard()!.examCenter || 'To be announced' }}</span>
                </div>
              </div>

              @if (admitCard()!.downloaded) {
                <div class="downloaded-badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 7l2.5 2.5L10.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  PDF downloaded
                </div>
              }

              <div class="instructions">
                <h4>Instructions</h4>
                <ul>
                  <li>Bring this admit card along with a valid photo ID to the examination center.</li>
                  <li>Arrive at the examination center at least 30 minutes before the scheduled time.</li>
                  <li>No electronic devices (phones, calculators, etc.) are allowed in the exam hall.</li>
                  <li>Follow all invigilator instructions during the examination.</li>
                </ul>
              </div>
            </div>

            <div class="card-footer-section">
              <div class="signature-line">
                <div class="signature-block">
                  <div class="signature-line-inner"></div>
                  <span>Authorized Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="card card-elevated">
          <div class="card-body">
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="4" width="32" height="40" rx="3" stroke="currentColor" stroke-width="2"/>
                <path d="M16 16h16M16 24h12M16 32h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <h3>No Admit Card Found</h3>
              <p>Your admit card has not been generated yet. It will be available after your payment is confirmed.</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 800px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .page-title { font-family: var(--font-display); font-size: var(--fs-h1); margin-bottom: 0.25rem; }
    .page-subtitle { color: var(--color-text-muted); font-size: var(--fs-small); }
    .header-actions { display: flex; gap: 0.5rem; }

    .admit-card-wrapper {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .admit-card { color: #1a1a2e; }

    .card-header-section {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .university-name {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: 0.02em;
    }

    .card-title {
      font-size: 0.875rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .card-body-section { padding: 2rem; }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .info-row { display: flex; flex-direction: column; gap: 0.25rem; }
    .info-label {
      font-size: 0.75rem; color: #6b7280;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .info-value { font-size: 1rem; font-weight: 600; color: #1a1a2e; }
    .info-value.highlight { color: var(--color-gold); font-size: 1.125rem; }

    .downloaded-badge {
      display: inline-flex; align-items: center; gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      background: rgba(34,197,94,0.1); color: #16a34a;
      border-radius: var(--radius-sm);
      font-size: 0.75rem; font-weight: 500;
      margin-bottom: 1.25rem;
    }

    .instructions {
      background: #f8fafc;
      border-radius: 8px;
      padding: 1.25rem;
      border-left: 3px solid var(--color-gold);

      h4 { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a2e; }
      ul { margin: 0; padding-left: 1.25rem; }
      li { font-size: 0.8125rem; color: #4b5563; line-height: 1.6; margin-bottom: 0.25rem; }
    }

    .card-footer-section { padding: 1.5rem 2rem; border-top: 1px solid #e5e7eb; }
    .signature-line { display: flex; justify-content: flex-end; }
    .signature-block { text-align: center; min-width: 150px; }
    .signature-line-inner { border-bottom: 1px solid #1a1a2e; margin-bottom: 0.5rem; height: 40px; }
    .signature-block span { font-size: 0.75rem; color: #6b7280; }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--color-text-muted);
      svg { margin-bottom: 1rem; color: var(--color-text-muted); }
      h3 { font-family: var(--font-display); font-size: 1.125rem; margin-bottom: 0.5rem; color: var(--color-text-primary); }
      p { font-size: var(--fs-small); max-width: 400px; margin: 0 auto; }
    }

    .error-state {
      svg { color: #ef4444; }
      h3 { color: #ef4444; }
      .btn { margin-top: 1rem; }
    }

    .spinner {
      width: 32px; height: 32px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-gold);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .btn {
      padding: 0.625rem 1.25rem;
      border-radius: var(--radius-md);
      font-weight: var(--fw-semibold);
      cursor: pointer;
      border: none;
      font-size: var(--fs-small);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all var(--duration-fast) var(--ease-out);
    }

    .btn-gold {
      background: var(--color-gold);
      color: var(--color-bg);
      &:hover { opacity: 0.9; }
    }

    .btn-outline {
      background: transparent;
      border: 1.5px solid var(--color-border);
      color: var(--color-text-primary);
      &:hover { border-color: var(--color-gold); color: var(--color-gold); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .spinner-sm {
      width: 14px; height: 14px; border: 2px solid transparent;
      border-top-color: currentColor; border-radius: 50%;
      animation: spin 0.6s linear infinite; display: inline-block;
    }

    @media print {
      .page-header, .btn { display: none !important; }
      .admit-card-wrapper { box-shadow: none; border: 1px solid #ddd; }
      .page { max-width: 100%; }
    }

    @media (max-width: 640px) {
      .info-grid { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; gap: 1rem; }
      .header-actions { width: 100%; }
      .header-actions .btn { flex: 1; justify-content: center; }
    }
  `],
})
export class StudentAdmitCardComponent implements OnInit {
  admitCard = signal<AdmitCardData | null>(null);
  loading = signal(true);
  downloading = signal(false);
  error = signal<string | null>(null);
  private destroyRef = inject(DestroyRef);

  constructor(
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadAdmitCard();
  }

  loadAdmitCard(): void {
    this.loading.set(true);
    this.error.set(null);
    this.crud.customGet<AdmitCardData>('admit-cards/my').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.admitCard.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.admitCard.set(null);
        this.loading.set(false);
        if (err?.status === 404) {
          this.error.set('Your admit card has not been generated yet. It will be available after your payment is confirmed.');
        } else {
          this.error.set('Something went wrong while loading your admit card. Please try again.');
        }
      },
    });
  }

  downloadPdf(): void {
    this.downloading.set(true);
    const token = localStorage.getItem('access_token');
    fetch(`${environment.apiUrl}/admit-cards/my/download`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => {
      if (!res.ok) throw new Error('Download failed');
      return res.blob();
    }).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admit-card-${this.admitCard()?.admitCardNumber || 'download'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.downloading.set(false);
      this.toast.success('Admit card downloaded');
      const card = this.admitCard();
      if (card) this.admitCard.set({ ...card, downloaded: true });
    }).catch(() => {
      this.downloading.set(false);
      this.toast.error('Failed to download admit card');
    });
  }

  printCard(): void {
    window.print();
  }
}
