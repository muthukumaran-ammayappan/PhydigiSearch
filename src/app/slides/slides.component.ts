import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {SearchService} from '../services/search.service';
import {environment} from "../../environments/environment.prod";

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss']
})
export class SlidesComponent implements OnInit {

  constructor(private searchService: SearchService) {
  }

  slideResult: [];
  url = 'http://localhost:9002/api/';
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
    this.getSlides();
    // this.url = environment.serviceURL;
  }

  getSlides() {
    const postData = null;
    this.searchService.fetchAllSlides(postData)
      .subscribe(response => {
        this.slideResult = response.data;
      });
  }

}
