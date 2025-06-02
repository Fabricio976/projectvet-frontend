import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAnimalsComponent } from './register-animals.component';

describe('RegisterAnimalsComponent', () => {
  let component: RegisterAnimalsComponent;
  let fixture: ComponentFixture<RegisterAnimalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAnimalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAnimalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
