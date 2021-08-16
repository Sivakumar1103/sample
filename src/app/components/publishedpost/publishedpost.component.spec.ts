import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedpostComponent } from './publishedpost.component';

describe('PublishedpostComponent', () => {
  let component: PublishedpostComponent;
  let fixture: ComponentFixture<PublishedpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishedpostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
