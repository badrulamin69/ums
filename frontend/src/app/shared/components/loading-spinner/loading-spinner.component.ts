import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-wrapper">
      <div class="spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
    }

    .spinner {
      position: relative;
      width: 40px;
      height: 40px;
    }

    .spinner-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid transparent;
      border-top-color: var(--color-gold);
      animation: spin 1.2s linear infinite;

      &:nth-child(2) {
        inset: 4px;
        border-top-color: var(--color-gold-hover);
        animation-duration: 0.9s;
        animation-direction: reverse;
      }

      &:nth-child(3) {
        inset: 8px;
        border-top-color: var(--color-gold-dim);
        animation-duration: 1.5s;
      }
    }
  `],
})
export class LoadingSpinnerComponent {}
