import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrosAdminComponent } from './centrosAdmin.component';

describe('CentrosComponent', () => {
  let component: CentrosAdminComponent;
  let fixture: ComponentFixture<CentrosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentrosAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CentrosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
