import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { JoinRoutes } from './join.routing';
import { JoinComponent } from './join.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(JoinRoutes),
  ],
  declarations: [ JoinComponent ]
})

export class JoinModule {

}
