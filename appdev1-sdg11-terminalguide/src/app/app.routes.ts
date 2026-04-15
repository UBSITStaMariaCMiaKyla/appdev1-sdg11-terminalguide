// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'terminal/:id', component: TerminalDetailComponent },
  { path: 'sdg-info', component: SdgInfoComponent },   // guard added in CI2
  { path: 'feedback', component: FeedbackComponent },  // guard added in CI4
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];