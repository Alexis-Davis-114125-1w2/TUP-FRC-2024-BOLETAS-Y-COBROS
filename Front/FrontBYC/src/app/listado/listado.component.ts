import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Boleta {
  fechaEmision: string;
  periodo: string;
  monto: number;
  lista: string;
  estado: string;
  urlBoleta: string;
  urlPago: string;
}

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  boletas: Boleta[] = [];
  total: number = 0;

  ngOnInit() {
    this.cargarBoletasEjemplo();
    this.calcularTotal();
  }

  cargarBoletasEjemplo() {
    this.boletas = [
      {
        fechaEmision: '2024-09-01',
        periodo: 'Septiembre 2024',
        monto: 5000,
        lista: 'Expensas',
        estado: 'Pendiente',
        urlBoleta: 'https://ejemplo.com/boleta1',
        urlPago: 'https://www.mercadopago.com.ar'
      },
      {
        fechaEmision: '2024-08-01',
        periodo: 'Agosto 2024',
        monto: 4800,
        lista: 'Expensas',
        estado: 'Pagado',
        urlBoleta: 'https://ejemplo.com/boleta2',
        urlPago: 'https://www.mercadopago.com.ar'
      },
      {
        fechaEmision: '2024-07-01',
        periodo: 'Julio 2024',
        monto: 4600,
        lista: 'Expensas',
        estado: 'Pendiente',
        urlBoleta: 'https://ejemplo.com/boleta3',
        urlPago: 'https://www.mercadopago.com.ar'
      },
      {
        fechaEmision: '2024-06-01',
        periodo: 'Junio 2024',
        monto: 4400,
        lista: 'Expensas',
        estado: 'Pagado',
        urlBoleta: 'https://ejemplo.com/boleta4',
        urlPago: 'https://www.mercadopago.com.ar'
      },
      {
        fechaEmision: '2024-05-01',
        periodo: 'Mayo 2024',
        monto: 4200,
        lista: 'Expensas',
        estado: 'Pendiente',
        urlBoleta: 'https://ejemplo.com/boleta5',
        urlPago: 'https://www.mercadopago.com.ar'
      }
    ];
  }

  calcularTotal() {
    this.total = this.boletas.reduce((sum, boleta) => sum + boleta.monto, 0);
  }

  pagar(urlPago: string) {
    window.open(urlPago, '_blank');
  }
}