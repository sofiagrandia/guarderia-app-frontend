import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAdminComponent } from './usersAdmin.component';

describe('UsersComponent', () => {
  let component: UsersAdminComponent;
  let fixture: ComponentFixture<UsersAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
