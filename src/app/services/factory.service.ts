import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class FactoryService {
  constructor() {
  }

  getHttpHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  getFileHttpHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('ops_user_id', localStorage.getItem('id'));
    return headers;
  }

  getHttpOptions(): object {
    const options = {
      withCredentials: false,
      reportProgress: true,
      observe: 'response',
      headers: this.getHttpHeaders()
    };
    return options;
  }

  getFileHttpOptions(): object {
    const options = {
      withCredentials: false,
      reportProgress: true,
      observe: 'response',
      headers: this.getFileHttpHeaders()
    };
    return options;
  }
}
