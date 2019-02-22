import {Routes} from '@angular/router';

import {LayoutComponent} from './layout/layout.component';

export const AppRoutes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [{
    path: '',
    redirectTo: 'game',
    pathMatch: 'full'
  }, {
    path: 'game',
    loadChildren: './game/game.module#GameModule',
  }]
}, {
  path: '**',
  redirectTo: 'auth/404'
}];
