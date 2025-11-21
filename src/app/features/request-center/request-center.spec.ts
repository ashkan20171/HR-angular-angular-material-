import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCenter } from './request-center';

describe('RequestCenter', () => {
  let component: RequestCenter;
  let fixture: ComponentFixture<RequestCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestCenter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestCenter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
