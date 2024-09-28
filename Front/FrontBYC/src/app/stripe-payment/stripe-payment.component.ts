import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { FormsModule } from "@angular/forms";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ContentText, TDocumentDefinitions} from 'pdfmake/interfaces';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
interface Boleta {
  id: number;
  ownerId: number;
  firstExpirationDate: string;
  firstExpirationAmount: number;
  secondExpirationDate: string;
  secondExpirationAmount: number;
  paymentMethod: string | null;
  status: string;
  periodo?: string;
  lista?: string;
}

@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stripe-container">
      <form (ngSubmit)="handleSubmit()" #paymentForm="ngForm" class="payment-form">
        <div class="form-group">
          <label for="cardholderName">Nombre en la tarjeta</label>
          <input type="text" id="cardholderName" name="cardholderName" [(ngModel)]="cardholderName" required class="form-control">
        </div>
        <div id="paymentElement" class="mt-3"></div>
        <button type="submit" [disabled]="!stripe || processing || !clientSecret" class="btn btn-primary mt-3 w-100">
          {{ processing ? 'Procesando...' : 'Pagar ahora' }}
        </button>
      </form>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
      <div *ngIf="paymentStatus" [ngClass]="{'alert-success': paymentStatus === 'success', 'alert-danger': paymentStatus === 'failed'}" class="alert mt-3">
        {{ paymentStatusMessage }}
        <button *ngIf="paymentStatus === 'success'" (click)="downloadReceipt()" class="btn btn-secondary mt-2">Descargar comprobante</button>
      </div>
    </div>
  `,
  styles: [`
    .stripe-container {
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background-color: #f8f9fa;
    }
    .payment-form {
      max-width: 400px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
    }
    .btn-primary {
      background-color: #007bff;
      border-color: #007bff;
    }
    .btn-secondary {
      background-color: #6c757d;
      border-color: #6c757d;
      color: white;
    }
  `]
})
export class StripePaymentComponent implements OnInit, OnChanges {
  @Input() amount: number = 0;
  @Input() billInfo: Boleta[] = [];
  @Output() paymentComplete = new EventEmitter<boolean>();
  stripe: any;
  elements: any;
  paymentElement: any;
  error: string | null = null;
  processing = false;
  paymentStatus: 'success' | 'failed' | null = null;
  paymentStatusMessage: string = '';
  clientSecret: string = '';
  cardholderName: string = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.initializeStripe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['amount'] && !changes['amount'].firstChange && this.amount > 0) {
      this.createPaymentIntent();
    }
    if (changes['boletaInfo']) {
      console.log('boletaInfo changed:', this.billInfo);
    }
  }

  async initializeStripe() {
    this.stripe = await loadStripe(environment.stripePublicKey);
  }

  createPaymentIntent() {
    if (!this.billInfo || this.billInfo.length === 0 || this.amount <= 0) {
      this.error = 'Información de la boleta no disponible o monto inválido';
      return;
    }

    this.http.post<{ clientSecret: string }>(
      `${environment.apiStripe_ServiceUrl}/create-payment-intent`,
      {
        amount: Math.round(this.amount * 100),
        metadata: {
          boletasIds: this.billInfo.map(b => b.id).join(',')
        }
      }
    ).subscribe(
      (response) => {
        this.clientSecret = response.clientSecret;
        this.setupStripeElements();
      },
      (error) => {
        console.error('Error al crear PaymentIntent:', error);
        this.error = 'No se pudo inicializar el pago. Por favor, intente de nuevo.';
      }
    );
  }

  setupStripeElements() {
    if (!this.stripe || !this.clientSecret) {
      console.error('Stripe no ha sido inicializado o no hay clientSecret');
      return;
    }

    this.elements = this.stripe.elements({clientSecret: this.clientSecret});
    this.paymentElement = this.elements.create('payment');
    this.paymentElement.mount('#paymentElement');
  }

  async handleSubmit() {
    this.processing = true;

    if (!this.stripe || !this.elements) {
      console.error('Stripe no ha sido inicializado correctamente');
      this.error = 'Error en la inicialización del pago';
      this.processing = false;
      return;
    }

    const {error, paymentIntent} = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/return`,
        payment_method_data: {
          billing_details: {
            name: this.cardholderName
          }
        }
      },
      redirect: 'if_required'
    });

    if (error) {
      this.error = error.message;
      this.paymentStatus = 'failed';
      this.paymentStatusMessage = 'El pago ha fallado. Por favor, intente de nuevo.';
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      this.error = null;
      this.paymentStatus = 'success';
      this.paymentStatusMessage = '¡Pago realizado con éxito!';
      this.paymentComplete.emit(true);
    }

    this.processing = false;
  }

  async downloadReceipt() {
    console.log('Iniciando descarga de recibo. boletaInfo:', this.billInfo);
    if (!this.billInfo || this.billInfo.length === 0) {
      console.error('La información de las boletas no está disponible');
      this.error = 'No se puede generar el comprobante. La información de las boletas no está disponible.';
      return;
    }

    try {
      const {paymentIntent} = await this.stripe.retrievePaymentIntent(this.clientSecret);

      if (!paymentIntent) {
        throw new Error('No se pudo recuperar la información del pago');
      }

      const boletasContent = this.billInfo.map((boleta: Boleta) => {
        return [
          {text: `Período: ${boleta.periodo || 'No especificado'}`, margin: [0, 5, 0, 0]} as ContentText,
          {text: `Tipo: ${boleta.lista || 'No especificado'}`, margin: [0, 0, 0, 5]} as ContentText,
          {text: `Monto: $${boleta.firstExpirationAmount.toFixed(2)}`, margin: [0, 0, 0, 10]} as ContentText,
        ];
      }).flat();

      const docDefinition: TDocumentDefinitions = {
        content: [
          {text: 'Comprobante de Pago', style: 'header'},
          {text: `Fecha: ${new Date(paymentIntent.created * 1000).toLocaleDateString()}`, margin: [0, 20, 0, 10]},
          {text: `Nombre del titular: ${this.cardholderName}`, margin: [0, 0, 0, 10]},
          {text: `Monto total: $${(paymentIntent.amount / 100).toFixed(2)}`, margin: [0, 0, 0, 10]},
          {text: `ID de Transacción: ${paymentIntent.id}`, margin: [0, 0, 0, 10]},
          {
            text: `Método de Pago: ${paymentIntent.payment_method_types[0]} ${paymentIntent.payment_method_details?.card?.brand || ''} terminada en ${paymentIntent.payment_method_details?.card?.last4 || ''}`,
            margin: [0, 0, 0, 10]
          },
          {text: 'Detalle de boletas pagadas:', style: 'subheader'},
          ...boletasContent,
          {text: 'Gracias por su pago', style: 'thankYouMessage'}
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            color: '#2196F3'
          },
          thankYouMessage: {
            fontSize: 15,
            bold: true,
            alignment: 'center',
            color: '#4CAF50'
          }
        }
      };

      pdfMake.createPdf(docDefinition).download('comprobante_pago.pdf');
    } catch (error) {
      console.error('Error al generar el comprobante:', error);
      this.error = 'No se pudo generar el comprobante. Por favor, intente de nuevo más tarde.';
    }
  }
}
