import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface MeritEntry {
  id: number; applicantId: number; applicantName: string;
  circularId: number; departmentId: number; departmentName: string;
  meritScore: number; position: number; published: boolean;
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
        <div class="form-group">
          <label class="form-label">Admission Circular</label>
          <select class="form-select" [(ngModel)]="selectedCircularId" (change)="loadMeritList()">
            <option [ngValue]="0">Select a circular</option>
          </select>
        </div>
      </div>
    </div>

    @if (entries().length > 0) {
      <div class="card card-elevated animate-fade-in-up stagger-2" style="margin-top:1.5rem">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <h3>Published Merit List</h3>
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
        <div class="card-body"><div class="empty-state"><p>No published merit list for this circular.</p></div></div>
      </div>
    }
  `,
  styles: [`
    .form-group { display: flex; flex-direction: column; max-width: 400px; }
    .form-label { margin-bottom: 0.375rem; }
    .empty-state { text-align: center; padding: 2rem; color: var(--color-text-muted); font-size: var(--fs-small); }
    .table { --bs-table-bg: transparent; --bs-table-color: var(--color-text-primary); --bs-table-border-color: var(--color-border); width: 100%; margin-bottom: 0;
      thead th { font-weight: var(--fw-semibold); color: var(--color-text-muted); text-transform: uppercase; font-size: var(--fs-xs); padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); }
      tbody td { padding: 0.75rem 1rem; font-size: var(--fs-small); border-bottom: 1px solid var(--color-border); }
    }
  `],
})
export class MeritListPageComponent implements OnInit {
  selectedCircularId = 0;
  entries = signal<MeritEntry[]>([]);

  constructor(private crud: CrudService, private toast: ToastService) {}
  ngOnInit(): void {}

  loadMeritList(): void {
    if (this.selectedCircularId === 0) { this.entries.set([]); return; }
    this.crud.listAll<MeritEntry>(`merit-lists/circular/${this.selectedCircularId}`).subscribe({
      next: (d) => this.entries.set(d),
      error: () => this.entries.set([]),
    });
  }
}
