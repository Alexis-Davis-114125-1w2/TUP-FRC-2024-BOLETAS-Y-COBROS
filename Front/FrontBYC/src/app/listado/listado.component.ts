import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Boleta {
  id: number;
  fechaEmision: string;
  periodo: string;
  monto: number;
  estado: string;
  urlBoleta: string;
  selected?: boolean;
}

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
})
export class ListadoComponent implements OnInit {
  documentosAPagar: Boleta[] = [];
  boletasPagadas: Boleta[] = [];
  boletasPagadasFiltradas: Boleta[] = [];
  totalAPagar: number = 0;
  filtroDesde: string = '';
  filtroHasta: string = '';
  filtroEstado: string = '';

  ngOnInit() {
    this.cargarBoletasEjemplo();
    this.aplicarFiltros();
  }

  cargarBoletasEjemplo() {
    this.documentosAPagar = [
      { id: 1, fechaEmision: '2024-09-02', periodo: '08/2024', monto: 10000, estado: 'Pendiente', urlBoleta: 'https://ejemplo.com/boleta1', selected: false },
      { id: 2, fechaEmision: '2024-10-02', periodo: '09/2024', monto: 10000, estado: 'Pendiente', urlBoleta: 'https://ejemplo.com/boleta2', selected: false },
      { id: 3, fechaEmision: '2024-11-02', periodo: '10/2024', monto: 10000, estado: 'Pendiente', urlBoleta: 'https://ejemplo.com/boleta3', selected: false },
      { id: 4, fechaEmision: '2024-12-02', periodo: '11/2024', monto: 10000, estado: 'Pendiente', urlBoleta: 'https://ejemplo.com/boleta4', selected: false },
    ];

    this.boletasPagadas = [
      { id: 5, fechaEmision: '2024-08-04', periodo: '07/2024', monto: 12500, estado: 'Pagado', urlBoleta: 'https://ejemplo.com/boleta5' },
    ];
  }

  updateTotalAPagar() {
    this.totalAPagar = this.documentosAPagar
      .filter(doc => doc.selected)
      .reduce((sum, doc) => sum + doc.monto, 0);
  }

  pagar() {
    const documentosSeleccionados = this.documentosAPagar.filter(doc => doc.selected);
    documentosSeleccionados.forEach(doc => {
      doc.estado = 'Pagado';
      this.boletasPagadas.push({ ...doc, selected: false });
    });

    this.documentosAPagar = this.documentosAPagar.filter(doc => !doc.selected);
    this.updateTotalAPagar();
    this.aplicarFiltros();
  }

  descargarPdf(url: string) {
    window.open(url, '_blank');
  }

  buscar() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.boletasPagadasFiltradas = this.boletasPagadas.filter(doc => {
      const fechaDoc = new Date(doc.fechaEmision);
      const cumpleFechaDesde = !this.filtroDesde || fechaDoc >= new Date(this.filtroDesde);
      const cumpleFechaHasta = !this.filtroHasta || fechaDoc <= new Date(this.filtroHasta);
      const cumpleEstado = !this.filtroEstado || doc.estado === this.filtroEstado;
      return cumpleFechaDesde && cumpleFechaHasta && cumpleEstado;
    });
  }
}
