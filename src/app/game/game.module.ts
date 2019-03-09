import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { JoinRoutes } from './game.routing';
import { GameComponent } from './game.component';
import {MaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(JoinRoutes),
  ],
  declarations: [ GameComponent ]
})

export class GameModule {

}
