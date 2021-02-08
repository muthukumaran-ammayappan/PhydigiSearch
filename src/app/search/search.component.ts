import {Component, OnInit, ViewChild} from '@angular/core';
// import {MatCarousel, MatCarouselComponent} from '@ngmodule/material-carousel';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SearchService} from '../services/search.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private fb: FormBuilder, private sService: SearchService, private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      }
    });
  }

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  };



  timer: any;
  cols: number;
  pharmacies: any;


  ngOnInit() {
  }

  searchTimer(searchStr: string): void {
    searchStr = '';
    clearTimeout(this.timer);
    const time = 1000;
    this.timer = setTimeout(() => {
      console.log(searchStr);
      this.searchPharmacy(searchStr);
    }, time);
  }

  searchPharmacy(postData) {
    console.log(postData);
    this.sService.fetchAllCustomer(postData)
      .subscribe(res => {
        console.log('result', res);
        this.pharmacies = res;
      });
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1) + 'km';
    }

    return value;
  }
}
