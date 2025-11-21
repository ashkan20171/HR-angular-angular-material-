import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarSkills } from './radar-skills';

describe('RadarSkills', () => {
  let component: RadarSkills;
  let fixture: ComponentFixture<RadarSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarSkills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadarSkills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
