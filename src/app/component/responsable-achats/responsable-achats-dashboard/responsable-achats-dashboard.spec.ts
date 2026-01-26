import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableAchatsDashboard } from './responsable-achats-dashboard';

describe('ResponsableAchatsDashboard', () => {
  let component: ResponsableAchatsDashboard;
  let fixture: ComponentFixture<ResponsableAchatsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsableAchatsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsableAchatsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
