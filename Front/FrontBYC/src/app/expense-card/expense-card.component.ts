import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientServiceService } from '../module/client-service.service';
import { ExpenseInterface } from '../expense-interface';

@Component({
  selector: 'app-expense-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-card.component.html',
  styleUrl: './expense-card.component.css'
})
export class ExpenseCardComponent {

  @Input() expense!: ExpenseInterface;

  overdue: boolean = false;
  status: boolean = false;
  periodo: string = "";


  constructor(public expenses: ClientServiceService){}


  ngOnInit() {
    // SI LA FECHA DE VENCIMIENTO ES MENOR A LA FECHA ACTUAL, LA BOLETA ESTA VENCIDA
    if (this.expense.first_expiration_date !== null && this.expense.first_expiration_date !== undefined && this.expense.first_expiration_date < new Date().toISOString()) {
      this.overdue = true;
    }

    console.log(this.expense)

  
  }


  // METODO QUE TE CALCULA EL PERIODO DE LA BOLETA SEGUN LA FECHA DE VENCIMIENTO




  // METODO QUE LE PEGA AL ENDPOINT PARA ABRIR EL PDF

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




  // METODO QUE ENVIA EL MONTO DE LA BOLETA AL COMPONENT PADRE

   selectExpense() {
    if (this.status === false) {
      this.expenses.addSelectedExpense(this.expense);
    //  console.log(this.expenses.getSelectedExpenses());
      
      this.status = true;
    } else {
      this.expenses.removeSelectedExpense( this.expense.id);
     // console.log(this.expenses.getSelectedExpenses());
      this.status = false;
    }
  }





}
