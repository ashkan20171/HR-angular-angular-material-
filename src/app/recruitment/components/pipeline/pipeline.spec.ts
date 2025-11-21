import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pipeline } from './pipeline';

describe('Pipeline', () => {
  let component: Pipeline;
  let fixture: ComponentFixture<Pipeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pipeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pipeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
