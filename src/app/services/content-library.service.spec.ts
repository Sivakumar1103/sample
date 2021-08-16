import { TestBed } from '@angular/core/testing';

import { ContentLibraryService } from './content-library.service';

describe('ContentLibraryService', () => {
  let service: ContentLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
