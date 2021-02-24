import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SearchService} from '../services/search.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {DatePipe} from '@angular/common';
import {StoreTiming} from '../model/search.model';
import {PageEvent} from '@angular/material';
import {environment} from '../../environments/environment.prod';

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
  km = 7;
  loading = false;
  isOpen = false;
  isDeliveryEnable = false;
  img;
  pageEvent: PageEvent;
  datasource: null;
  pageIndex: number;
  pageSize: number;
  length: number;
  isSearch = false;

  public bengalurLat = '12.967343065878191';
  public bengalurLng = '77.573937871773';
  public lat = null;
  public lng = null;

  isMobile;

  constructor(public datepipe: DatePipe,
              private fb: FormBuilder,
              private searchService: SearchService,
              private breakpointObserver: BreakpointObserver) {
    this.breakPointObserver();
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
          this.rows = true;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
          this.rows = true;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
          this.rows = false;
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

  // Image converter
  getImageFromService(data) {
    const API_HOST = environment.serviceURL + 'image?id=';
    return  API_HOST + data;
  }

  dayStatus(data) {
    const currentTime = this.datepipe.transform(new Date(), 'HH:mm', 'IST');
    const currentDay = new Date().getDay();

    const returnData = new StoreTiming();

    if (currentDay === 0) {
      returnData.isOpen = (data.sunStartHour < currentTime && data.sunEndHour > currentTime);
      returnData.startHour = data.monStartHour;
      returnData.closeHour = data.sunEndHour;

      return returnData;
    } else if (currentDay === 1) {

      returnData.isOpen = (data.monStartHour < currentTime && data.monEndHour > currentTime);
      returnData.startHour = data.tueStartHour;
      returnData.closeHour = data.monEndHour;

      return returnData;
    } else if (currentDay === 2) {

      returnData.isOpen = (data.tueStartHour < currentTime && data.tueEndHour > currentTime);
      returnData.startHour = data.wedStartHour;
      returnData.closeHour = data.tueEndHour;

      return returnData;
    } else if (currentDay === 3) {
      console.log('wednes day currentTime - ', currentTime, 'currentDay -', currentDay);
      console.log('data.wedStartHour - ', data.wedStartHour, '<', currentTime,
        '|| data.wedEndHour' , data.wedEndHour, '> currentTime', currentTime );

      returnData.isOpen = (data.wedStartHour < currentTime && data.wedEndHour > currentTime);
      returnData.startHour = data.thuStartHour;
      returnData.closeHour = data.wedEndHour;
      console.log(returnData.isOpen);

      return returnData;
    } else if (currentDay === 4) {

      returnData.isOpen = (data.thuStartHour < currentTime && data.thuEndHour > currentTime);
      returnData.startHour = data.friStartHour;
      returnData.closeHour = data.thuEndHour;

      return returnData;
    } else if (currentDay === 5) {

      returnData.isOpen = (data.friStartHour < currentTime && data.friEndHour > currentTime);
      returnData.startHour = data.satStartHour;
      returnData.closeHour = data.friEndHour;

      return returnData;
    } else if (currentDay === 6) {

      returnData.isOpen = (data.satStartHour < currentTime && data.satEndHour > currentTime);
      returnData.startHour = data.sunStartHour;
      returnData.closeHour = data.satEndHour;

      return returnData;
    }
  }

  tConvert(time) {
    // time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? 'AM' : 'PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }
          this.searchPharmacy();
        },
        (error: PositionError) => {
          this.searchPharmacy();
          console.log(error);
        });
    } else {
      this.searchPharmacy();
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

  searchPharmacy(search = '') {
    this.loading = true;

    let param = '';
    if (search !== '') {
      param = 'search=' + search + '&';
      this.isSearch = true;
    } else {
      this.isSearch = false;
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
        if (stores.data && stores.data.length > 0) {
          stores.data.forEach(store => {
            const returnData = this.dayStatus(store[0]);

            store[0].isOpen = returnData.isOpen;
            store[0].startHour = returnData.startHour ? returnData.startHour : '10:00';
            store[0].closeHour = returnData.closeHour ? returnData.closeHour : '20:00';
            this.loading = false;
          });
          this.pharmacies = stores.data;
          // console.log(this.pharmacies);
          if (!this.isMobile) {
            this.filteredPharmacies = this.pharmacies.slice(0, stores.data.length >= 10 ? 10 : stores.data.length + 1);
          } else {
            this.filteredPharmacies = this.pharmacies = stores.data;
          }

          this.datasource = stores.data;
          this.pageIndex = 1;
          this.pageSize = 10;
          this.length = stores.data.length;
          this.loading = false;
        } else {
          this.pharmacies = this.filteredPharmacies = [];
          this.loading = false;
        }
      });
  }

  // slider label
  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1) + 'km';
    }
    return value;
  }

  onClickOpen() {
    this.isOpen = !this.isOpen;
    this.filterStores();
  }

  onClickDelivery() {
    this.isDeliveryEnable = !this.isDeliveryEnable;
    this.filterStores();
  }

  filterStores() {
    let filteredStores = this.pharmacies;

    if (this.isOpen) {
      filteredStores = filteredStores.filter(store => store[0].isOpen === true);
    }

    if (this.isDeliveryEnable) {
      filteredStores = filteredStores.filter(store => store[0].homeDelivery === 'Y');
    }

    this.filteredPharmacies = filteredStores;
  }

  OnPageChange(event: PageEvent) {
    const startIndex = (event !== null ? event.pageIndex : this.pageIndex) * (event !== null ? event.pageSize : this.pageSize);
    let endIndex = startIndex + (event !== null ? event.pageSize : this.pageSize);
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.filteredPharmacies = this.pharmacies.slice(startIndex, endIndex);
    return event;
  }
}
