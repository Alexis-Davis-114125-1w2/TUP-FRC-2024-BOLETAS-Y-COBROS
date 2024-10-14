import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseCardComponent } from "../expense-card/expense-card.component";
import { ClientServiceService } from '../module/client-service.service';
import { ExpenseInterface } from '../expense-interface';
import { Observable } from 'rxjs';
import { HeaderComponent } from "../header/header.component";




@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, ExpenseCardComponent, HeaderComponent],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
})
export class ListadoComponent implements OnInit {
  
  constructor(private service: ClientServiceService) {
    
  }
  
  unpaidExpenses$!: Observable<ExpenseInterface[]>;
  paidExpenses: ExpenseInterface[] = [];
  filtroDesde: string = '';
  filtroHasta: string = '';
  filtroEstado: string = '';
  total: number = 0;
  ownerId: number = 1;
  @Output() status = new EventEmitter<number>() ;

  

  realizarPago(expense: ExpenseInterface | null = null) {
    let paymentData: any;

    if (expense) {
        paymentData = {
            description: `Pago de boleta ${expense.id}`,
            amount: expense.first_expiration_amount,
            expenseId: expense.id,
            period: expense.period,
            ownerId: this.ownerId
        };
    } else {
        if (this.total > 0) {
            paymentData = {
                description: 'Pago de todas las boletas seleccionadas',
                amount: this.total,
                ownerId: this.ownerId
            };
        } else {
            alert('No hay boletas seleccionadas para pagar.');
            return;
        }
    }

    const observer = {
        next: (preferenceId: string) => {
            const mercadoPagoUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
            window.open(mercadoPagoUrl, '_blank');
        },
        error: (error: any) => {
            console.error('Error al crear la solicitud de pago:', error);
            alert('Hubo un error al procesar el pago. Inténtalo de nuevo.');
        }
    };

    this.service.createPaymentRequest(paymentData).subscribe(observer);
}

ngOnInit() {
    this.getExpensesByOwner();
}

changeStatus(item: ExpenseInterface) {
    if (item.status === 'Pendiente') {
        item.status = 'Pago';
        item.paymentDate = new Date(); 
    }
}
  getExpensesByOwner() {
    this.service.getExpenseByOwner(this.ownerId).subscribe((expenses: ExpenseInterface[]) => {
      this.paidExpenses = expenses.filter(expense => expense.status === 'Pago');
      this.unpaidExpenses$ = new Observable(observer => {
        observer.next(expenses.filter(expense => expense.status === 'Pendiente'));
      });
    });
  }
  
  applyFilters() {
    this.service.getExpenseByOwner(this.ownerId).subscribe((expenses: ExpenseInterface[]) => {
      let filteredExpenses = expenses.filter(expense => expense.status === 'Pago'); // Filtrar solo las boletas pagadas
  
      if (this.filtroDesde) {
        const filtroDesdeDate = new Date(this.filtroDesde);
        filteredExpenses = filteredExpenses.filter(expense => new Date(expense.issueDate) >= filtroDesdeDate);
      }
  
      if (this.filtroHasta) {
        const filtroHastaDate = new Date(this.filtroHasta);
        filteredExpenses = filteredExpenses.filter(expense => new Date(expense.issueDate) <= filtroHastaDate);
      }
  
      if (this.filtroEstado) {
        filteredExpenses = filteredExpenses.filter(expense => expense.status === this.filtroEstado);
      }
  
      this.paidExpenses = filteredExpenses;
    });
  }

  recieveAmount(amount: number) {
    this.total += amount;
  }
  
  changeStatusPage(num: number){
    this.status.emit(num)
  }



  openPdf(paymentId: string) {
    this.service.getPdfByPaymentId(paymentId).subscribe((pdf: Blob) => {
      const url = window.URL.createObjectURL(pdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo_${paymentId}.pdf`; 
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar el PDF:', error);
    });
  }
  
  updateExpenseStatus(expenseId: number, newStatus: string) {
    const paymentDate = newStatus === 'Pago' ? this.localDate : null;
    this.service.updateExpenseStatus(expenseId, newStatus, paymentDate).subscribe(() => {
      this.getExpensesByOwner();  
    });
  }
  get localDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];  
  }
  getReceiptByPaymentId(paymentId: string) {
    this.service.getReceipt(paymentId).subscribe(receipt => {
      console.log('Recibo :', receipt);
    }, error => {
      console.error('Error fetching Recibo :', error);
    });
  }
}
