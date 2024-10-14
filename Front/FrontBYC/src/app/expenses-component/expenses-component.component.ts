import { Component } from '@angular/core';
import { ClientServiceService } from '../module/client-service.service'; 
import { ExpenseInterface } from '../expense-interface'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses-component.component.html'
})
export class ExpensesComponent {
  unpaidExpenses$!: Observable<ExpenseInterface[]>;
  total: number = 0;
  ownerId: number = 3;
  
  constructor(private clientService: ClientServiceService) {
    this.loadUnpaidExpenses();
  }

  loadUnpaidExpenses() {
    this.unpaidExpenses$ = this.clientService.getExpenseByOwner(this.ownerId);
  }

  /*pagarBoleta(expense: ExpenseInterface) {
    const paymentData = {
      description: `Pago de boleta ${expense.id}`,
      amount: expense.first_expiration_amount,
      expenseId: expense.id,
      
      period: expense.period,
      ownerId: this.ownerId
    };

    this.clientService.createPaymentRequest(paymentData).subscribe(preferenceId => {
      
      const mercadoPagoUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
      window.location.href = mercadoPagoUrl; 
    });
  }*/
}