import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StripePaymentComponent } from "../stripe-payment/stripe-payment.component";
import { environment } from '../../environments/environment';
import {FormsModule} from "@angular/forms";

interface Boleta {
  id: number;
  ownerId: number;
  firstExpirationDate: string;
  firstExpirationAmount: number;
  secondExpirationDate: string;
  secondExpirationAmount: number;
  paymentMethod: string | null;
  status: string;
  selected?: boolean;
  periodo?: string;
  lista?: string;
}

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule,FormsModule, StripePaymentComponent],
  templateUrl: './listado.component.html',
  styles: [`
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      max-width: 500px;
    }
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  `]
})
export class ListadoComponent implements OnInit {
  boletasNoPagadas: Boleta[] = [];
  boletasPagadas: Boleta[] = [];
  totalSeleccionado: number = 0;
  showStripeModal = false;
  boletasSeleccionadas: Boleta[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarBoletas();
  }

  cargarBoletas() {
    this.http.get<Boleta[]>(`${environment.apiBill_ServiceUrl}/api/bills`)
      .subscribe({
        next: (response) => {
          this.boletasNoPagadas = response.filter(boleta => boleta.status !== 'Pago' && boleta.status !== 'Exceptuada');
          this.boletasPagadas = response.filter(boleta => boleta.status === 'Pago' || boleta.status === 'Exceptuada');
          this.calcularTotalSeleccionado();
        },
        error: (error) => {
          console.error('Error al cargar las facturas:', error);
        }
      });
  }

  toggleSeleccion(boleta: Boleta) {
    boleta.selected = !boleta.selected;
    this.calcularTotalSeleccionado();
  }

  calcularTotalSeleccionado() {
    this.boletasSeleccionadas = this.boletasNoPagadas.filter(boleta => boleta.selected);
    this.totalSeleccionado = this.boletasSeleccionadas.reduce((sum, boleta) => sum + boleta.firstExpirationAmount, 0);
    console.log('Boletas seleccionadas:', this.boletasSeleccionadas);
    console.log('Total seleccionado:', this.totalSeleccionado);
  }

  pagar() {
    if (this.totalSeleccionado > 0) {
      this.showStripeModal = true;
    }
  }

  cerrarModal() {
    this.boletasSeleccionadas = [];
    this.totalSeleccionado = 0;
    this.showStripeModal = false;
  }

  onPaymentComplete(success: boolean) {
    if (success) {
      this.boletasSeleccionadas.forEach(boleta => {
        boleta.status = 'Pago';
        this.boletasPagadas.unshift(boleta);
        const index = this.boletasNoPagadas.findIndex(b => b.id === boleta.id);
        if (index !== -1) {
          this.boletasNoPagadas.splice(index, 1);
        }
      });
    }
  }

 /* async descargarPdf() {
    if (this.facturaActual) {
      try {
        const response = await fetch(`${environment.apiBill_ServiceUrl}/api/bills/${this.facturaActual.id}/pdf`);
        if (!response.ok) {
          throw new Error('No se pudo descargar el pdf');
      }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura_${this.facturaActual.firstExpirationDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error al descargar el PDF:', error);
      }
    }
  }*/
  // Define el método trackById
  trackById(index: number, boleta: Boleta): number {
    return boleta.id;
  }
}
