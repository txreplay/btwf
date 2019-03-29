import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';

import {SpotifyAuthModule} from 'spotify-auth';
import {NgForageOptions, DEFAULT_CONFIG} from 'ngforage';

import {AppRoutes} from './app.routing';
import {environment} from '../environments/environment';
import {AuthGuard} from './services/auth.guard';
import {MaterialModule} from './material-module';

const ngfRootOptions: NgForageOptions = {
  name: 'BtwfUsers',
};

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    SpotifyAuthModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
  AuthGuard,
  {
      provide: DEFAULT_CONFIG,
      useValue: ngfRootOptions
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
