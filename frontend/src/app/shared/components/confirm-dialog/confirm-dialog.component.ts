import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="confirm-overlay" (click)="cancel.emit()">
      <div class="confirm-dialog" (click)="$event.stopPropagation()">
        <div class="confirm-icon" [class.danger]="type() === 'danger'">
          @switch (type()) {
            @case ('danger') {
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            }
            @default {
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            }
          }
        </div>
        <h3 class="confirm-title">{{ title() }}</h3>
        <p class="confirm-message">{{ message() }}</p>
        <div class="confirm-actions">
          <button class="btn btn-ghost" (click)="cancel.emit()">Cancel</button>
          <button class="btn" [class.btn-danger]="type() === 'danger'" [class.btn-gold]="type() !== 'danger'" (click)="confirm.emit()">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      animation: fadeIn 0.2s var(--ease-out);
    }

    .confirm-dialog {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      animation: fadeInUp 0.3s var(--ease-spring);
    }

    .confirm-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-info-bg);
      color: var(--color-info);

      &.danger {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }
    }

    .confirm-title {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      margin-bottom: 0.5rem;
    }

    .confirm-message {
      color: var(--color-text-secondary);
      font-size: var(--fs-small);
      margin-bottom: 1.5rem;
    }

    .confirm-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }
  `],
})
export class ConfirmDialogComponent {
  title = input('Are you sure?');
  message = input('This action cannot be undone.');
  confirmLabel = input('Confirm');
  type = input<'danger' | 'warning' | 'info'>('info');
  confirm = output();
  cancel = output();
}
