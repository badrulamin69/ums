import { Component, output, signal, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-face-capture',
  standalone: true,
  template: `
    <div class="face-capture">
      @if (!capturedImage()) {
        <div class="camera-container">
          <video #videoElement autoplay playsinline class="camera-feed"></video>
          @if (cameraError()) {
            <div class="camera-error">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="var(--color-danger)" stroke-width="2" stroke-dasharray="4 4"/>
                <path d="M24 14v12M24 30v2" stroke="var(--color-danger)" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <p>{{ cameraError() }}</p>
            </div>
          }
          <div class="camera-overlay">
            <div class="face-guide"></div>
          </div>
        </div>
        <button class="btn btn-gold btn-capture" (click)="capture()" [disabled]="!cameraReady()">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
            <circle cx="10" cy="10" r="3" fill="currentColor"/>
          </svg>
          Capture
        </button>
      } @else {
        <div class="preview-container">
          <img [src]="capturedImage()" alt="Captured face" class="preview-image"/>
        </div>
        <div class="preview-actions">
          <button class="btn btn-outline-gold" (click)="retake()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.5 8a6.5 6.5 0 0111.47-4.47M14.5 8a6.5 6.5 0 01-11.47 4.47" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M13 1v3.5h-3.5M3 15v-3.5h3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Retake
          </button>
          <button class="btn btn-gold" (click)="confirm()" [disabled]="processing()">
            @if (processing()) {
              <span class="spinner"></span>
              Processing...
            } @else {
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Confirm
            }
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .face-capture {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }

    .camera-container {
      position: relative;
      width: 320px;
      height: 240px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--color-bg);
      border: 2px solid var(--color-border);
    }

    .camera-feed {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scaleX(-1);
    }

    .camera-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .face-guide {
      width: 140px;
      height: 170px;
      border: 2px solid var(--color-gold);
      border-radius: 50%;
      opacity: 0.6;
    }

    .camera-error {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      color: var(--color-danger);
      font-size: var(--fs-small);
      text-align: center;
      padding: 1rem;
    }

    .btn-capture {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .preview-container {
      width: 320px;
      height: 240px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 2px solid var(--color-gold);
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scaleX(-1);
    }

    .preview-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border-radius: var(--radius-sm);
      font-size: var(--fs-small);
      font-weight: var(--fw-medium);
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out);
      border: none;
    }

    .btn-gold {
      background: var(--color-gold);
      color: var(--color-obsidian);

      &:hover:not(:disabled) { opacity: 0.9; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .btn-outline-gold {
      background: transparent;
      color: var(--color-gold);
      border: 1px solid var(--color-gold);

      &:hover { background: var(--color-gold-dim); }
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid var(--color-obsidian);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class FaceCaptureComponent implements OnDestroy {
  captured = output<string>();

  capturedImage = signal<string | null>(null);
  cameraReady = signal(false);
  cameraError = signal<string | null>(null);
  processing = signal(false);

  private stream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;

  ngAfterViewInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  private async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });
      const video = document.querySelector('video');
      if (video) {
        this.videoEl = video;
        video.srcObject = this.stream;
        video.onloadedmetadata = () => {
          this.cameraReady.set(true);
        };
      }
    } catch {
      this.cameraError.set('Camera access denied. Please allow camera permissions.');
    }
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
  }

  capture() {
    if (!this.videoEl) return;
    const canvas = document.createElement('canvas');
    canvas.width = this.videoEl.videoWidth;
    canvas.height = this.videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(this.videoEl, 0, 0);
    const base64 = canvas.toDataURL('image/png').split(',')[1];
    this.capturedImage.set(`data:image/png;base64,${base64}`);
    this.stopCamera();
  }

  retake() {
    this.capturedImage.set(null);
    this.startCamera();
  }

  confirm() {
    if (!this.capturedImage()) return;
    this.processing.set(true);
    const base64 = this.capturedImage()!.split(',')[1];
    this.captured.emit(base64);
  }

  setProcessing(value: boolean) {
    this.processing.set(value);
  }
}
