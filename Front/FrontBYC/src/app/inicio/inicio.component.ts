import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PagarBoletaComponent } from '../pagar-boleta/pagar-boleta.component';

import { ListadoComponent } from '../listado/listado.component';

@Component({
  selector: 'app-inicio',
  standalone : true,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  imports: [ ListadoComponent, PagarBoletaComponent]
})

export class InicioComponent {
  constructor(private router: Router) { }
  irAConsultarBoletas() {
    this.router.navigate(['/consultar-boletas']);
  }
  irAConsultarPagosHistoricos() {
    this.router.navigate(['/consultar-pagos-historicos']);
  
  }

  status: boolean = true;

  reciveStatus(status: boolean){
    this.status = status;
  }
}

