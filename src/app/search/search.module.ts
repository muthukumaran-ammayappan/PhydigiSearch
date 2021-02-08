import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule, MatGridListModule, MatSliderModule} from '@angular/material';
import {SearchComponent} from './search.component';
import {FooterModule} from '../footer/footer.module';
import {SearchService} from '../services/search.service';
import {FactoryService} from '../services/factory.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatSliderModule,
    FooterModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  exports: [
    SearchComponent,
  ],
  providers: [SearchService, FactoryService],
})
export class SearchModule {
}
