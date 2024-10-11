import { Component, OnInit } from '@angular/core';
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
  ownerId: number = 3;

  ngOnInit() {
    this.getExpensesByOwner();
  }


  getExpensesByOwner() {
    this.unpaidExpenses$ = this.service.getExpenseByOwner(this.ownerId)
  }
  

  recieveAmount(amount: number) {
    this.total += amount;
  }

 


  async openPdf(id: number) {
    try {
      const response = await fetch(`http://localhost:8080/api/bill/pdf/${id}`);
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


}
