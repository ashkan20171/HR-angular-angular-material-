import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfReview } from './self-review';

describe('SelfReview', () => {
  let component: SelfReview;
  let fixture: ComponentFixture<SelfReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
