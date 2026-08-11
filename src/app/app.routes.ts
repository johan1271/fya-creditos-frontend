import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
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
