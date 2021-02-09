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

  fetchAllCustomer(postData: string) {
    console.log (postData);
    return this.httpClient.get<any>(`${this.getAccesspoint()}ops/store/pharmacySearch?pharmacy=` + postData);
  }

  getAccesspoint() {
    return environment.serviceURL;
  }

  getCityState(pinCode) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}searchPincode/` + pinCode, this.fs.getHttpOptions());
  }
}
