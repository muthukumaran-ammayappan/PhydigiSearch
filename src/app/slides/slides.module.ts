import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlidesComponent} from './slides.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    SlidesComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    SlidesComponent
  ]
})
export class SlidesModule {
}
