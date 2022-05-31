import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  private token: string | null = null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.token) {
      const clone = req.clone({ setHeaders: { Authorization: `Bearer ${this.token}` } });

      return next.handle(clone);
    }

    return next.handle(req);
  }

  removeJwtToken(): void {
    this.token = null;
  }

  setJwtToken(): void {
    const stringifiedToken = window.localStorage.getItem('auth_token');
    this.token = stringifiedToken ? JSON.parse(stringifiedToken) : null;
  }
}
