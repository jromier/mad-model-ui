import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from '../services/http.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mad-login',
  styleUrls: ['login.component.scss'],
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  authenticationFailed = false;
  baseUrl: FormControl;
  login: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private httpService: HttpService) {
    
    this.baseUrl = this.fb.control(this.httpService.baseUrl, Validators.required);
    this.login = this.fb.control('', Validators.required);
    this.password = this.fb.control('');
    this.loginForm = this.fb.group({
      baseUrl: this.baseUrl,
      login: this.login,
      password: this.password
    })
  }

  ngOnInit(): void {
    this.httpService.retrieveBaseUrl();
;

    // To cleanup the menu bar
    this.userService.logout();
  }

  authenticate(): void {
    window.localStorage.setItem('base_url', JSON.stringify(this.loginForm.value.baseUrl));

    this.authenticationFailed = false;

    this.userService.authenticate({ login: this.loginForm.value.login, password: this.loginForm.value.password }).subscribe(
      () => this.router.navigate(['/http-api']),
      () => (this.authenticationFailed = true)
    );
  }
}
