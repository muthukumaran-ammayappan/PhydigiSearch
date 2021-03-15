import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MatCardModule, MatGridListModule, MatSliderModule} from '@angular/material';
import {SearchComponent} from './search.component';
import {FooterModule} from '../footer/footer.module';
import {SearchService} from '../services/search.service';
import {FactoryService} from '../services/factory.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {LoaderComponent} from '../loader/loader.component';
import {StylePaginatorDirective} from './style-paginator.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {SlidesModule} from "../slides/slides.module";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AccordionModule} from "ngx-accordion";
import {MatExpansionModule} from "@angular/material/expansion";



@NgModule({
  declarations: [
    SearchComponent,
    LoaderComponent,
    StylePaginatorDirective
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatSliderModule,
    FooterModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatButtonModule,
    SlidesModule,
    MatToolbarModule,
    AccordionModule,
    MatExpansionModule,
  ],
  exports: [
    SearchComponent,
  ],
  providers: [SearchService, FactoryService, DatePipe],
})
export class SearchModule {
}
