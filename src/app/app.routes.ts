import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'search',
        loadComponent: () =>
          import('./features/credits/pages/credit-list/credit-list.page').then((m) => m.CreditListPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/credits/pages/register-credit/register-credit.page').then(
            (m) => m.RegisterCreditPage,
          ),
      },
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/search',
    pathMatch: 'full',
  },
];
