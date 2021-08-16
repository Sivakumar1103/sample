import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveImageEditComponent } from './save-image-edit.component';

describe('SaveImageEditComponent', () => {
  let component: SaveImageEditComponent;
  let fixture: ComponentFixture<SaveImageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveImageEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveImageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
