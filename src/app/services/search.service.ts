// @ts-ignore
import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FactoryService} from './factory.service';
import {Search} from '../model/search.model';


@Injectable()
export class SearchService {

  constructor(private httpClient: HttpClient, private fs: FactoryService) {
  }

  fetchAllStores(postData) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}ops/store/pharmacySearch?` + postData);
  }

  fetchAllSlides(postData) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}ops/store/getSearchImage?` + postData);
  }

  getAccesspoint() {
    return environment.serviceURL;
  }

  getCityState(pinCode) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}searchPincode/` + pinCode, this.fs.getHttpOptions());
  }
}
