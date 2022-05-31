import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { JwtInterceptor } from './jwt.interceptor';
import { UserService } from './user.service';

describe('User Service', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should authenticate a user', waitForAsync(() => {
    const userService = TestBed.inject(UserService);

    spyOn(userService, 'authenticate');

    const credentials = { login: 'admin', password: 'admin' };
    userService.authenticate(credentials);

    expect(userService.authenticate).toHaveBeenCalledWith(credentials);
  }));

  it('should store the logged in user', waitForAsync(() => {
    const userService = TestBed.inject(UserService);
    const token = {
      data: [
        {
          attributes: { auth_token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo' },
          type: 'authentication token'
        }
      ]
    };

    spyOn(userService.userEvents, 'next');
    spyOn(Storage.prototype, 'setItem');

    userService.storeLoggedInUser(token);

    expect(userService.userEvents.next).toHaveBeenCalledWith('test');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('auth_token', JSON.stringify(token.data[0].attributes.auth_token));
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('id_login', 'test');
  }));

  it('should retrieve a user if one is stored', waitForAsync(() => {
    const userService = TestBed.inject(UserService);

    spyOn(Storage.prototype, 'getItem');

    userService.retrieveUser();

    expect(Storage.prototype.getItem).toHaveBeenCalledWith('auth_token');
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('id_login');
  }));

  it('should logout the user', waitForAsync(() => {
    const jwtInterceptorService = TestBed.inject(JwtInterceptor);
    const userService = TestBed.inject(UserService);

    spyOn(Storage.prototype, 'removeItem');
    spyOn(jwtInterceptorService, 'removeJwtToken');

    userService.logout();

    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('auth_token');
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('id_login');
    expect(jwtInterceptorService.removeJwtToken).toHaveBeenCalled();
  }));
});
