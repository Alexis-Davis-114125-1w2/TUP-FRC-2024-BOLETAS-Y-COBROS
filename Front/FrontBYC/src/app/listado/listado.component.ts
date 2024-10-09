import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseCardComponent } from "../expense-card/expense-card.component";

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
  imports: [CommonModule, FormsModule, ExpenseCardComponent],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
})
export class ListadoComponent implements OnInit {
  documentosAPagar: Boleta[] = [];
  boletasPagadas: Boleta[] = [];
  boletasPagadasFiltradas: Boleta[] = [];
  filtroDesde: string = '';
  filtroHasta: string = '';
  filtroEstado: string = '';
  total: number = 0;


  ngOnInit() {
    this.cargarBoletasEjemplo();
  }


  recieveAmount(amount: number) {
    this.total += amount;
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


  async openPdf(id: number) {
    try {
      const response = await fetch(`http://localhost:8080/api/bill/pdf/${id}`);
      if (!response.ok) {
        alert("No se pudo cargar el pdf")
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error('There was an error opening the PDF:', error);
    }

  }


}
