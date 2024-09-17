import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone : true,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  imports: [RouterModule]
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

