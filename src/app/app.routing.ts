import {Routes} from '@angular/router';

import {LayoutComponent} from './layout/layout.component';

export const AppRoutes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [{
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full'
  }, {
    path: 'homepage',
    loadChildren: './homepage/homepage.module#HomepageModule',
  }, {
    path: 'create',
    loadChildren: './create/create.module#CreateModule',
  }, {
    path: 'join',
    loadChildren: './join/join.module#JoinModule',
  }]
}, {
  path: '**',
  redirectTo: 'auth/404'
}];
