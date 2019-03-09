import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AngularFireModule } from '@angular/fire';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';

import {Driver, NgForageConfig} from 'ngforage';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';

import {AppRoutes} from './app.routing';
import {MaterialModule} from './material-module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(AppRoutes),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase, 'btwf'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
  ],
  providers: [{
    provide: [LocationStrategy, FirestoreSettingsToken],
    useClass: HashLocationStrategy,
    useValue: {}
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
  public constructor(ngfConfig: NgForageConfig) {
    ngfConfig.configure({
      name: 'btwf',
      driver: [
        Driver.INDEXED_DB,
        Driver.LOCAL_STORAGE
      ]
    });
  }
}
