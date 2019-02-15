import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomepageRoutes } from './homepage.routing';
import { HomepageComponent } from './homepage.component';
import {MaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(HomepageRoutes),
  ],
  declarations: [ HomepageComponent ]
})

export class HomepageModule {

}
