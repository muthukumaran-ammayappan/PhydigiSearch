// @ts-ignore
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FactoryService} from './factory.service';


@Injectable()
export class SearchService {

  constructor(private httpClient: HttpClient, private fs: FactoryService) {
  }

  fetchAllStores(postData: any) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}/api/ops/store/pharmacySearch?` + postData);
  }

  fetchAllSlides(postData: any) {
    return this.httpClient.get<any>(`${this.getAccesspoint()}/api/ops/store/getSearchImage?` + postData);
  }

  getAccesspoint() {
    return environment.serviceURL;
    // return environment.serviceURL;
  }
}
