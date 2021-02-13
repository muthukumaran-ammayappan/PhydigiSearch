import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SearchService} from '../services/search.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {DatePipe} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {StoreTiming} from '../model/search.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

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
  pharmacies = [];
  filteredPharmacies = [];
  searchValue: string;
  loader: boolean;
  km = 7;
  deliveryStatus: any;

  deliveryStatusImg: any;
  isOpen = false;
  isDeliveryEnable = false;
  img;


  public bengalurLat = '13.066412600498435';
  public bengalurLng = '77.60393005906081';
  public lat = null;
  public lng = null;

  constructor(private sanitizer: DomSanitizer,
              public datepipe: DatePipe,
              private fb: FormBuilder,
              private searchService: SearchService,
              private breakpointObserver: BreakpointObserver) {
    this.breakPointObserver();
  }

  ngOnInit() {
    this.getLocation();
  }

  breakPointObserver() {
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

  // image converter
  getImageFromService(data) {
    const API_HOST = environment.serviceURL + 'image?id=';
    this.img = API_HOST + data;
  }

  // delivery status
  delivery(data) {
    if (data.deliveryAvailable == 'Y') {
      this.deliveryStatusImg = '/assets/images/greentick.png';
      this.deliveryStatus = 'Delivery Available';
    } else if (data.deliveryAvailable == 'N' && data.pickupAvialable == 'Y') {
      this.deliveryStatusImg = '/assets/images/greentick.png';
      this.deliveryStatus = 'Pick-up Only';
    } else {
      this.deliveryStatusImg = '/assets/images/greentick.png';
      this.deliveryStatus = 'Pick-up Only';
    }
  }

  dayStatus(data) {
    const currentTime = this.datepipe.transform(new Date(), 'hh:mm');
    const currentDay = new Date().getDay();

    const returnData = new StoreTiming();

    if (currentDay === 0) {
      returnData.isOpen = !(data.sunStartHour > currentTime || data.sunEndHour < currentTime);
      returnData.startHour = data.sunStartHour;
      returnData.closeHour = data.sunEndHour;

      return returnData;
    } else if (currentDay === 1) {

      returnData.isOpen = !(data.monStartHour > currentTime || data.monEndHour < currentTime);
      returnData.startHour = data.monStartHour;
      returnData.closeHour = data.monEndHour;

      return returnData;
    } else if (currentDay === 2) {

      returnData.isOpen = !(data.tueStartHour > currentTime || data.tueEndHour < currentTime);
      returnData.startHour = data.tueStartHour;
      returnData.closeHour = data.tueEndHour;

      return returnData;
    } else if (currentDay === 3) {

      returnData.isOpen = !(data.wedStartHour > currentTime || data.wedEndHour < currentTime);
      returnData.startHour = data.wedStartHour;
      returnData.closeHour = data.wedEndHour;

      return returnData;
    } else if (currentDay === 4) {

      returnData.isOpen = !(data.thuStartHour > currentTime || data.thuEndHour < currentTime);
      returnData.startHour = data.thuStartHour;
      returnData.closeHour = data.thuEndHour;

      return returnData;
    } else if (currentDay === 5) {

      returnData.isOpen = !(data.friStartHour > currentTime || data.friEndHour < currentTime);
      returnData.startHour = data.friStartHour;
      returnData.closeHour = data.friEndHour;

      return returnData;
    } else if (currentDay === 6) {

      returnData.isOpen = !(data.satStartHour > currentTime || data.satEndHour < currentTime);
      returnData.startHour = data.satStartHour;
      returnData.closeHour = data.satEndHour;
      // console.log(this.timeConvert(data.satStartHour));
      // console.log(this.timeConvert(data.satEndHour));
      // console.log(data.satEndHour);
      return returnData;
    }
  }

  timeConvert(data) {
    const time = parseFloat(data);
    console.log('time', data);
    return this.datepipe.transform(new Date(time), 'HH:mm a', 'IST');
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
      alert('Geolocation is not supported by this browser.');
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
      param += 'lat=' + this.bengalurLat + '&';
    }
    if (this.lng !== null && this.lng !== '') {
      param += 'lng=' + this.lng + '&';
    } else {
      param += 'lng=' + this.bengalurLng + '&';
    }
    if (this.km) {
      param += 'km=' + this.km;
    }

    this.searchService.fetchAllStores(param)
      .subscribe(stores => {
        if (stores.data.length > 0) {
          stores.data.forEach(store => {

            const returnData = this.dayStatus(store[0]);

            store[0].isOpen = returnData.isOpen;
            store[0].startHour = returnData.startHour ? returnData.startHour : '10:00';
            store[0].closeHour = returnData.closeHour ? returnData.closeHour : '20:00';
          });
          this.pharmacies = stores.data;
          this.filteredPharmacies = stores.data;
        }
      });
    this.loader = false;
  }

  // slider label

  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1) + 'km';
    }
    return value;
  }

  isOpened() {
    this.isOpen = !this.isOpen;
    this.filterStores();
  }

  isDelivery() {
    this.isDeliveryEnable = !this.isDeliveryEnable;
    this.filterStores();
  }

  filterStores() {
    // this.pharmacies =  this.pharmacies.filter(pharmacy => pharmacy.isOpen === true);
    let filteredStores = this.pharmacies;
    if (this.isOpen) {
      filteredStores = filteredStores.filter(store => store[0].isOpen === true);
    }

    if (this.isDeliveryEnable) {
      filteredStores = filteredStores.filter(store => store[0].deliveryAvailable === 'Y');
    }

    this.filteredPharmacies = filteredStores;
    console.log('filteredStores', filteredStores);
  }

}
