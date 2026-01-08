import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarItems } from './sidebar-items';

describe('SidebarItems', () => {
  let component: SidebarItems;
  let fixture: ComponentFixture<SidebarItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
