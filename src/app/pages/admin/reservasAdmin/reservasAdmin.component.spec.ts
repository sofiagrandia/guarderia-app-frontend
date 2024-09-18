import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasAdminComponent } from './reservasAdmin.component';

describe('ReservasComponent', () => {
  let component: ReservasAdminComponent;
  let fixture: ComponentFixture<ReservasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
