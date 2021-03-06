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

  today;
  rows: any;
  timer: any;
  cols: number;
  datasource: null;
  pageIndex: number;
  pageSize: number;
  length: number;

  pharmacies = [];
  filteredPharmacies = [];
  startHour = [];
  closeHour = [];

  searchValue: string;
  km = 7;
  loading = false;
  isStoreOpen = false;
  isDeliveryEnable = false;
  img;
  pageEvent: PageEvent;

  isSearch = false;
  nextDay;
  API_HOST = environment.serviceURL;
  API_HOST_WITH_PORT = environment.serviceURL + environment.port;

  day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  public bengalurLat = '12.967343065878191';
  public bengalurLng = '77.573937871773';
  public lat = null;
  public lng = null;

  isMobile;
  isBangLatLong;

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
    if (data) {
      return this.API_HOST_WITH_PORT + '/api/image?id=' + data;
    }
  }

  findStartTimeAndDay(currentTime, currentDay) {

    if (this.startHour[currentDay] && this.closeHour[currentDay]) {
      if (currentTime < this.startHour[currentDay]) {
        const returnTimeAndDay = {startHour: '', day: ''};

        returnTimeAndDay.startHour = this.startHour[currentDay];
        returnTimeAndDay.day = 'Today';

        return returnTimeAndDay;
      }

      if (currentTime > this.closeHour[currentDay]) {
        return this.nextDayFinder(currentDay);
      }
    } else {
      return this.nextDayFinder(currentDay + 1);
    }
  }

  nextDayFinder(currentDay, count = 0) {
    const nextDay = currentDay !== 6 ? currentDay + 1 : 0;

    if (count > 7) {
      const returnTimeAndDay = {startHour: '', day: ''};

      returnTimeAndDay.startHour = '10:00'; // If there is no record for open time and close time.
      returnTimeAndDay.day = 'Tomorrow'; // If there is no record for open time and close time.

      return returnTimeAndDay;
    }

    if (this.startHour[nextDay]) {
      const returnTimeAndDay = {startHour: '', day: ''};

      returnTimeAndDay.startHour = this.startHour[nextDay];
      returnTimeAndDay.day = this.day[nextDay];

      return returnTimeAndDay;
    } else {
      return this.nextDayFinder(nextDay, count + 1);
    }

  }

  dayStatus() {
    const currentTime = this.datepipe.transform(new Date(), 'HH:mm', 'IST');
    const currentDay = new Date().getDay();
    const returnData = new StoreTiming();

    returnData.closeHour = this.closeHour[currentDay];

    const startHour = 'startHour';
    const day = 'day';

    if (this.startHour[currentDay] && this.closeHour[currentDay]) {
      returnData.isOpen = (this.startHour[currentDay] < currentTime && this.closeHour[currentDay] > currentTime);
      returnData.closeHour = this.closeHour[currentDay];

      if (returnData.isOpen) {
        returnData.startHour = this.startHour[currentDay];
        returnData.day = this.day[currentDay];
      } else {
        const startTimeAndDay = this.findStartTimeAndDay(currentTime, currentDay);

        returnData.startHour = startTimeAndDay[startHour];
        returnData.day = startTimeAndDay[day];
      }
    } else {
      returnData.isOpen = false;

      const startTimeAndDay = this.findStartTimeAndDay(currentTime, currentDay);
      returnData.startHour = startTimeAndDay[startHour];
      returnData.day = startTimeAndDay[day];
    }

    return returnData;
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
    console.log('getLocation');
    if (navigator.geolocation) {
      console.log('navigator.geolocation', navigator.geolocation);

      navigator.geolocation.getCurrentPosition((position: Position) => {
          console.log('Position', position);
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }
          this.searchPharmacy();
        },
        (error: PositionError) => {
          this.searchPharmacy();
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
    console.log('this.lat', this.lat, this.lng);
    if (this.lat !== null && this.lat !== '') {
      this.isBangLatLong = false;
      param += 'lat=' + this.lat + '&';
    } else {
      this.isSearch = true;
      this.isBangLatLong = true;
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
        if (!(stores.data && stores.data.length > 0)) {
          this.pharmacies = this.filteredPharmacies = [];
          this.loading = false;
        } else {
          stores.data.forEach(store => {

            this.startHour[0] = store[0].sunStartHour;
            this.startHour[1] = store[0].monStartHour;
            this.startHour[2] = store[0].tueStartHour;
            this.startHour[3] = store[0].wedStartHour;
            this.startHour[4] = store[0].thuStartHour;
            this.startHour[5] = store[0].friStartHour;
            this.startHour[6] = store[0].satStartHour;

            this.closeHour[0] = store[0].sunEndHour;
            this.closeHour[1] = store[0].monEndHour;
            this.closeHour[2] = store[0].tueEndHour;
            this.closeHour[3] = store[0].wedEndHour;
            this.closeHour[4] = store[0].thuEndHour;
            this.closeHour[5] = store[0].friEndHour;
            this.closeHour[6] = store[0].satEndHour;

            const returnData = this.dayStatus();

            store[0].isOpen = returnData.isOpen;
            store[0].startHour = returnData.startHour ? returnData.startHour : '10:00';
            store[0].closeHour = returnData.closeHour ? returnData.closeHour : '20:00';
            store[0].openDay = returnData.day;
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
    this.isStoreOpen = !this.isStoreOpen;
    this.filterStores();
  }

  onClickDelivery() {
    this.isDeliveryEnable = !this.isDeliveryEnable;
    this.filterStores();
  }

  filterStores() {
    let filteredStores = this.pharmacies;

    if (this.isStoreOpen) {
      filteredStores = filteredStores.filter(store => store[0].isOpen === true);
    }

    if (this.isDeliveryEnable) {
      filteredStores = filteredStores.filter(store => store[0].homeDelivery === 'Y');
    }

    this.filteredPharmacies = filteredStores;
  }

  OnPageChange(event
                 :
                 PageEvent
  ) {
    const startIndex = (event !== null ? event.pageIndex : this.pageIndex) * (event !== null ? event.pageSize : this.pageSize);
    let endIndex = startIndex + (event !== null ? event.pageSize : this.pageSize);
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.filteredPharmacies = this.pharmacies.slice(startIndex, endIndex);
    return event;
  }
}
