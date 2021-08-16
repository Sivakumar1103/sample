import { TestBed } from '@angular/core/testing';

import { FacebookAKService } from './facebook.ak.service';

describe('FacebookService', () => {
  let service: FacebookAKService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacebookAKService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
