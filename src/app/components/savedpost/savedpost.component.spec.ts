import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedpostComponent } from './savedpost.component';

describe('SavedpostComponent', () => {
  let component: SavedpostComponent;
  let fixture: ComponentFixture<SavedpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedpostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
