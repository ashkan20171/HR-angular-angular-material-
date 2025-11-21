import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiChart } from './kpi-chart';

describe('KpiChart', () => {
  let component: KpiChart;
  let fixture: ComponentFixture<KpiChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
