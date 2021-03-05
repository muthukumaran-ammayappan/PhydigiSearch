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
  nextDay;
  API_HOST = environment.serviceURL;
  API_HOST_WITH_PORT = environment.serviceURL + environment.port;
  startTime = [];
  endTime = [];
  day = [
    {0: 'Sunday'},
    {1: 'Monday'},
    {2: 'Tuesday'},
    {3: 'Wednesday'},
    {4: 'Thursday'},
    {5: 'Friday'},
    {6: 'Saturday'}
  ];

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
    if (data) {
      return this.API_HOST_WITH_PORT + '/api/image?id=' + data;
    }
  }

  findStartTimeAndDay(currentTime, currentDay) {

    if (currentTime < this.startTime[currentDay]) {
      const startDayTime = this.startTime[currentDay];
      const dayOpen = this.day[currentDay];
      console.log('today:', this.today);
      return startDayTime + dayOpen;
    }

    if (currentTime > this.endTime[currentDay]) {
      return this.newDay(currentDay);
    }

  }

  newDay(currentDay) {
    const nextDay = currentDay + 1;

    if (this.startTime[nextDay] == null) {
      const startDayTime = this.startTime[nextDay];
      const dayOpen = this.day[nextDay];
      console.log('day:', dayOpen, 'time:', startDayTime);
      return startDayTime + dayOpen;
    } else {
      this.newDay(nextDay);
    }

  }

  dayStatus(data) {
    const currentTime = this.datepipe.transform(new Date(), 'HH:mm', 'IST');
    // const currentTime = '06:00';
    // const currentDay = new Date().getDay();
    const currentDay = 0;
    const returnData = new StoreTiming();

    returnData.closeHour = this.endTime[currentDay];
    console.log(this.endTime[currentDay]);

    if (this.startTime[currentDay] && this.endTime[currentDay]) {
      returnData.isOpen = (this.startTime[currentDay] < currentTime && this.endTime[currentDay] > currentTime);
      returnData.startHour = this.isOpen ? this.startTime[currentDay] : '';
      returnData.closeHour = this.isOpen ? this.endTime[currentDay] : '';
      this.today = this.isOpen ? this.day[currentDay] : '';
      console.log('if true:', returnData.startHour, returnData.closeHour, returnData.isOpen);
    } else {
      const dayTime = this.findStartTimeAndDay(currentTime, currentDay);
      this.today = dayTime;
      console.log(dayTime);
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
          // console.log(error);
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
        console.log(stores);
        if (stores.data && stores.data.length > 0) {
          stores.data.forEach(store => {

            console.log(store[0]);

            this.startTime[0] = store[0].sunStartHour;
            this.startTime[1] = store[0].monStartHour;
            this.startTime[2] = store[0].tueStartHour;
            this.startTime[3] = store[0].wedStartHour;
            this.startTime[4] = store[0].thuStartHour;
            this.startTime[5] = store[0].friStartHour;
            this.startTime[6] = store[0].satStartHour;

            this.endTime[0] = store[0].sunEndHour;
            this.endTime[1] = store[0].monEndHour;
            this.endTime[2] = store[0].tueEndHour;
            this.endTime[3] = store[0].wedEndHour;
            this.endTime[4] = store[0].thuEndHour;
            this.endTime[5] = store[0].friEndHour;
            this.endTime[6] = store[0].satEndHour;

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
  formatLabel(value
                :
                number
  ) {
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
