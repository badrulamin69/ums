import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Notices & Announcements</h1>
        <p>Stay updated with the latest from Smart University.</p>
      </div>

      <div class="notice-list">
        <div class="card notice-card" *ngFor="let n of notices">
          <div class="notice-date">
            <span class="day">{{n.day}}</span>
            <span class="month">{{n.month}}</span>
          </div>
          <div class="notice-body">
            <h3>{{n.title}}</h3>
            <p>{{n.summary}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .notice-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .notice-card {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      padding: 1.25rem;
    }
    .notice-date {
      width: 56px;
      text-align: center;
      flex-shrink: 0;
      .day { display: block; font-size: 1.5rem; font-weight: 700; color: var(--primary); line-height: 1.2; }
      .month { display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
    }
    .notice-body {
      flex: 1;
      h3 { font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem; }
      p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; }
    }
  `],
})
export class NoticesComponent {
  notices = [
    { day: '15', month: 'Jul', title: 'Fall 2026 Registration Now Open', summary: 'Online registration for the Fall 2026 semester is now available. Students must complete registration by August 15th.' },
    { day: '10', month: 'Jul', title: 'Mid-Term Exam Schedule Published', summary: 'The mid-term examination schedule for Summer 2026 has been published. Please check your student portal for details.' },
    { day: '01', month: 'Jul', title: 'Campus Library Extended Hours', summary: 'The central library will remain open until 10 PM during the examination period to support student preparation.' },
    { day: '25', month: 'Jun', title: 'Annual Science Fair Announced', summary: 'The 12th Annual Science Fair will be held on September 20th. Registration closes August 30th.' },
  ];
}
