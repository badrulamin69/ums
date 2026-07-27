import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface Circular {
  id: number; title: string; session: string; facultyId: number; facultyName: string;
  registrationStartDate: string; registrationEndDate: string;
  applicationFee: number; totalSeats: number; active: boolean;
}
interface Faculty { id: number; name: string; }

@Component({
  selector: 'app-circular-list',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent],
  template: `
    <app-page-header title="Admission Circulars" subtitle="Manage admission circulars and sessions">
      <button class="btn btn-gold" (click)="openModal()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Create Circular
      </button>
    </app-page-header>
    <app-data-table [columns]="columns" [rows]="rows()" [page]="currentPage()" [totalPages]="totalPages()" [totalElements]="totalElements()" [loading]="loading()" emptyTitle="No circulars" emptySubtitle="Create an admission circular to begin." (pageChange)="loadPage($event)" (rowClick)="openModal($event)" />

    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-panel wide animate-fade-in-up" (click)="$event.stopPropagation()">
          <div class="modal-header"><h2>{{ editing() ? 'Edit' : 'Create' }} Circular</h2><button class="btn-close" (click)="closeModal()"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div>
          <form class="modal-body" (ngSubmit)="save()">
            <div class="form-group"><label class="form-label">Title <span class="req">*</span></label><input type="text" class="form-control" [(ngModel)]="form.title" name="title" required placeholder="e.g. Fall 2026 Admission"></div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Session <span class="req">*</span></label><input type="text" class="form-control" [(ngModel)]="form.session" name="session" required placeholder="e.g. 2026-2027"></div>
              <div class="form-group"><label class="form-label">Faculty <span class="req">*</span></label>
                <select class="form-select" [(ngModel)]="form.facultyId" name="facultyId" required>
                  <option [ngValue]="0">Select faculty</option>
                  @for (f of faculties(); track f.id) { <option [ngValue]="f.id">{{ f.name }}</option> }
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Registration Start</label><input type="date" class="form-control" [(ngModel)]="form.registrationStartDate" name="registrationStartDate"></div>
              <div class="form-group"><label class="form-label">Registration End</label><input type="date" class="form-control" [(ngModel)]="form.registrationEndDate" name="registrationEndDate"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Application Fee (BDT)</label><input type="number" class="form-control" [(ngModel)]="form.applicationFee" name="applicationFee" min="0"></div>
              <div class="form-group"><label class="form-label">Total Seats</label><input type="number" class="form-control" [(ngModel)]="form.totalSeats" name="totalSeats" min="1"></div>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-ghost" (click)="closeModal()">Cancel</button><button type="submit" class="btn btn-gold" [disabled]="!isValid() || saving()">{{ saving() ? 'Saving...' : (editing() ? 'Update' : 'Create') }}</button></div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10001; }
    .modal-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); width: 90%; max-width: 480px; box-shadow: var(--shadow-lg); animation: fadeInUp 0.3s var(--ease-spring); &.wide { max-width: 560px; } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border); h2 { font-family: var(--font-display); font-size: var(--fs-h3); } }
    .btn-close { background: none; border: none; color: var(--color-text-muted); padding: 4px; cursor: pointer; &:hover { color: var(--color-text-primary); } }
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-label { margin-bottom: 0.375rem; }
    .req { color: var(--color-danger); }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; }
  `],
})
export class CircularListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'session', label: 'Session', sortable: true, width: '120px' },
    { key: 'facultyName', label: 'Faculty' },
    { key: 'registrationEndDate', label: 'Deadline', width: '130px' },
    { key: 'applicationFee', label: 'Fee', width: '100px', align: 'right' },
    { key: 'totalSeats', label: 'Seats', width: '80px', align: 'center' },
    { key: 'active', label: 'Status', width: '90px', align: 'center' },
  ];
  rows = signal<Circular[]>([]);
  faculties = signal<Faculty[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  showModal = signal(false);
  editing = signal<Circular | null>(null);
  saving = signal(false);
  form: any = { title: '', session: '', facultyId: 0, registrationStartDate: '', registrationEndDate: '', applicationFee: 0, totalSeats: 50 };

  constructor(private crud: CrudService, private toast: ToastService) {}

  ngOnInit(): void {
    this.crud.listAll<Faculty>('faculties/active').subscribe({ next: (d) => this.faculties.set(d) });
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<Circular>('admission-circulars', page, 10).subscribe({
      next: (d) => { this.rows.set(d.content); this.currentPage.set(d.number); this.totalPages.set(d.totalPages); this.totalElements.set(d.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  isValid(): boolean { return this.form.title && this.form.session && this.form.facultyId > 0; }

  openModal(item?: Circular): void {
    if (item) {
      this.editing.set(item);
      this.form = { title: item.title, session: item.session, facultyId: item.facultyId, registrationStartDate: item.registrationStartDate, registrationEndDate: item.registrationEndDate, applicationFee: item.applicationFee, totalSeats: item.totalSeats };
    } else {
      this.editing.set(null);
      this.form = { title: '', session: '', facultyId: 0, registrationStartDate: '', registrationEndDate: '', applicationFee: 0, totalSeats: 50 };
    }
    this.showModal.set(true);
  }
  closeModal(): void { this.showModal.set(false); this.editing.set(null); }

  save(): void {
    if (!this.isValid()) return;
    this.saving.set(true);
    const obs = this.editing() ? this.crud.update('admission-circulars', this.editing()!.id, this.form) : this.crud.create('admission-circulars', this.form);
    obs.subscribe({
      next: () => { this.toast.success(this.editing() ? 'Updated' : 'Created'); this.closeModal(); this.loadPage(this.currentPage()); this.saving.set(false); },
      error: () => this.saving.set(false),
    });
  }
}
