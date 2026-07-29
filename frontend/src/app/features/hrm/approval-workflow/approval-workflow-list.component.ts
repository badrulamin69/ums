import { Component, signal, OnInit , DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface ApprovalWorkflow {
  id: number;
  entityType: string;
  entityId: number;
  name: string;
  status: string;
}

interface ApprovalStep {
  id: number;
  workflowId: number;
  stepOrder: number;
  approverRole: string;
  approverId: number;
  status: string;
  comments: string;
  decidedAt: string;
}

interface ApprovalStepActionRequest {
  stepId: number;
  action: string;
  comments: string;
}

@Component({
  selector: 'app-approval-workflow-list',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header title="Approval Workflows" subtitle="Manage entity approval workflows and steps">
        
      </app-page-header>

      <div class="card card-elevated">
        <div class="card-body">
          <app-data-table
            [columns]="columns"
            [rows]="workflows()"
            [page]="currentPage()"
            [totalPages]="totalPages()"
            [totalElements]="totalElements()"
            [loading]="loading()"
            emptyTitle="No approval workflows found"
            emptySubtitle="Create your first approval workflow to manage entity approvals."
            (pageChange)="loadPage($event)"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-title { font-family: var(--font-display); font-size: var(--fs-h1); margin-bottom: 0.25rem; }
    .page-subtitle { color: var(--color-text-muted); font-size: var(--fs-small); }
  `],
})
export class ApprovalWorkflowListComponent implements OnInit {
  workflows = signal<ApprovalWorkflow[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  private destroyRef = inject(DestroyRef);

  constructor(
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<ApprovalWorkflow>('approval-workflows', page, 10).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.workflows.set(data.content || []);
        this.currentPage.set(data.number);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  processApprovalStep(request: ApprovalStepActionRequest): void {
    this.crud.customPost('approval-workflows/step/action', request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success('Approval step processed');
        this.loadPage(this.currentPage());
      },
      error: () => this.toast.error('Failed to process approval step'),
    });
  }

  columns: TableColumn[] = [
    { key: 'name', label: 'Workflow Name', sortable: true },
    { key: 'entityType', label: 'Entity Type', width: '120px', align: 'center' },
    { key: 'entityId', label: 'Entity ID', width: '100px', align: 'center' },
    { key: 'status', label: 'Status', width: '100px', align: 'center' },
    { key: 'id', label: '', width: '80px', align: 'center' },
  ];
}