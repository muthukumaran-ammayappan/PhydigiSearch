import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlidesComponent} from './slides.component';
import {CarouselModule} from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    SlidesComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule
  ],
  exports: [
    SlidesComponent
  ]
})
export class SlidesModule {
}
