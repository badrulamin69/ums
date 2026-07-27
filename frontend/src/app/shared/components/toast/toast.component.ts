import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts; track toast.id) {
        <div class="toast-item toast-{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              }
              @case ('error') {
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              }
              @case ('warning') {
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4v4M8 11h.007" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              }
              @default {
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3M8 10h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              }
            }
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          @if (toast.dismissible) {
            <button class="toast-close" (click)="toastService.dismiss(toast.id); $event.stopPropagation()">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }

    .toast-item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      cursor: pointer;
      animation: slideInRight 0.3s var(--ease-out) both;
      font-size: var(--fs-small);
      color: var(--color-text-primary);
    }

    .toast-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-success .toast-icon {
      background: var(--color-success-bg);
      color: var(--color-success);
    }

    .toast-error .toast-icon {
      background: var(--color-danger-bg);
      color: var(--color-danger);
    }

    .toast-warning .toast-icon {
      background: var(--color-warning-bg);
      color: var(--color-warning);
    }

    .toast-info .toast-icon {
      background: var(--color-info-bg);
      color: var(--color-info);
    }

    .toast-message {
      flex: 1;
    }

    .toast-close {
      background: none;
      border: none;
      color: var(--color-text-muted);
      padding: 2px;
      cursor: pointer;
      border-radius: 4px;
      transition: color var(--duration-fast) var(--ease-out);

      &:hover { color: var(--color-text-primary); }
    }
  `],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
