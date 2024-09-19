import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarBoletaComponent } from './pagar-boleta.component';

describe('PagarBoletaComponent', () => {
  let component: PagarBoletaComponent;
  let fixture: ComponentFixture<PagarBoletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagarBoletaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagarBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
