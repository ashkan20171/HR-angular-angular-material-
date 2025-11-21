import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsManager } from './requests-manager';

describe('RequestsManager', () => {
  let component: RequestsManager;
  let fixture: ComponentFixture<RequestsManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
