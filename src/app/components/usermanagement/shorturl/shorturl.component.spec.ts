import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShorturlComponent } from './shorturl.component';

describe('ShorturlComponent', () => {
  let component: ShorturlComponent;
  let fixture: ComponentFixture<ShorturlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShorturlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShorturlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
