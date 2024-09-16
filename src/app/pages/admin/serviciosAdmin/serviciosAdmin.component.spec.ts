import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosAdminComponent } from './serviciosAdmin.component';

describe('ServiciosComponent', () => {
  let component: ServiciosAdminComponent;
  let fixture: ComponentFixture<ServiciosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiciosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
