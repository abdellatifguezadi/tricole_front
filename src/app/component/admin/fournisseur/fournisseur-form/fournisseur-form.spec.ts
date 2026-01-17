import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurForm } from './fournisseur-form';

describe('FournisseurForm', () => {
  let component: FournisseurForm;
  let fixture: ComponentFixture<FournisseurForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FournisseurForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FournisseurForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
