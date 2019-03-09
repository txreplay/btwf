import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { JoinRoutes } from './homepage.routing';
import { HomepageComponent } from './homepage.component';
import {MaterialModule} from '../material-module';
import {PipesModule} from '../services/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    RouterModule.forChild(JoinRoutes),
  ],
  declarations: [ HomepageComponent ]
})

export class HomepageModule {

}
