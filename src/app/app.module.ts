import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatCardModule} from '@angular/material/card'; 
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import {MaterialModule} from '@angular/material.module'; 

import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker'; 

import {SearchModule} from './search/search.module';
import {SlidesModule} from './slides/slides.module';
import {FooterModule} from './footer/footer.module';
import {SearchService} from './services/search.service';
import {FactoryService} from './services/factory.service';
import {RouterModule} from '@angular/router';

import { AppUiModule } from './app-ui.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // MaterialModule,
    SearchModule,
    SlidesModule,
    FooterModule,
    RouterModule,
    MatProgressSpinnerModule,
    AppUiModule
  ],
  exports: [
    SearchModule,
  ],
  providers: [ FactoryService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }