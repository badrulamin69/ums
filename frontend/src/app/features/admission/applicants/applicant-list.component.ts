import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

interface Applicant {
  id: number; firstName: string; middleName: string; lastName: string; phone: string;
  gender: string; circularTitle: string; preferredDepartmentName: string;
  status: string; applicationNumber: string; meritScore: number;
}

interface ApplicantDocument {
  id: number;
  applicantId: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  verified: boolean;
}

interface DocumentType {
  id: number;
  name: string;
  description: string;
  required: boolean;
  allowedFormats: string;
  active: boolean;
}

@Component({
  selector: 'app-applicant-list',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent, ConfirmDialogComponent],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header title="Applicants" subtitle="Review and manage admission applicants" />

      <div class="card card-elevated">
        <div class="card-body">
          <app-data-table
            [columns]="columns"
            [rows]="rows()"
            [page]="currentPage()"
            [totalPages]="totalPages()"
            [totalElements]="totalElements()"
            [loading]="loading()"
            emptyTitle="No applicants"
            emptySubtitle="Applicants will appear after registration."
            (pageChange)="loadPage($event)"
            (rowClick)="viewDocuments($event)"
          />
        </div>
      </div>

      @if (selectedApplicant()) {
        <div class="modal-overlay" (click)="closeDocuments()">
          <div class="modal-panel animate-fade-in-up wide-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Documents - {{ selectedApplicant()!.firstName }} {{ selectedApplicant()!.lastName }}</h2>
              <button class="btn-close" (click)="closeDocuments()">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>

            <div class="modal-body">
              <div class="upload-section">
                <h3 class="section-title">Upload New Document</h3>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Document Type <span class="required">*</span></label>
                    <select class="form-control" [(ngModel)]="uploadDocType">
                      <option value="">Select type</option>
                      @for (dt of documentTypes(); track dt.id) {
                        <option [value]="dt.name">{{ dt.name }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">File <span class="required">*</span></label>
                    <input type="file" class="form-control" (change)="onFileSelected($event)" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
                  </div>
                </div>
                <button class="btn btn-gold btn-sm" (click)="uploadDocument()" [disabled]="!uploadDocType || !selectedFile() || uploading()">
                  @if (uploading()) { <span class="spinner-sm"></span> Uploading... } @else { Upload }
                </button>
              </div>

              <div class="documents-section">
                <h3 class="section-title">Uploaded Documents</h3>
                @if (documents().length > 0) {
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>File Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (doc of documents(); track doc.id) {
                        <tr>
                          <td>{{ doc.documentType }}</td>
                          <td>
                            <a [href]="getFileUrl(doc.fileUrl)" target="_blank" class="file-link">{{ doc.fileName }}</a>
                          </td>
                          <td>
                            <span class="badge" [class.badge-success]="doc.verified" [class.badge-warning]="!doc.verified">
                              {{ doc.verified ? 'Verified' : 'Pending' }}
                            </span>
                          </td>
                          <td>
                            @if (!doc.verified) {
                              <button class="btn btn-ghost btn-sm" (click)="verifyDocument(doc.id)">Verify</button>
                            }
                            <button class="btn btn-ghost btn-sm text-danger" (click)="confirmDeleteDoc.set(doc)">Delete</button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                } @else {
                  <div class="empty-state"><p>No documents uploaded yet.</p></div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      @if (confirmDeleteDoc()) {
        <app-confirm-dialog
          title="Delete Document"
          [message]="'Are you sure you want to delete ' + confirmDeleteDoc()!.fileName + '?'"
          confirmLabel="Delete"
          type="danger"
          (confirm)="doDeleteDoc()"
          (cancel)="confirmDeleteDoc.set(null)"
        />
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px); display: flex; align-items: center;
      justify-content: center; z-index: 10001; animation: fadeIn 0.2s var(--ease-out);
    }
    .modal-panel {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); width: 90%; max-width: 800px;
      box-shadow: var(--shadow-lg); animation: fadeInUp 0.3s var(--ease-spring);
      max-height: 85vh; display: flex; flex-direction: column;
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border);
      h2 { font-family: var(--font-display); font-size: var(--fs-h3); }
    }
    .btn-close {
      background: none; border: none; color: var(--color-text-muted); padding: 4px;
      cursor: pointer; border-radius: var(--radius-sm);
      &:hover { color: var(--color-text-primary); background: var(--color-surface-elevated); }
    }
    .modal-body {
      padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;
      overflow-y: auto; flex: 1;
    }

    .section-title {
      font-family: var(--font-display); font-size: var(--fs-h4);
      margin-bottom: 1rem;
    }

    .upload-section {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .form-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
      margin-bottom: 1rem;
    }
    .form-group { display: flex; flex-direction: column; }
    .form-label { margin-bottom: 0.375rem; }
    .required { color: var(--color-danger); }

    .file-link {
      color: var(--color-gold);
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    .badge {
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-sm);
      font-size: var(--fs-xs);
      font-weight: var(--fw-semibold);
    }
    .badge-success {
      background: rgba(16,185,129,0.12);
      color: #10B981;
    }
    .badge-warning {
      background: rgba(245,158,11,0.12);
      color: #F59E0B;
    }

    .table {
      --bs-table-bg: transparent;
      --bs-table-color: var(--color-text-primary);
      --bs-table-border-color: var(--color-border);
      width: 100%;
      margin-bottom: 0;
      thead th {
        font-weight: var(--fw-semibold); color: var(--color-text-muted);
        text-transform: uppercase; font-size: var(--fs-xs);
        padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border);
      }
      tbody td {
        padding: 0.75rem 1rem; font-size: var(--fs-small);
        border-bottom: 1px solid var(--color-border);
      }
    }

    .empty-state {
      text-align: center; padding: 2rem; color: var(--color-text-muted);
      font-size: var(--fs-small);
    }

    .spinner-sm {
      width: 14px; height: 14px; border: 2px solid transparent;
      border-top-color: currentColor; border-radius: 50%;
      animation: spin 0.6s linear infinite; display: inline-block;
    }

    .text-danger { color: var(--color-danger); }
  `],
})
export class ApplicantListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'applicationNumber', label: 'App. #', sortable: true, width: '140px' },
    { key: 'firstName', label: 'Name', sortable: true },
    { key: 'circularTitle', label: 'Circular' },
    { key: 'preferredDepartmentName', label: 'Dept.' },
    { key: 'meritScore', label: 'Score', width: '80px', align: 'center' },
    { key: 'status', label: 'Status', width: '130px', align: 'center' },
  ];

  rows = signal<Applicant[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);

  selectedApplicant = signal<Applicant | null>(null);
  documents = signal<ApplicantDocument[]>([]);
  documentTypes = signal<DocumentType[]>([]);
  selectedFile = signal<File | null>(null);
  uploadDocType = '';
  uploading = signal(false);
  confirmDeleteDoc = signal<ApplicantDocument | null>(null);

  private readonly fileBaseUrl = environment.apiUrl.replace('/api', '/files');

  constructor(
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadPage(0);
    this.crud.listAll<DocumentType>('document-types').subscribe({
      next: (types) => this.documentTypes.set(types || []),
    });
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<Applicant>('applicants', page, 10).subscribe({
      next: (d) => {
        this.rows.set(d.content || []);
        this.currentPage.set(d.number);
        this.totalPages.set(d.totalPages);
        this.totalElements.set(d.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  viewDocuments(applicant: Applicant): void {
    this.selectedApplicant.set(applicant);
    this.loadDocuments(applicant.id);
  }

  closeDocuments(): void {
    this.selectedApplicant.set(null);
    this.documents.set([]);
    this.selectedFile.set(null);
    this.uploadDocType = '';
  }

  loadDocuments(applicantId: number): void {
    this.crud.listAll<ApplicantDocument>(`applicant-documents/applicant/${applicantId}`).subscribe({
      next: (docs) => this.documents.set(docs || []),
      error: () => this.documents.set([]),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  uploadDocument(): void {
    const applicant = this.selectedApplicant();
    const file = this.selectedFile();
    if (!applicant || !file || !this.uploadDocType) return;

    this.uploading.set(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('applicantId', applicant.id.toString());
    formData.append('documentType', this.uploadDocType);

    this.crud.uploadFile<ApplicantDocument>('applicant-documents', formData).subscribe({
      next: () => {
        this.toast.success('Document uploaded');
        this.selectedFile.set(null);
        this.uploadDocType = '';
        this.loadDocuments(applicant.id);
        this.uploading.set(false);
      },
      error: () => {
        this.toast.error('Upload failed');
        this.uploading.set(false);
      },
    });
  }

  verifyDocument(docId: number): void {
    this.crud.customPut(`applicant-documents/${docId}/verify`).subscribe({
      next: () => {
        this.toast.success('Document verified');
        if (this.selectedApplicant()) {
          this.loadDocuments(this.selectedApplicant()!.id);
        }
      },
      error: () => this.toast.error('Failed to verify'),
    });
  }

  doDeleteDoc(): void {
    const doc = this.confirmDeleteDoc();
    if (!doc) return;

    this.crud.delete('applicant-documents', doc.id).subscribe({
      next: () => {
        this.toast.success('Document deleted');
        this.confirmDeleteDoc.set(null);
        if (this.selectedApplicant()) {
          this.loadDocuments(this.selectedApplicant()!.id);
        }
      },
    });
  }

  getFileUrl(fileUrl: string): string {
    if (fileUrl.startsWith('http')) return fileUrl;
    return this.fileBaseUrl + fileUrl;
  }
}