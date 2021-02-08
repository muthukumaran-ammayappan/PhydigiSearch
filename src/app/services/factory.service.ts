import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class FactoryService {
  constructor() {
  }

  getHttpHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('ops_user_id', localStorage.getItem('id'));
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

  getUserRoles(): string {
    const roles = localStorage.getItem('roles');
    return roles;
  }

  isUserAdmin(): boolean {
    const roles = this.getUserRoles();
    if (roles != null && roles.indexOf('ADMIN', 0) > -1) {
      return true;
    }
    return false;
  }
}
