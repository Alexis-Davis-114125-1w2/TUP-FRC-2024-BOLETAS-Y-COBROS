import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MercadoPagoPopupComponent } from './mercado-pago-popup.component';

describe('MercadoPagoPopupComponent', () => {
  let component: MercadoPagoPopupComponent;
  let fixture: ComponentFixture<MercadoPagoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MercadoPagoPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MercadoPagoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
