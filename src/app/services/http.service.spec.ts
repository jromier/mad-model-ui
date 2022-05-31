import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from '../app.module';

import { HttpService } from './http.service';

describe('Http Service', () => {
  let httpService: HttpService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule, RouterTestingModule]
    })
  );

  beforeEach(() => {
    httpService = TestBed.inject(HttpService);
  });

  it('should check injection', () => {
    expect(httpService).toBeTruthy();
  });

  it('should init the service', () => {
    expect(httpService.baseUrl).toBe('');
  });
});
