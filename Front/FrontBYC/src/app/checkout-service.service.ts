import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {
  constructor(private http: HttpClient) { }
  private readonly apiUrl = "http://localhost:8020";

  createPaymentIntent(requestBody: {
    amount: number;
    cardHolderName: any;
    currency: string;
    paymentMethodType: string;
    dni: any
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/create-payment-intent`, requestBody, { headers });
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-payment/${paymentIntentId}`, {});
  }
  generateReceipt(paymentIntentId: string): Observable<ArrayBuffer> {
    return this.http.get(`${this.apiUrl}/generate-receipt/${paymentIntentId}`, {
      responseType: 'arraybuffer'
    });
  }
}
