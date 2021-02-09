import {Component, OnInit} from '@angular/core';
// import {MatCarousel, MatCarouselComponent} from '@ngmodule/material-carousel';
import {FormBuilder} from '@angular/forms';
import {SearchService} from '../services/search.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(public datepipe: DatePipe,private fb: FormBuilder, private sService: SearchService, private breakpointObserver: BreakpointObserver,
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
  pharmacies: [null];
  searchValue: string;
  loader: boolean;
  km = 3;
  deliveryStatus: any;
  openStatus: any;
    monStartHour: string;
    tueStartHour: string;
    wedStartHour: string;
    thuStartHour: string;
    friStartHour: string;
    satStartHour: string;
    sunStartHour: string;
    monEndHour: string;
    tueEndHour: string;
    wedEndHour: string;
    thuEndHour: string;
    friEndHour: string;
    satEndHour: string;
    sunEndHour: string;
  day: any;
  latestTime: any;



  dayFunctuin(){
    let date=new Date();
    this.latestTime =this.datepipe.transform(date, 'hh:mm');
    switch (new Date().getDay()) {
      case 0:
        this.day = "Sunday";
        break;
      case 1:
        this.day = "Monday";
        break;
      case 2:
        this.day = "Tuesday";
        break;
      case 3:
        this.day = "Wednesday";
        break;
      case 4:
        this.day = "Thursday";
        break;
      case 5:
        this.day = "Friday";
        break;
      case 6:
        this.day = "Saturday";
    }
  }

  dayStatus(data){

    if(this.day == "Sunday") {
      this.sunStartHour == data.sunStartHour;
      this.sunEndHour == data.sunEndHour;
      if(this.sunStartHour > this.latestTime && this.sunEndHour < this.latestTime) {
        this.openStatus = [{url: '/assets/images/wrong.png'}, {status: 'Closed'}];
      } else {
        this.openStatus = [{url: '/assets/images/greentick.png'}, {status: 'Opened'}];
      }
    }
    if(this.day == "Monday") {
      this.monStartHour == data.monStartHour;
      this.monEndHour == data.monEndHour;
      if(this.monStartHour > this.latestTime && this.monEndHour < this.latestTime) {
        this.openStatus = [{url: '/assets/images/wrong.png'}, {status: 'Closed'}];
      } else {
        this.openStatus = [{url: '/assets/images/greentick.png'}, {status: 'Opened'}];
      }
    }
    if(this.day == "Tuesday") {
      this.tueStartHour == data.tueStartHour;
      this.tueEndHour == data.tueEndHour;
      if(this.tueStartHour > this.latestTime && this.tueEndHour < this.latestTime) {
        this.openStatus = [{url: '/assets/images/wrong.png'}, {status: 'Closed'}];
      } else {
        this.openStatus = [{url: '/assets/images/greentick.png'}, {status: 'Opened'}];
      }
    }
    if(this.day == "Wednesday") {
      this.wedStartHour == data.wedStartHour;
      this.wedEndHour == data.wedEndHour;
      if(this.wedStartHour > this.latestTime && this.wedEndHour < this.latestTime) {
        this.openStatus = [{url: '/assets/images/wrong.png'}, {status: 'Closed'}];
      } else {
        this.openStatus = [{url: '/assets/images/greentick.png'}, {status: 'Opened'}];
      }
    }
    if(this.day == "Thursday") {
      this.thuStartHour == data.thuStartHour;
      this.thuEndHour == data.thuEndHour;
      if(this.thuStartHour > this.latestTime && this.thuEndHour < this.latestTime) {
        this.openStatus = [{url: '/assets/images/wrong.png'}, {status: 'Closed'}];
      } else {
        this.openStatus = [{url: '/assets/images/greentick.png'}, {status: 'Opened'}];
      }
    }if(this.day == "Friday") {
      this.friStartHour == data.friStartHour;
      this.friEndHour == data.friEndHour;
      if(this.friStartHour > this.latestTime && this.friEndHour < this.latestTime) {
        this.openStatus = [{url: '/assets/images/wrong.png'}, {status: 'Closed'}];
      } else {
        this.openStatus = [{url: '/assets/images/greentick.png'}, {status: 'Opened'}];
      }
    }if(this.day == "Saturday") {
      this.satStartHour == data.satStartHour;
      this.satEndHour == data.satEndHour;
      if(this.satStartHour > this.latestTime && this.satEndHour < this.latestTime) {
        this.openStatus = [{url: '/assets/images/wrong.png'}, {status: 'Closed'}];
      } else {
        this.openStatus = [{url: '/assets/images/greentick.png'}, {status: 'Opened'}];
      }
    }

  }

  ngOnInit() {
    this.dayFunctuin();
  }

  searchTimer(searchStr: string): void {
    clearTimeout(this.timer);
    const time = 1000;
    this.timer = setTimeout(() => {
      console.log(searchStr);
      this.searchPharmacy(searchStr);
    }, time);
  }

  searchPharmacy(postData) {
    this.loader = true;
    console.log(postData);
    this.sService.fetchAllCustomer(postData)
      .subscribe(res => {
        console.log('result', res);
        // this.search = res.data;
        this.pharmacies = res.data
      });
    this.loader = false;
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1) + 'km';
    }

    return value;
  }
}
