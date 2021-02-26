// @ts-ignore
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FactoryService} from './factory.service';


@Injectable()
export class SearchService {

  constructor(private httpClient: HttpClient, private fs: FactoryService) {
  }

  fetchAllStores(postData) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}/api/ops/store/pharmacySearch?` + postData);
  }

  fetchAllSlides(postData) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}/api/ops/store/getSearchImage?` + postData);
  }

  getAccesspoint() {
    return environment.serviceURL;
  }

  getCityState(pinCode) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}/api/searchPincode/` + pinCode, this.fs.getHttpOptions());
  }
}
