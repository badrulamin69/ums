import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

(window as any).__angularErrors = [];

bootstrapApplication(App, appConfig).catch((err) => {
  console.error('BOOTSTRAP ERROR:', err);
  (window as any).__angularErrors.push(err);
});
