import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';

import { JoinRoutes } from './game.routing';
import { GameComponent } from './game.component';
import {MaterialModule} from '../material-module';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase, 'btwf'),
    AngularFirestoreModule.enablePersistence(),
    RouterModule.forChild(JoinRoutes),
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  declarations: [ GameComponent ]
})

export class GameModule {

}
