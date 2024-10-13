import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseCardComponent } from "../expense-card/expense-card.component";
import { ClientServiceService } from '../module/client-service.service';
import { ExpenseInterface } from '../expense-interface';
import { Observable } from 'rxjs';
import { HeaderComponent } from "../header/header.component";
import { CheckoutServiceService } from '../checkout-service.service';
import { PaymentFormComponent } from "../payment-form/payment-form.component";



@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, ExpenseCardComponent, HeaderComponent, PaymentFormComponent],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
})
export class ListadoComponent implements OnInit {

  constructor(private service: ClientServiceService, private checkoutService: CheckoutServiceService) {

  }

  expenses$!: Observable<ExpenseInterface[]>;
  paidExpenses: ExpenseInterface[] = [];
  unpaidExpenses: ExpenseInterface[] = [];
  selectedExpenses: ExpenseInterface[] = [];
  filtroDesde: string = '';
  filtroHasta: string = '';
  filtroEstado: string = '';
  total: number = 0;
  ownerId: number = 3;
  @Output() status = new EventEmitter<number>() ;

  ngOnInit() {
    this.getExpensesByOwner();

    this.selectedExpenses.forEach(expense => {
      this.service.addSelectedExpense(expense)
    })


  }


  getExpensesByOwner() {
    this.expenses$ = this.service.getExpenseByOwner(this.ownerId);
    this.expenses$.subscribe(expenses => {
      this.unpaidExpenses = expenses.filter(expense => expense.status !== "Pago");
      this.paidExpenses = expenses.filter(expense => expense.status === "Pago");
    });
  }


 
  recieveAmount(amount: number) {
    this.total += amount;
  }

  recieveId(id: number) {
    const expense = this.unpaidExpenses.find(expense => expense.id === id);
    if (expense) {
      const index = this.selectedExpenses.findIndex(exp => exp.id === id);
      if (index > -1) {
        this.selectedExpenses.splice(index, 1); 
      } else {
        this.selectedExpenses.push(expense);
       
      }

      console.log(this.selectedExpenses);
    } else {
      console.error(`Expense with id ${id} not found`);
    }
  }




  async openPdf(id: number) {
    try {
      const response = await fetch(`http://localhost:8080/api/expenses/pdf/${id}`);
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



  changeStatusPage(num: number){
    this.status.emit(num)
  }



}
