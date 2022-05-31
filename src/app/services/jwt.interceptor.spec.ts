import { HttpHandler, HttpRequest } from '@angular/common/http';

import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  it('should do nothing if no jwt token', () => {
    const jwtService = new JwtInterceptor();
    const req = new HttpRequest('GET', '/');
    const next = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']) as HttpHandler;

    jwtService.intercept(req, next);

    const nextReq = (next.handle as jasmine.Spy).calls.argsFor(0)[0] as HttpRequest<any>;

    expect(nextReq.headers.get('Authorization')).toBeNull();
  });

  it('should set a jwt token', () => {
    const jwtService = new JwtInterceptor();
    const req = new HttpRequest('GET', '/');
    const next = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']) as HttpHandler;

    window.localStorage.setItem('auth_token', JSON.stringify('hello'));

    jwtService.setJwtToken();
    jwtService.intercept(req, next);

    const nextReq = (next.handle as jasmine.Spy).calls.argsFor(0)[0] as HttpRequest<any>;

    expect(nextReq.headers.get('Authorization')).toBe('Bearer hello');
  });

  it('should remove a jwt token', () => {
    const jwtService = new JwtInterceptor();
    const req = new HttpRequest('GET', '/');
    const next = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']) as HttpHandler;

    jwtService.setJwtToken();
    jwtService.removeJwtToken();
    jwtService.intercept(req, next);

    const nextReq = (next.handle as jasmine.Spy).calls.argsFor(0)[0] as HttpRequest<any>;

    expect(nextReq.headers.get('Authorization')).toBeNull();
  });
});
