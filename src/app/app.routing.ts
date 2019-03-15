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
    path: 'game',
    loadChildren: './game/game.module#GameModule',
  }, {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
  }]
}, {
  path: '**',
  redirectTo: 'auth/404'
}];
