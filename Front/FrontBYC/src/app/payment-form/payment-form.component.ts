import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseInterface } from '../expense-interface';
import { ClientServiceService } from '../module/client-service.service';
import { Observable } from 'rxjs';
import { CheckoutServiceService } from '../checkout-service.service';

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
  total: number = 0;
  dni: string = '';
  
  expensesToPay$!: Observable<ExpenseInterface[]>;
  expensesToPayy: ExpenseInterface[] = [];
  paymentIntentId: string = "";
  clientSecret: string = "";

  ngOnInit(): void {
    this.expensesToPay$ = this.expenseService.getExpenseByOwner(3);
    this.expensesToPay$.subscribe(expenses => {
      this.expensesToPayy = expenses;
      this.calculateTotal();
    });
    this.calculateTotal;
  }

  calculateTotal(){
    this.expensesToPay$.forEach(element => {
      this.expensesToPayy.forEach(element => {
        for (let index = 0; index < this.expensesToPayy.length; index++) {
          this.total += element.first_expiration_amount
        }
      });
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

  
  sendStatus(){
    this.status.emit(1)
  }
 
}