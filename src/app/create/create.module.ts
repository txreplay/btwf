import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { CreateRoutes } from './create.routing';
import { CreateComponent } from './create.component';
import {MaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(CreateRoutes),
  ],
  declarations: [ CreateComponent ]
})

export class CreateModule {

}
