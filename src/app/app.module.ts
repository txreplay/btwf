import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';

import {AppRoutes} from './app.routing';
import {MaterialModule} from './material-module';
import { environment } from '../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {NgForageOptions, DEFAULT_CONFIG} from 'ngforage';

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
    RouterModule.forRoot(AppRoutes),
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
    useValue: {}
  }, {
      provide: DEFAULT_CONFIG,
      useValue: ngfRootOptions
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
