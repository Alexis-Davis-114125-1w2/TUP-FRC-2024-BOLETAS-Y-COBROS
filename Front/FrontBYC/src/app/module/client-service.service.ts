import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseInterface } from '../expense-interface';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  public i = 1;
  private ApiBaseUrl = "http://localhost:8080/api/expenses";
  constructor(private http: HttpClient) {

  }


  getExpenseByOwner(ownerId: number): Observable<ExpenseInterface[]> {
    return this.http.get<ExpenseInterface[]>(`${this.ApiBaseUrl}/all?owner_id=${ownerId}`);
  }



  selectedExpenses: ExpenseInterface[] = []

  addSelectedExpense(expense: ExpenseInterface){
    this.selectedExpenses.push(expense)
  }


  getSelectedExpenses() {
    return this.selectedExpenses;
  }


  removeSelectedExpense(id: number){
    this.selectedExpenses = this.selectedExpenses.filter(expense => expense.id !== id)
  }


}
