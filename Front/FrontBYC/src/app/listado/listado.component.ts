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
  facturaActual: Boleta | null = null;
  totalPagado: number = 0;

  ngOnInit() {
    this.cargarBoletasEjemplo();
  }

  cargarBoletasEjemplo() {
    const boletasNoPagadas: Boleta[] = [
      {
        fechaEmision: '2024-09-01',
        periodo: 'Septiembre 2024',
        monto: 5000,
        lista: 'Expensas',
        estado: 'No Pagado',
        urlBoleta: 'https://ejemplo.com/boleta1',
        urlPago: 'https://www.mercadopago.com.ar'
      },
      {
        fechaEmision: '2024-08-01',
        periodo: 'Agosto 2024',
        monto: 4800,
        lista: 'Expensas',
        estado: 'No Pagado',
        urlBoleta: 'https://ejemplo.com/boleta2',
        urlPago: 'https://www.mercadopago.com.ar'
      },
      {
        fechaEmision: '2024-07-01',
        periodo: 'Julio 2024',
        monto: 4600,
        lista: 'Expensas',
        estado: 'No Pagado',
        urlBoleta: 'https://ejemplo.com/boleta3',
        urlPago: 'https://www.mercadopago.com.ar'
      }
    ];

    this.boletas = [
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
        estado: 'Pagado',
        urlBoleta: 'https://ejemplo.com/boleta5',
        urlPago: 'https://www.mercadopago.com.ar'
      }
    ];

    this.calcularFacturaActual(boletasNoPagadas);
    this.calcularTotalPagado();
  }

  calcularFacturaActual(boletasNoPagadas: Boleta[]) {
    const totalNoPagado = boletasNoPagadas.reduce((sum, boleta) => sum + boleta.monto, 0);
    const recargo = totalNoPagado * 0.05 * boletasNoPagadas.length;
    const montoTotal = totalNoPagado + recargo;
    this.facturaActual = {
      fechaEmision: new Date().toISOString().split('T')[0],
      periodo: 'Facturas pendientes',
      monto: montoTotal,
      lista: 'Expensas acumuladas',
      estado: 'No Pagado',
      urlBoleta: 'https://ejemplo.com/factura-actual',
      urlPago: 'https://www.mercadopago.com.ar'
    };
  }

  calcularTotalPagado() {
    this.totalPagado = this.boletas.reduce((sum, boleta) => sum + boleta.monto, 0);
  }

  pagar(urlPago: string) {
    window.open(urlPago, '_blank');
  }


  async descargarPdf() {
    try {
      const response = await fetch(`http://localhost:8080/api/`);
      if (!response.ok) {
        throw new Error('No se pudo descargar el pdf');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bill.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Hubo un error al descargar el pdf:', error);
    }
  }
}
