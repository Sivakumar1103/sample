import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentlibraryComponent } from './contentlibrary.component';

describe('ContentlibraryComponent', () => {
  let component: ContentlibraryComponent;
  let fixture: ComponentFixture<ContentlibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentlibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentlibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
