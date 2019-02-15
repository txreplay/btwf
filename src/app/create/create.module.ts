import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


import { CreateRoutes } from './create.routing';
import { CreateComponent } from './create.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreateRoutes),
  ],
  declarations: [ CreateComponent ]
})

export class CreateModule {

}
