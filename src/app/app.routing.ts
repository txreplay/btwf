import {Routes} from '@angular/router';

import {LayoutComponent} from './layout/layout.component';
import {AuthGuard} from './services/auth.guard';

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
    canActivateChild: [AuthGuard],
    loadChildren: './game/game.module#GameModule',
  }, {
    path: 'admin',
    canActivateChild: [AuthGuard],
    loadChildren: './admin/admin.module#AdminModule',
  }]
}, {
  path: '**',
  redirectTo: 'auth/404'
}];
