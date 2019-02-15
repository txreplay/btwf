import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';

import { JoinRoutes } from './join.routing';
import { JoinComponent } from './join.component';
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
  declarations: [ JoinComponent ]
})

export class JoinModule {

}
