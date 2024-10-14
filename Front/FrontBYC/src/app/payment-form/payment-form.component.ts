import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ExpenseInterface } from '../expense-interface';
import { ClientServiceService } from '../module/client-service.service';
import { CheckoutServiceService } from '../checkout-service.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import {CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    DatePipe,
    CurrencyPipe,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault

  ],
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  @Output() status = new EventEmitter<number>();
  @Input() paymentMethod: number = 0;
  @Input() billInfo: ExpenseInterface[] = [];

  paymentForm: FormGroup;
  total: number = 0;
  stripe: Stripe | null = null;
  cardElement: StripeCardElement | null = null;

  expensesToPay: ExpenseInterface[] = [];
  paymentIntentId: string = "";
  clientSecret: string = "";
  error: string = '';
  paymentStatusMessage: string = '';
  processing: boolean = false;
  paymentSuccessful: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public expenseService: ClientServiceService,
    public checkout: CheckoutServiceService
  ) {
    this.paymentForm = this.formBuilder.group({
      cardHolderName: ['', Validators.required],
      dni: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.expensesToPay = this.expenseService.getSelectedExpenses();
    this.total = this.expensesToPay.reduce((sum, expense) => sum + expense.first_expiration_amount, 0);

    this.stripe = await loadStripe('pk_test_51Q3iwwRwJDdlWggbw9AqW6ETZEuj0aRgDME6NdDAbamdDihYRdK4k0G1dbR3IPNYqm3k2vt1tCpIJKrQ85IR8rNE00mGz2BoE9');
    if (this.stripe) {
      const elements = this.stripe.elements();
      this.cardElement = elements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontSize: '19px',
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            fontWeight: '400',
            lineHeight: '24px',
            '::placeholder': { color: '#aab7c4' }
          },
          invalid: { color: '#fa755a', iconColor: '#fa755a' },
        },
        hidePostalCode: true,
      });
      this.cardElement.mount('#card-element');
    } else {
      console.error("Stripe no se pudo inicializar");
    }
  }

  async onSubmit() {
    if (this.paymentForm.invalid || !this.stripe || !this.cardElement) {
      return;
    }
    this.processing = true;
    this.error = '';

    try {
      const paymentIntentResponse = await this.createPaymentIntent();
      if (!paymentIntentResponse) {
        throw new Error("Error: No se recibió clientSecret");
      }

      const { clientSecret } = paymentIntentResponse;

      // Confirmación del pago usando el clientSecret
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: this.paymentForm.get('cardHolderName')?.value,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Error al confirmar el pago");
      }

      this.paymentSuccessful = true;
      this.paymentStatusMessage = "Pago realizado con éxito";
    } catch (err: any) {
      console.error("Error en el proceso de pago:", err);
      this.error = err.message || "Error al procesar el pago";
    } finally {
      this.processing = false;
    }
  }


  async createPaymentIntent(): Promise<{ clientSecret: string } | undefined> {
    const currency = 'ars';
    const cardHolderName = this.paymentForm.get('cardHolderName')?.value;
    const dni = this.paymentForm.get('dni')?.value;
    const requestBody = {
      amount: this.total,
      currency: currency,
      cardHolderName: cardHolderName,
      dni: dni
    };

    // Llamada al servicio con la nueva configuración
    const response = await this.checkout.createPaymentIntent(requestBody).toPromise();
    if (!response?.clientSecret) {
      throw new Error("No se recibió clientSecret del backend");
    }
    return response;
  }




  downloadReceipt() {
    this.checkout.generateReceipt(this.paymentIntentId).subscribe({
      next: (pdfBytes: ArrayBuffer) => {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'receipt.pdf';
        link.click();
      },
      error: err => {
        console.error('Error generating receipt:', err);
        this.error = 'Error al generar el comprobante';
      }
    });
  }

  goBack() {
    this.expenseService.clearSelectedExpenses();
    this.status.emit(1);
  }
}
