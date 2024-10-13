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


  // Arreglos
  expenses$!: Observable<ExpenseInterface[]>;
  selectedExpenses: ExpenseInterface[] = [];
  paidExpenses: ExpenseInterface[] = [];
  unpaidExpenses: ExpenseInterface[] = [];

  // Filtros
  filtroDesde: string = '';
  filtroHasta: string = '';
  filtroEstado: string = '';

  // Variables
  total: number = 0;
  ownerId: number = 3;
  @Output() status = new EventEmitter<number>() ;

  ngOnInit() {
    this.getExpensesByOwner();
    this.selectedExpenses = this.service.getSelectedExpenses();
    console.log(this.selectedExpenses)
  }


  getExpensesByOwner() {
    this.expenses$ = this.service.getExpenseByOwner(this.ownerId);
    this.expenses$.subscribe(expenses => {
      this.unpaidExpenses = expenses.filter(expense => expense.status !== "Pago");
      this.paidExpenses = expenses.filter(expense => expense.status === "Pago");
    });
  }


 
  calculateTotal() {
    this.total = this.selectedExpenses.reduce((sum, expense) => sum + expense.first_expiration_amount, 0);

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
