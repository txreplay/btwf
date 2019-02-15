import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { LayoutRoutes } from './layout.routing';
import { LayoutComponent } from './layout.component';
import {MaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(LayoutRoutes),
  ],
  declarations: [ LayoutComponent ]
})

export class LayoutModule {

}
