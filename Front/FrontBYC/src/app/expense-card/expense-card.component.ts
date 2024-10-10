import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-card.component.html',
  styleUrl: './expense-card.component.css'
})
export class ExpenseCardComponent {

  @Input() billAmount: number = 0;
  @Input() billDueDate: string = "";
  @Input() billId: number = 0;
  @Output() sendAmount = new EventEmitter<number>();

  overdue: boolean = false;
  status: boolean = false;
  periodo: string = "";


  ngOnInit() {
    this.periodo = this.calculatePeriod();

    // SI LA FECHA DE VENCIMIENTO ES MENOR A LA FECHA ACTUAL, LA BOLETA ESTA VENCIDA
    if (this.billDueDate !== null && this.billDueDate !== undefined && this.billDueDate < new Date().toISOString()) {
      this.overdue = true;
    }
  }


  // METODO QUE TE CALCULA EL PERIODO DE LA BOLETA SEGUN LA FECHA DE VENCIMIENTO

  calculatePeriod(): string {
    let date = new Date(this.billDueDate);
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${month}/${year}`;
  }



  // METODO QUE LE PEGA AL ENDPOINT PARA ABRIR EL PDF

  async openPdf(id: number) {
    try {
      const response = await fetch(`http://localhost:8080/api/bill/pdf/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error('There was an error opening the PDF:', error);
    }
  }




  // METODO QUE ENVIA EL MONTO DE LA BOLETA AL COMPONENT PADRE

  newAmount() {

    if (this.status === false) {
      this.sendAmount.emit(this.billAmount);
      this.status = true;
    }
    else {
      this.sendAmount.emit(-this.billAmount);
      this.status = false;
    }
  }





}
