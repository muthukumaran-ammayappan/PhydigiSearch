import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SearchService} from '../services/search.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {DatePipe} from "@angular/common";
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer,
              public datepipe: DatePipe,
              private fb: FormBuilder,
              private searchService: SearchService,
              private breakpointObserver: BreakpointObserver,
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
  rows: any;
  timer: any;
  cols: number;
  pharmacies: [null];
  searchValue: string;
  loader: boolean;
  km = 7;
  deliveryStatus: any;
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
  deliveryStatusImg: any;
  mobile: string;
  isOpen = false;
  img;
  at: string;
  latestTime12: string;
  hour: string;
  public bengalurlat = '13.066412600498435';
  public bengalurlng = '77.60393005906081';
  public lat = null;
  public lng = null;

  //image converter

  getImageFromService(data) {
    // const API_HOST = 'https://dev.phydigi.com:9002';
    const API_HOST = 'http://localhost:9002/api/image?id=';
    console.log(API_HOST + data)
    this.img = API_HOST + data;
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
      this.deliveryStatusImg = '/assets/images/greentick.png';
      this.deliveryStatus = 'Pick-up Only';
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
        return false;
      } else {
        return true;
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
        return false;
      } else {
        return true;
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
        return false;
      } else {
        return true;
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
        return false;
      } else {
        return true;
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
        return false;
      } else {
        return true;
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
        return false;
      } else {
        return true;
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
        return false;
      } else {
        return true;
      }
    }
  }

  imgLogoId(img) {
    this.img = img;
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

            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;

          }
        },
        (error: PositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  searchTimer(searchStr
                :
                string
  ):
    void {
    clearTimeout(this.timer
    )
    ;
    const time = 1000;
    this.timer = setTimeout(() => {
      this.searchPharmacy(searchStr);
    }, time);
  }

  searchPharmacy(search) {
    this.loader = true;
    let param = '';
    if (search) {
      param = 'search=' + search + '&';
    }
    if (this.lat !== null && this.lat !== '') {
      param += 'lat=' + this.lat + '&';
    } else {
      param += 'lat=' + this.bengalurlat + '&';
    }
    if (this.lng !== null && this.lng !== '') {
      param += 'lng=' + this.lng + '&';
    } else {
      param += 'lng=' + this.bengalurlng + '&';
    }
    if (this.km) {
      param += 'km=' + this.km;
    }
    this.searchService.fetchAllCustomer(param)
      .subscribe(res => {
        console.log('result', res.data);
        res.data.forEach(resp => {
          resp[0]["isOpen"] = this.dayStatus(resp[0]);
        });
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

  isOpened() {
    this.isOpen != this.isOpen;

    // this.pharmacies =  this.pharmacies.filter(pharmacy => pharmacy.isOpen === true)
  }

  isDelivery() {

  }

}
