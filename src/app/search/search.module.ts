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
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  exports: [
    SearchComponent,
  ],
  providers: [SearchService, FactoryService, DatePipe],
})
export class SearchModule {
}
