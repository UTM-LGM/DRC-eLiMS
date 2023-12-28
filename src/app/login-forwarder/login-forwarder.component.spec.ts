import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginForwarderComponent } from './login-forwarder.component';

describe('LoginForwarderComponent', () => {
  let component: LoginForwarderComponent;
  let fixture: ComponentFixture<LoginForwarderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginForwarderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginForwarderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
