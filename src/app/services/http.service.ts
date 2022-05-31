import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { JwtInterceptor } from './jwt.interceptor';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  baseUrl = '';

  constructor(private http: HttpClient, private jwtInterceptorService: JwtInterceptor) {}

  get(path: string): Observable<any> {
    this.retrieveBaseUrl();
    this.jwtInterceptorService.setJwtToken();

    return this.http.get(`${this.baseUrl}${path}`);
  }

  post(path: string, body: any): Observable<any> {
    this.retrieveBaseUrl();
    this.jwtInterceptorService.setJwtToken();

    return this.http.post(`${this.baseUrl}${path}`, body);
  }

  getBaseUrl(): string {
    this.retrieveBaseUrl();

    return this.baseUrl;
  }

  retrieveBaseUrl(): void {
    const stringifiedBaseUrl = window.localStorage.getItem('base_url');

    console.log('window.location.origin=' + window.location.origin);

    if (stringifiedBaseUrl) {
      this.baseUrl = JSON.parse(stringifiedBaseUrl);
    } else {
      this.baseUrl = environment.production ? window.location.origin : 'https://172.29.4.17:443';

      window.localStorage.setItem('base_url', JSON.stringify(this.baseUrl));
    }
  }
}
