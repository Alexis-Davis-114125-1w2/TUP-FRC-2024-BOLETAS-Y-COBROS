import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { map, Observable } from 'rxjs';
import { ExpenseInterface } from './expense-interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {
  constructor(private http: HttpClient) { }
  private readonly apiUrl = "http://localhost:8020";




  createPaymentIntent(amount: number ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { amount: amount };
    return this.http.post(`${this.apiUrl}/create-payment-intent`, body, { headers });
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirm-payment/${paymentIntentId}`);
  }

  cancelPayment(paymentIntentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cancel-payment/${paymentIntentId}`);
  }



}
