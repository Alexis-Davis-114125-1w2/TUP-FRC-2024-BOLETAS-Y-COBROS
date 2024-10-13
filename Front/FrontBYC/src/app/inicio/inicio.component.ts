import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { ListadoComponent } from '../listado/listado.component';

@Component({
  selector: 'app-inicio',
  standalone : true,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  imports: [ ListadoComponent, PaymentFormComponent]
})

export class InicioComponent {
  constructor(private router: Router) { }
  irAConsultarBoletas() {
    this.router.navigate(['/consultar-boletas']);
  }
  irAConsultarPagosHistoricos() {
    this.router.navigate(['/consultar-pagos-historicos']);
  
  }

  status: number = 1;

  reciveStatus(status: number){
    this.status = status;
  }
}

