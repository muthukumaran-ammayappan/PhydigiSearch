import {Component, OnInit} from '@angular/core';
// import {MatCarousel, MatCarouselComponent} from '@ngmodule/material-carousel';
import {FormBuilder} from '@angular/forms';
import {SearchService} from '../services/search.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {DatePipe} from "@angular/common";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private imageToShow: any;

  constructor(private sanitizer: DomSanitizer, public datepipe: DatePipe, private fb: FormBuilder, private sService: SearchService, private breakpointObserver: BreakpointObserver,
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
          this.rows = '2:1';
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
          this.rows = '3:1';
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
    xs: 1,
  };

  colRow: boolean;
  rows: any;
  timer: any;
  cols: number;
  pharmacies: [null];
  searchValue: string;
  loader: boolean;
  km = 3;
  deliveryStatus: any;
  openStatus: any;
  monStartHour: '';
  tueStartHour: '';
  wedStartHour: '';
  thuStartHour: '';
  friStartHour: '';
  satStartHour: '';
  sunStartHour: '';
  monEndHour: '';
  tueEndHour: '';
  wedEndHour: '';
  thuEndHour: '';
  friEndHour: '';
  satEndHour: '';
  sunEndHour: '';
  day: any;
  latestTime: string;
  openStatusImg: any;
  deliveryStatusImg: any;
  unsafeImageUrl: any;
  mobile: string;
  base64Data;
  public img;
  at: string;
  latestTime12: string;
  hour: string;
  public lat;
  public lng;

  //image converter

  getImageFromService(data) {
    // this.base64Data = 'data:image/png;base64,' + data;
    // this.img = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Data);


    // var binaryData = [];
    // binaryData.push(data);
    // this.img = window.URL.createObjectURL(new Blob(binaryData))
    // this.unsafeImageUrl = URL.createObjectURL(new Blob(binaryData));
    // this.img = this.sanitizer.bypassSecurityTrustUrl(this.unsafeImageUrl);

    // let imageBase64String= btoa(data);
    // this.img = 'data:image/jpeg;base64,' + imageBase64String;
    console.log('img',this.img);
  }

  //avoid double loop

  mob(data) {
    this.mobile = data;
  }

  // delivery status

  delivery(data) {
    if (data.deliveryAvailable == 'Y') {
      this.deliveryStatusImg = '/assets/images/greentick.png';
      this.deliveryStatus = 'Delivery Available';
    } else if (data.deliveryAvailable == 'N' && data.pickupAvialable == "Y") {
      this.deliveryStatusImg = '/assets/images/greentick.png';
      this.deliveryStatus = 'Pick-up Only';
    } else {
      this.deliveryStatusImg = '/assets/images/wrong.png';
      this.deliveryStatus = 'Unavilable';
    }
  }

  //day selecter

  dayFunctuin() {
    let date = new Date();
    this.latestTime = this.datepipe.transform(date, 'hh:mm');
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

  dayStatus(data) {
    if (this.day == "Sunday") {
      this.sunStartHour = data.sunStartHour;
      this.sunEndHour = data.sunEndHour;
      if (this.sunStartHour >= this.latestTime) {
        this.at = "Opens At ";
        this.hour = data.sunStartHour;
        this.timeConvert(this.hour);

      } else if (this.sunStartHour <= this.latestTime) {
        this.at = "Closes At ";
        this.hour = data.sunEndHour;
        this.timeConvert(this.hour);

      }
      if (this.sunStartHour > this.latestTime || this.sunEndHour < this.latestTime) {
        this.openStatusImg = '/assets/images/wrong.png';
        this.openStatus = 'Closed';
      } else {
        this.openStatusImg = '/assets/images/greentick.png';
        this.openStatus = 'Opened';
      }
    } else if (this.day == "Monday") {
      this.monStartHour = data.monStartHour;
      this.monEndHour = data.monEndHour;
      if (this.monStartHour >= this.latestTime) {
        this.at = "Opens At ";
        this.hour = data.monStartHour;
        this.timeConvert(this.hour);

      } else if (this.monStartHour <= this.latestTime) {
        this.at = "Closes At ";
        this.hour = data.monEndHour;
        this.timeConvert(this.hour);

      }
      if (this.monStartHour > this.latestTime || this.monEndHour < this.latestTime) {
        this.openStatusImg = '/assets/images/wrong.png';
        this.openStatus = 'Closed';
      } else {
        this.openStatusImg = '/assets/images/greentick.png';
        this.openStatus = 'Opened';
      }
    } else if (this.day == "Tuesday") {
      this.tueStartHour = data.tueStartHour;
      this.tueEndHour = data.tueEndHour;
      if (this.tueStartHour >= this.latestTime) {
        this.at = "Opens At ";
        this.hour = data.tueStartHour;
        this.timeConvert(this.hour);

      } else if (this.tueStartHour <= this.latestTime) {
        this.at = "Closes At ";
        this.hour = data.tueEndHour;
        this.timeConvert(this.hour);

      }
      if (this.tueStartHour > this.latestTime || this.tueEndHour < this.latestTime) {
        this.openStatusImg = '/assets/images/wrong.png';
        this.openStatus = 'Closed';
      } else {
        this.openStatusImg = '/assets/images/greentick.png';
        this.openStatus = 'Opened';
      }
    } else if (this.day == "Wednesday") {
      this.wedStartHour = data.wedStartHour;
      this.wedEndHour = data.wedEndHour;
      if (this.wedStartHour >= this.latestTime) {
        this.at = "Opens At ";
        this.hour = data.wedStartHour;
        this.timeConvert(this.hour);



      } else if (this.wedStartHour <= this.latestTime) {
        this.at = "Closes At ";
        this.hour = data.wedEndHour;
        this.timeConvert(this.hour);


      }
      if (this.wedStartHour > this.latestTime || this.wedEndHour < this.latestTime) {
        this.openStatusImg = '/assets/images/wrong.png';
        this.openStatus = 'Closed';
      } else {
        this.openStatusImg = '/assets/images/greentick.png';
        this.openStatus = 'Opened';
      }
    } else if (this.day == "Thursday") {
      this.thuStartHour = data.thuStartHour;
      this.thuEndHour = data.thuEndHour;
      if (this.thuStartHour >= this.latestTime) {
        this.at = "Opens At ";
        this.hour = data.thuStartHour;
        this.timeConvert(this.hour);


      } else if (this.thuStartHour <= this.latestTime) {
        this.at = "Closes At ";
        this.hour = data.thuEndHour;
        this.timeConvert(this.hour);


      }
      if (this.thuStartHour > this.latestTime || this.thuEndHour < this.latestTime) {
        this.openStatusImg = '/assets/images/wrong.png';
        this.openStatus = 'Closed';
      } else {
        this.openStatusImg = '/assets/images/greentick.png';
        this.openStatus = 'Opened';
      }
    } else if (this.day == "Friday") {
      this.friStartHour = data.friStartHour;
      this.friEndHour = data.friEndHour;
      if (this.friStartHour >= this.latestTime) {
        this.at = "Opens At ";
        this.hour = data.friStartHour;
        this.timeConvert(this.hour);


      } else if (this.friStartHour <= this.latestTime) {
        this.at = "Closes At ";
        this.hour = data.friEndHour;
        this.timeConvert(this.hour);


      }
      if (this.friStartHour > this.latestTime || this.friEndHour < this.latestTime) {
        this.openStatusImg = '/assets/images/wrong.png';
        this.openStatus = 'Closed';
      } else {
        this.openStatusImg = '/assets/images/greentick.png';
        this.openStatus = 'Opened';
      }
    } else if (this.day == "Saturday") {
      this.satStartHour = data.satStartHour;
      this.satEndHour = data.satEndHour;
      if (this.satStartHour >= this.latestTime) {
        this.at = "Opens At ";
        this.hour = data.satStartHour;
        this.timeConvert(this.hour);

      } else if (this.satStartHour <= this.latestTime) {
        this.at = "Closes At ";
        this.hour = data.satEndHour;
        this.timeConvert(this.hour);

      }
      if (this.satStartHour > this.latestTime || this.satEndHour < this.latestTime) {
        this.openStatusImg = '/assets/images/wrong.png';
        this.openStatus = 'Closed';
      } else {
        this.openStatusImg = '/assets/images/greentick.png';
        this.openStatus = 'Opened';
      }
    }
  }

  timeConvert(data) {
    let time = parseFloat(data);
      this.latestTime12 = this.datepipe.transform(time, 'hh:mm a');
  }

  ngOnInit() {
    this.dayFunctuin();
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
          if (position) {
            console.log("Latitude: " + position.coords.latitude +
              "Longitude: " + position.coords.longitude);
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            console.log(this.lat);
            console.log(this.lat);
          }
        },
        (error: PositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
      this.lat = 12.969825234472314;
      this.lng  = 77.57694045851389;
    }
  }

  searchTimer(searchStr: string): void {
    clearTimeout(this.timer);
    const time = 1000;
    this.timer = setTimeout(() => {
      console.log(searchStr);
      this.searchPharmacy(searchStr);
    }, time);
  }

  searchPharmacy(search) {
    this.loader = true;
    // let postData = [{search: search},{lat: this.lat},{lng: this.lng}];

    let param = '';
    if (search) {
      param = 'search=' + search + '&';
    }
    if (this.lat) {
      param += 'lat=' + this.lat + '&';
    }
    if (this.lng) {
      param += 'lng=' + this.lng;
    }
    if (this.km) {
      param += 'km=' + this.km;
    }

    console.log(param);
    this.sService.fetchAllCustomer(param)
      .subscribe(res => {
        console.log('result', res);
        // this.search = res.data;
        this.pharmacies = res.data;
      });
    this.loader = false;
  }

  //slider label

  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1) + 'km';
    }

    return value;
  }
}
