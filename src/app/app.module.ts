import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';

import {AppRoutes} from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material-module';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(AppRoutes),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
