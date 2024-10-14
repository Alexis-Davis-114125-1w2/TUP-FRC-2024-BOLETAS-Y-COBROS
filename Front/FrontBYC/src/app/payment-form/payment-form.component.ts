import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ExpenseInterface } from '../expense-interface';
import { ClientServiceService } from '../module/client-service.service';
import { CheckoutServiceService } from '../checkout-service.service';
import { Stripe, loadStripe, StripeCardElement } from '@stripe/stripe-js';
import {CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

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
  stripe!: Stripe | null;
  cardElement!: StripeCardElement;

  expensesToPay: ExpenseInterface[] = [];
  paymentIntentId: string = "";
  clientSecret: string = "";
  error: string | undefined = '';
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

    this.stripe = await loadStripe('pk_test_51Q9KeeAo8TVLkLHfGUC1qB0HlSy0ZRit3MOTmmwUUn2BiKf5odgFYtmQHfYAlsNN2hbHCtYMJrU3DiV2OZcFl3t000qNZ2evGC');
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
      }) as StripeCardElement;
      this.cardElement.mount('#card-element');
    } else {
      console.error("Stripe no se pudo inicializar");
    }
  }


  async onSubmit() {
    if (this.paymentForm.invalid || !this.stripe) {
      return;
    }

    this.processing = true;
    this.error = '';

    try {
      // Crear el PaymentMethod primero
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
        billing_details: {
          name: this.paymentForm.get('cardHolderName')?.value,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Ahora tienes el paymentMethodId si lo necesitas
      const paymentMethodId = paymentMethod.id;

      // Crear el PaymentIntent
      const paymentIntentResult = await this.createPaymentIntent(paymentMethodId);

      // Confirmar el pago usando el clientSecret recibido
      const result = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: this.paymentForm.get('cardHolderName')?.value,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        this.paymentStatusMessage = 'Pago realizado con éxito';
        this.paymentSuccessful = true;
      }
    } catch (err: any) {
      console.error("Error en el proceso de pago:", err);
      this.error = err.message || "Error al procesar el pago";
    } finally {
      this.processing = false;
    }
  }

  async createPaymentIntent(paymentMethodId: any): Promise<any> {
    const currency = 'ars';
    const paymentMethodType = 'card';
    const cardHolderName = this.paymentForm.get('cardHolderName')?.value;
    const dni = this.paymentForm.get('dni')?.value;

    const requestBody = {
      amount: this.total,
      currency: currency,
      paymentMethodType: paymentMethodType,
      paymentMethodId: paymentMethodId, // Añade esto si lo tienes
      cardHolderName: cardHolderName,
      dni: dni,
      confirm: false,
      returnUrl: `${window.location.origin}/payment-result`,
    };

    return new Promise((resolve, reject) => {
      this.checkout.createPaymentIntent(requestBody).subscribe({
        next: response => {
          if (response && response.clientSecret) {
            this.paymentIntentId = response.paymentIntentId;
            this.clientSecret = response.clientSecret;
            console.log('Payment Intent created:', response);
            resolve(response);
          } else {
            reject(new Error('Invalid response from server'));
          }
        },
        error: err => {
          console.error('Error creating Payment Intent:', err);
          reject(err);
        }
      });
    });
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
