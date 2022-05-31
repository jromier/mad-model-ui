import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';

import { AppModule } from '../app.module';
import { UserService } from '../services/user.service';
import { LoginComponent } from './login.component';

describe('Component: Login', () => {
  const fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
  const fakeUserService = jasmine.createSpyObj<UserService>('UserService', ['authenticate', 'logout']);

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [
        { provide: Router, useValue: fakeRouter },
        { provide: UserService, useValue: fakeUserService }
      ]
    })
  );

  afterEach(() => {
    fakeRouter.navigate.calls.reset();
    fakeUserService.authenticate.calls.reset();
  });

  it('should have a title', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a title
    const element = fixture.nativeElement;
    expect(element.querySelector('h1').textContent).toContain('Log in');
  });

  it('should have a disabled button if the form is incomplete', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a disabled button
    const element = fixture.nativeElement;
    expect(element.querySelector('button').hasAttribute('disabled')).toBe(true);
  });

  it('should be possible to log in if the form is complete', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const element = fixture.nativeElement;
    element.querySelector('#login').value = 'login';
    element.querySelector('#login').dispatchEvent(new Event('input'));
    element.querySelector('#password').value = 'password';
    element.querySelector('#password').dispatchEvent(new Event('input'));

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a submit button enabled
    expect(element.querySelector('button').hasAttribute('disabled')).toBe(false);
  });

  it('should call the user service and redirect if success', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const obs = new Observable<string>();
    fakeUserService.authenticate.and.returnValue(obs);

    const componentInstance = fixture.componentInstance;
    componentInstance.login.setValue('login');
    componentInstance.password.setValue('password');

    componentInstance.authenticate();

    // then we should have called the user service method
    expect(fakeUserService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    // and redirect to the home
    expect(componentInstance.authenticationFailed).toBe(false);
  });

  it('should call the user service and display a message if failed', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const obs = new Observable<string>();
    fakeUserService.authenticate.and.returnValue(obs);

    const componentInstance = fixture.componentInstance;
    componentInstance.login.setValue('login');
    componentInstance.password.setValue('password');

    componentInstance.authenticate();

    // then we should have called the user service method
    expect(fakeUserService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    // and not redirect to the home
    expect(componentInstance.authenticationFailed).toBeFalse();
  });

  it('should display a message if auth failed', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const componentInstance = fixture.componentInstance;
    componentInstance.authenticationFailed = true;
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.querySelector('.alert').textContent).toContain('Nope, try again');
  });
});
