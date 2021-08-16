import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersocialprofileComponent } from './usersocialprofile.component';

describe('UsersocialprofileComponent', () => {
  let component: UsersocialprofileComponent;
  let fixture: ComponentFixture<UsersocialprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersocialprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersocialprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
