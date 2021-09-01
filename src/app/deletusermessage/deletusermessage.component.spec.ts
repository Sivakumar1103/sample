import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletusermessageComponent } from './deletusermessage.component';

describe('DeletusermessageComponent', () => {
  let component: DeletusermessageComponent;
  let fixture: ComponentFixture<DeletusermessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletusermessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletusermessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
