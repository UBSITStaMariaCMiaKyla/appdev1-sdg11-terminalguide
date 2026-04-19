import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { TerminalDetail } from './pages/terminal-detail/terminal-detail';
import { SdgInfo } from './pages/sdg-info/sdg-info';
import { Feedback } from './pages/feedback/feedback';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'terminal/:id', component: TerminalDetail },
  { path: 'sdg-info', component: SdgInfo },
  { path: 'feedback', component: Feedback },
  { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: 'not-found' },
];