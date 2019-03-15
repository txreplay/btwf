import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { JoinRoutes } from './admin.routing';
import { AdminComponent } from './admin.component';
import {MaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(JoinRoutes),
  ],
  declarations: [ AdminComponent ]
})

export class AdminModule {

}
