import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss']
})
export class SlidesComponent implements OnInit {

  constructor() {
  }

  slides = [{url: '/assets/images/eye.jpg'},
    {url: '/assets/images/eye2.png'},
    {url: '/assets/images/pills.jpg'}];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<div class=\'nav-btn prev-slide\'></div>', '<div class=\'nav-btn next-slide\'></div>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true,
    autoHeight: true,
    autoplay: true,
  };

  ngOnInit() {
  }

}
