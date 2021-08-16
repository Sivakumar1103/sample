import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitlySuccessComponent } from './bitly-success.component';

describe('BitlySuccessComponent', () => {
  let component: BitlySuccessComponent;
  let fixture: ComponentFixture<BitlySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitlySuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitlySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
