import { Component, signal, OnInit , DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface MeritEntry {
  id: number; applicantId: number; applicantName: string;
  circularId: number; departmentId: number; departmentName: string;
  meritScore: number; position: number; published: boolean;
}

interface AdmissionCircular {
  id: number; title: string; academicYear: string; active: boolean;
}

@Component({
  selector: 'app-merit-list-page',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Merit Lists" subtitle="Generate and publish admission merit lists" />

    <div class="card card-elevated animate-fade-in-up stagger-1">
      <div class="card-header"><h3>Select Circular</h3></div>
      <div class="card-body">
        <div class="form-row-compact">
          <div class="form-group" style="flex:1">
            <label class="form-label">Admission Circular</label>
            <select class="form-select" [(ngModel)]="selectedCircularId" (change)="loadMeritList()">
              <option [ngValue]="0">Select a circular</option>
              @for (c of circulars(); track c.id) {
                <option [ngValue]="c.id">{{ c.title }} ({{ c.academicYear }})</option>
              }
            </select>
          </div>
          <div class="action-buttons">
            <button class="btn btn-gold" [disabled]="selectedCircularId === 0 || generating()" (click)="generateList()">
              {{ generating() ? 'Generating...' : 'Generate' }}
            </button>
            <button class="btn btn-gold" [disabled]="selectedCircularId === 0 || entries().length === 0 || publishing()" (click)="publishList()">
              {{ publishing() ? 'Publishing...' : 'Publish' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    @if (entries().length > 0) {
      <div class="card card-elevated animate-fade-in-up stagger-2" style="margin-top:1.5rem">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <h3>Merit List</h3>
          <span class="badge badge-{{ entries()[0]?.published ? 'published' : 'draft' }}">{{ entries()[0]?.published ? 'Published' : 'Draft' }}</span>
        </div>
        <div class="card-body">
          <table class="table">
            <thead><tr><th>#</th><th>Applicant</th><th>Department</th><th>Score</th></tr></thead>
            <tbody>
              @for (e of entries(); track e.id) {
                <tr>
                  <td>{{ e.position }}</td>
                  <td>{{ e.applicantName }}</td>
                  <td>{{ e.departmentName }}</td>
                  <td class="text-gold" style="font-weight:600">{{ e.meritScore }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    } @else if (selectedCircularId > 0) {
      <div class="card card-elevated animate-fade-in-up stagger-2" style="margin-top:1.5rem">
        <div class="card-body"><div class="empty-state"><p>No merit list for this circular. Click "Generate" to create one.</p></div></div>
      </div>
    }
  `,
  styles: [`
    .form-row-compact { display: flex; gap: 1rem; align-items: flex-end; }
    .form-group { display: flex; flex-direction: column; }
    .form-label { margin-bottom: 0.375rem; }
    .action-buttons { display: flex; gap: 0.5rem; flex-shrink: 0; }
    .empty-state { text-align: center; padding: 2rem; color: var(--color-text-muted); font-size: var(--fs-small); }
    .badge { padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: var(--fs-xs); font-weight: var(--fw-semibold); text-transform: uppercase; }
    .badge-published { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .badge-draft { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .table { --bs-table-bg: transparent; --bs-table-color: var(--color-text-primary); --bs-table-border-color: var(--color-border); width: 100%; margin-bottom: 0;
      thead th { font-weight: var(--fw-semibold); color: var(--color-text-muted); text-transform: uppercase; font-size: var(--fs-xs); padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); }
      tbody td { padding: 0.75rem 1rem; font-size: var(--fs-small); border-bottom: 1px solid var(--color-border); }
    }
  `],
})
export class MeritListPageComponent implements OnInit {
  selectedCircularId = 0;
  entries = signal<MeritEntry[]>([]);
  circulars = signal<AdmissionCircular[]>([]);
  generating = signal(false);
  publishing = signal(false);
  private destroyRef = inject(DestroyRef);

  constructor(private crud: CrudService, private toast: ToastService) {}
  ngOnInit(): void {
    this.crud.listAll<AdmissionCircular>('admission-circulars').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.circulars.set(data || []),
      error: () => this.circulars.set([]),
    });
  }

  loadMeritList(): void {
    if (this.selectedCircularId === 0) { this.entries.set([]); return; }
    this.crud.listAll<MeritEntry>(`merit-lists/circular/${this.selectedCircularId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (d) => this.entries.set(d),
      error: () => this.entries.set([]),
    });
  }

  generateList(): void {
    if (!this.selectedCircularId) return;
    this.generating.set(true);
    this.crud.customPost<any, MeritEntry[]>(`merit-lists/generate/${this.selectedCircularId}`, {}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (d) => { this.entries.set(d); this.toast.success('Merit list generated'); this.generating.set(false); },
      error: () => { this.toast.error('Failed to generate'); this.generating.set(false); },
    });
  }

  publishList(): void {
    if (!this.selectedCircularId) return;
    this.publishing.set(true);
    this.crud.customPost<any, any>(`merit-lists/publish/${this.selectedCircularId}`, {}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.toast.success('Merit list published'); this.loadMeritList(); this.publishing.set(false); },
      error: () => { this.toast.error('Failed to publish'); this.publishing.set(false); },
    });
  }
}
