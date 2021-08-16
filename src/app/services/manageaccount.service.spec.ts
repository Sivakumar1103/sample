import { TestBed } from '@angular/core/testing';

import { ManageaccountService } from './manageaccount.service';

describe('ManageaccountService', () => {
  let service: ManageaccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageaccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
