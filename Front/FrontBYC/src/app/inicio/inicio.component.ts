import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ListadoComponent } from '../listado/listado.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone : true,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  imports: [ ListadoComponent, HttpClientModule]
})

export class InicioComponent {
  constructor(private router: Router) { }
  irAConsultarBoletas() {
    this.router.navigate(['/consultar-boletas']);
  }
  irAConsultarPagosHistoricos() {
    this.router.navigate(['/consultar-pagos-historicos']);
  }
}

