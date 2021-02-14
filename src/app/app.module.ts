import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchModule} from './search/search.module';
import {SlidesModule} from './slides/slides.module';
import {FooterModule} from './footer/footer.module';
import {HttpClientModule} from '@angular/common/http';
import {SearchService} from './services/search.service';
import {FactoryService} from './services/factory.service';
import {RouterModule} from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SearchModule,
    SlidesModule,
    FooterModule,
    HttpClientModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    SearchModule,
  ],
  providers: [ FactoryService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
