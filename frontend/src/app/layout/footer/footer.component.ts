import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-icon">SU</span>
          <div>
            <div class="footer-name">Smart University</div>
            <div class="footer-tagline">Excellence in Education</div>
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4>Quick Links</h4>
            <a routerLink="/">Home</a>
            <a routerLink="/faculties">Faculties</a>
            <a routerLink="/dashboard">Student Portal</a>
            <a routerLink="/notices">Notices</a>
          </div>
          <div class="footer-col">
            <h4>Admissions</h4>
            <a routerLink="/admission">Apply Now</a>
            <a routerLink="/admission">Fee Structure</a>
            <a routerLink="/admission">Scholarships</a>
            <a routerLink="/contact">FAQs</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <p>University Road, Academic City</p>
            <p>info&#64;smartuniversity.edu</p>
            <p>+880 1234 567890</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{year}} Smart University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--primary);
      color: rgba(255,255,255,0.85);
      margin-top: auto;
    }
    .footer-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 3rem 1.5rem 1.5rem;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      .brand-icon {
        background: var(--accent);
        color: var(--primary-dark);
        font-weight: 700;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius);
      }
      .footer-name {
        font-family: var(--font-serif);
        font-weight: 700;
        font-size: 1.125rem;
        color: white;
      }
      .footer-tagline {
        font-size: 0.8125rem;
        opacity: 0.7;
      }
    }
    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    .footer-col {
      h4 {
        color: white;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      a, p {
        display: block;
        color: rgba(255,255,255,0.65);
        font-size: 0.875rem;
        margin-bottom: 0.375rem;
        &:hover { color: var(--accent); }
      }
    }
    .footer-bottom {
      text-align: center;
      p {
        font-size: 0.8125rem;
        opacity: 0.5;
      }
    }
    @media (max-width: 768px) {
      .footer-links { grid-template-columns: 1fr; gap: 1.5rem; }
    }
  `],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
