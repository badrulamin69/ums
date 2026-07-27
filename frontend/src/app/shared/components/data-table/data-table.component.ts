import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  cellClass?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-table-wrapper">
      @if (loading()) {
        <div class="table-skeleton">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton-row">
              @for (col of columns(); track col.key) {
                <div class="skeleton-cell skeleton"></div>
              }
            </div>
          }
        </div>
      } @if (rows().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/>
              <path d="M6 18h36M18 18v20" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <p class="empty-title">{{ emptyTitle() }}</p>
          <p class="empty-subtitle">{{ emptySubtitle() }}</p>
        </div>
      } @else {
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                @for (col of columns(); track col.key) {
                  <th [style.width]="col.width" [style.text-align]="col.align || 'left'"
                      [class.sortable]="col.sortable"
                      (click)="col.sortable && onSort(col.key)">
                    {{ col.label }}
                    @if (col.sortable && sortKey() === col.key) {
                      <span class="sort-indicator">{{ sortDir() === 'asc' ? '&#9650;' : '&#9660;' }}</span>
                    }
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of rows(); track getTrackValue(row); let i = $index) {
                <tr (click)="onRowClick(row)" [class.clickable]="true">
                  @for (col of columns(); track col.key) {
                    <td [class]="col.cellClass || ''" [style.text-align]="col.align || 'left'">
                      <ng-container *ngTemplateOutlet="cellTemplate; context: { $implicit: getCellValue(row, col.key), col: col, row: row, value: getCellValue(row, col.key) }"></ng-container>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (totalPages() > 1) {
          <div class="table-footer">
            <span class="table-info">
              Page {{ page() + 1 }} of {{ totalPages() }}
              <span class="table-total">({{ totalElements() }} total)</span>
            </span>
            <div class="table-pagination">
              <button class="btn btn-ghost btn-sm" (click)="onPageChange(page() - 1)" [disabled]="page() === 0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
              @for (p of visiblePages(); track p) {
                <button class="btn btn-sm" [class.btn-gold]="p === page()" [class.btn-ghost]="p !== page()" (click)="onPageChange(p)">
                  {{ p + 1 }}
                </button>
              }
              <button class="btn btn-ghost btn-sm" (click)="onPageChange(page() + 1)" [disabled]="page() >= totalPages() - 1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        }
      }
    </div>
    <ng-template #cellTemplate let-col="col" let-row="row" let-value="value">
      {{ value }}
    </ng-template>
  `,
  styles: [`
    .data-table-wrapper {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .table-scroll {
      overflow-x: auto;
    }

    .table {
      --bs-table-bg: transparent;
      --bs-table-color: var(--color-text-primary);
      --bs-table-border-color: var(--color-border);
      width: 100%;
      margin-bottom: 0;

      thead th {
        font-family: var(--font-body);
        font-weight: var(--fw-semibold);
        color: var(--color-text-muted);
        text-transform: uppercase;
        font-size: var(--fs-xs);
        letter-spacing: 0.06em;
        padding: 0.875rem 1rem;
        border-bottom: 1px solid var(--color-border);
        white-space: nowrap;
        position: sticky;
        top: 0;
        background: var(--color-surface);

        &.sortable {
          cursor: pointer;
          user-select: none;

          &:hover { color: var(--color-gold); }
        }
      }

      tbody tr {
        transition: background-color var(--duration-fast) var(--ease-out);

        &:hover { background-color: var(--color-surface-elevated); }
        &.clickable { cursor: pointer; }
      }

      tbody td {
        padding: 0.75rem 1rem;
        font-size: var(--fs-small);
        vertical-align: middle;
        border-bottom: 1px solid var(--color-border);
      }
    }

    .sort-indicator {
      margin-left: 0.25rem;
      font-size: 10px;
      color: var(--color-gold);
    }

    .table-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--color-border);
    }

    .table-info {
      font-size: var(--fs-small);
      color: var(--color-text-muted);
    }

    .table-total {
      color: var(--color-text-muted);
      font-size: var(--fs-xs);
    }

    .table-pagination {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .btn-sm {
      padding: 0.3rem 0.6rem;
      font-size: var(--fs-xs);
      min-width: 32px;
      height: 32px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-icon {
      color: var(--color-text-muted);
      opacity: 0.4;
      margin-bottom: 1rem;
    }

    .empty-title {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      color: var(--color-text-secondary);
      margin-bottom: 0.25rem;
    }

    .empty-subtitle {
      font-size: var(--fs-small);
      color: var(--color-text-muted);
    }

    .table-skeleton {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .skeleton-row {
      display: flex;
      gap: 1rem;
    }

    .skeleton-cell {
      height: 16px;
      flex: 1;
    }
  `],
})
export class DataTableComponent<T> {
  columns = input.required<TableColumn[]>();
  rows = input<T[]>([]);
  page = input(0);
  totalPages = input(1);
  totalElements = input(0);
  loading = input(false);
  emptyTitle = input('No data found');
  emptySubtitle = input('There are no records to display yet.');
  trackBy = input<string>('');

  sort = output<{ key: string; dir: 'asc' | 'desc' }>();
  pageChange = output<number>();
  rowClick = output<T>();

  sortKey = signal('');
  sortDir = signal<'asc' | 'desc'>('asc');

  visiblePages = signal<number[]>([]);

  constructor() {
    effect(() => {
      const current = this.page();
      const total = this.totalPages();
      const pages: number[] = [];
      const maxVisible = 5;
      let start = Math.max(0, current - Math.floor(maxVisible / 2));
      const end = Math.min(total, start + maxVisible);
      start = Math.max(0, end - maxVisible);
      for (let i = start; i < end; i++) pages.push(i);
      this.visiblePages.set(pages);
    });
  }

  onSort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.sort.emit({ key: this.sortKey(), dir: this.sortDir() });
  }

  getTrackValue(row: T): any {
    const key = this.trackBy();
    return key ? (row as any)[key] : row;
  }

  getCellValue(row: T, key: string): any {
    return (row as any)[key];
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
