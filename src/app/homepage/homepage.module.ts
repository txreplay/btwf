import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


import { HomepageRoutes } from './homepage.routing';
import { HomepageComponent } from './homepage.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HomepageRoutes),
  ],
  declarations: [ HomepageComponent ]
})

export class HomepageModule {

}
