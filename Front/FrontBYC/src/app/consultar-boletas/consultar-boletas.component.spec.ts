import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarBoletasComponent } from './consultar-boletas.component';

describe('ConsultarBoletasComponent', () => {
  let component: ConsultarBoletasComponent;
  let fixture: ComponentFixture<ConsultarBoletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarBoletasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarBoletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
