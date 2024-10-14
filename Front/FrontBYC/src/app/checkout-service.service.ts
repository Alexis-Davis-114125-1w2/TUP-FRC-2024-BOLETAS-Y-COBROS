import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {
  private readonly apiUrl = "http://localhost:8020";

  constructor(private http: HttpClient) {}

  createPaymentIntent(requestBody: { amount: number; currency: string; cardHolderName: string; dni: string; }): Observable<{ clientSecret: string; paymentIntentId: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ clientSecret: string; paymentIntentId: string }>(
      `${this.apiUrl}/create-payment-intent`,
      requestBody,
      { headers }
    ).pipe(
      catchError(error => {
        console.error("Error en la creación del PaymentIntent:", error);
        return of({ clientSecret: '', paymentIntentId: '' }); // Valor por defecto en caso de error
      })
    );
  }

  generateReceipt(paymentIntentId: string): Observable<ArrayBuffer> {
    return this.http.get(`${this.apiUrl}/generate-receipt/${paymentIntentId}`, {
      responseType: 'arraybuffer'
    });
  }
}
