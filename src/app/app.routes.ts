import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.page').then((m) => m.LandingPage)
  },
  {
    path: 'crm',
    loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
