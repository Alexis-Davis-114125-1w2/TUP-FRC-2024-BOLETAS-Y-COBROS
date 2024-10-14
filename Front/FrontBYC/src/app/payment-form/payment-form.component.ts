import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseInterface } from '../expense-interface';
import { ClientServiceService } from '../module/client-service.service';
import { Observable } from 'rxjs';
import { CheckoutServiceService } from '../checkout-service.service';
import { Stripe, loadStripe } from '@stripe/stripe-js';



@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {

  constructor(public expenseService: ClientServiceService, public checkout: CheckoutServiceService) { }

  @Output() status = new EventEmitter<number>()
  @Input() paymentMethod: number = 0;
  @Input() billInfo: ExpenseInterface[] = [];
  total: number = 0;
  dni: string = '';

  stripe!: Stripe | null;
  cardElement!: any;
  

  expensesToPayy: ExpenseInterface[] = [];
  paymentIntentId: string = "";
  clientSecret: string = "";

 

  async ngOnInit() {
    this.expensesToPayy = this.expenseService.getSelectedExpenses();
    this.calculateTotal();

  
    this.stripe = await loadStripe('pk_test_51Q9KeeAo8TVLkLHfGUC1qB0HlSy0ZRit3MOTmmwUUn2BiKf5odgFYtmQHfYAlsNN2hbHCtYMJrU3DiV2OZcFl3t000qNZ2evGC');
    if (this.stripe) {
      const elements = this.stripe.elements();
      this.cardElement = elements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontSize: '19px',
            padding: '5px',
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            fontWeight: '400',
            lineHeight: '24px',

            '::placeholder': { color: '#aab7c4' },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        },
        hidePostalCode : true,
      });
      this.cardElement.mount('#card-element');
    } else {
      console.error("Stripe no se pudo inicializar");
    }
  }

  async onSubmit() {
    if (this.stripe) {
      const result = await this.stripe.createToken(this.cardElement);
      if (result.error) {
        console.error(result.error.message);
      } else {
        console.log(result.token);
      }
    }
  }







  calculateTotal(){
    
      this.expensesToPayy.forEach(element => {
        for (let index = 0; index < this.expensesToPayy.length; index++) {
          this.total += element.first_expiration_amount
        }
      });
  }

  

  createPaymentIntent() {
    this.checkout.createPaymentIntent(this.total).subscribe(response => {
      this.paymentIntentId = response.paymentIntentId;
      this.clientSecret = response.clientSecret;
      console.log('Payment Intent created:', response);
      alert('Payment Intent created:'+ response);
      this.confirmPayment(this.paymentIntentId)
    }, error => {
      console.error('Error creating Payment Intent:', error);
      alert('Error creating Payment Intent:'+ error);
    });
  }

  confirmPayment(intentId: string) {
    this.checkout.confirmPayment(this.paymentIntentId).subscribe(response => {
      console.log('Payment confirmed:', response);
      alert('Payment confirmed:'+ response);
    }, error => {
      console.error('Error confirming Payment:', error);
      alert('Error confirming Payment:' + error);
    });
  }

// cuando toque el boton volver tiene que limpiar la lista de facturas seleccionadas
  goBack(){
    this.expenseService.clearSelectedExpenses();
    this.sendStatus();
  }
  
  sendStatus(){
    this.status.emit(1)
  }
 
}