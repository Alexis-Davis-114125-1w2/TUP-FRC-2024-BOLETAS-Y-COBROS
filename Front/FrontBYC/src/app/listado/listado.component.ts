import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../Service/data.service';
import { BoletaInterface } from './boleta-interface';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { of } from 'rxjs/internal/observable/of';
import { switchMap, tap } from 'rxjs/operators';



@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
})
export class ListadoComponent implements OnInit {
  documentosAPagar: BoletaInterface[] = [];
  boletasPagadas: BoletaInterface[] = [];
  boletasPagadasFiltradas: BoletaInterface[] = [];
  totalAPagar: number = 0;
  filtroDesde: string = '';
  filtroHasta: string = '';
  filtroEstado: string = '';
  boletas$: Observable<BoletaInterface[]> = of([]);
  private refreshBoletas$ = new BehaviorSubject<void>(undefined);
    
  
  ownerId: number = 4
  constructor(private dataService: DataService) {
    this.boletas$ = this.refreshBoletas$.pipe(
      switchMap(() => this.dataService.TraerTODASboletas()),
      tap(boletas => {
        this.documentosAPagar = boletas.filter((boleta) => boleta.status === 'Pendiente' || boleta.status === 'Atrasado');
        this.boletasPagadas = boletas.filter((boleta) => boleta.status === 'Pago');
        this.updateTotalAPagar();
        this.aplicarFiltros();
      })
    );
  }

  ngOnInit() {
    this.cargarBoletasPorUsuarioId();
    this.aplicarFiltros();
  }
  IdparaProbar: number = 1;

    cargarBoletasPorUsuarioId() {
      this.refreshBoletas$.next();
    }

  

  updateTotalAPagar() {
    this.totalAPagar = this.documentosAPagar
    .filter(doc => doc.selected)
    .reduce((sum, doc) => sum + doc.first_expiration_amount, 0);
}

  pagar() {
    const documentosSeleccionados = this.documentosAPagar.filter(doc => doc.selected);
    documentosSeleccionados.forEach(doc => {
      doc.status = 'Pago'; 
      this.boletasPagadas.push({ ...doc, selected: false }); 
    });
    this.documentosAPagar = this.documentosAPagar.filter(doc => !doc.selected);
    this.updateTotalAPagar(); 
    this.aplicarFiltros(); 
  }

  buscar() {
    this.aplicarFiltros();
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
      console.error('Hubo un error abriendo el PDF:', error);
    }
  }
  aplicarFiltros() {
    this.boletasPagadasFiltradas = this.boletasPagadas.filter(doc => {
      const fechaDoc = new Date(doc.issueDate);
      const cumpleFechaDesde = !this.filtroDesde || fechaDoc >= new Date(this.filtroDesde);
      const cumpleFechaHasta = !this.filtroHasta || fechaDoc <= new Date(this.filtroHasta);
      const cumpleEstado = !this.filtroEstado || doc.status === this.filtroEstado;
      return cumpleFechaDesde && cumpleFechaHasta && cumpleEstado;
    });
  }

}
