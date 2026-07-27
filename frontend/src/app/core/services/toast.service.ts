import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  dismissible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts: Toast[] = [];

  show(message: string, type: Toast['type'] = 'info', dismissible = true): void {
    const toast: Toast = { id: ++this.counter, message, type, dismissible };
    this.toasts.push(toast);
    setTimeout(() => this.dismiss(toast.id), 5000);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
