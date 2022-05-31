import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { HttpService } from './http.service';
import { JwtInterceptor } from './jwt.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userEvents: BehaviorSubject<string> = new BehaviorSubject<string>('');

  login = 'test';

  constructor(private http: HttpService, private jwtInterceptorService: JwtInterceptor) {
    this.retrieveUser();
  }

  authenticate(credentials: { login: string; password: string }): Observable<string> {
    this.login = credentials.login;

    return this.http.post('/api/authenticate', credentials).pipe(tap((token) => this.storeLoggedInUser(token)));
  }

  logout(): void {
    this.userEvents.next('');

    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('id_login');

    this.jwtInterceptorService.removeJwtToken();
  }

  retrieveUser(): void {
    const authToken = window.localStorage.getItem('auth_token');
    const idLogin = window.localStorage.getItem('id_login');

    if (authToken && idLogin) {
      this.login = idLogin;

      this.userEvents.next(this.login);
    }
  }

  storeLoggedInUser(token: any): void {
    console.log('storeLoggedInUser=' + JSON.stringify(token));

    // Verify if answer is an authentication token
    if (token.data[0].type === 'authentication token') {
      window.localStorage.setItem('auth_token', JSON.stringify(token.data[0].attributes.auth_token));
      window.localStorage.setItem('id_login', this.login);

      this.userEvents.next(this.login);
    }
  }
}
