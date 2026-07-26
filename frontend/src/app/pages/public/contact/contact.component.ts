import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Reach out with any questions.</p>
      </div>

      <div class="contact-grid">
        <div class="card contact-card">
          <div class="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h3>Visit Us</h3>
          <p>University Road, Academic City<br/>Smart University Campus</p>
        </div>
        <div class="card contact-card">
          <div class="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <h3>Call Us</h3>
          <p>+880 1234 567890<br/>Sun - Thu, 9:00 AM - 5:00 PM</p>
        </div>
        <div class="card contact-card">
          <div class="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h3>Email Us</h3>
          <p>info&#64;smartuniversity.edu<br/>admissions&#64;smartuniversity.edu</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .contact-card {
      text-align: center;
      padding: 2rem 1.5rem;
    }
    .contact-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(15, 42, 74, 0.08);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    .contact-card h3 {
      font-size: 1.0625rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }
    .contact-card p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  `],
})
export class ContactComponent {}
