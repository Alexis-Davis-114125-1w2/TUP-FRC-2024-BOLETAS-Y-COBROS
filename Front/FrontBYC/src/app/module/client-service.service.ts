import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ExpenseInterface } from '../expense-interface';

declare var MercadoPago: any;
@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  public i = 1;
  private ApiBaseUrl = "http://localhost:8080/api/expenses/";
  private MercadoPagoApiUrl = "http://localhost:8081/api/payments/mp";
  private MercadoPagoIntento = "https://large-dove-unbiased.ngrok-free.app/api/payments/mp"
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {

  }
  getReceipt(paymentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/receipts/${paymentId}`);
  }
  
  createPaymentRequest(paymentData: any): Observable<string> {
    return this.http.post(this.MercadoPagoIntento, paymentData, { responseType: 'text' }).pipe(
      map(response => {
        try {
          const jsonResponse = JSON.parse(response);
          if (jsonResponse && jsonResponse.preferenceId) {
            return jsonResponse.preferenceId;
          } else {
            throw new Error('La respuesta del servidor no contiene un preferenceId válido');
          }
        } catch (error) {
          return response.trim();
        }
      }),
      catchError(this.handleError)
    );
  }

  updateExpenseStatus(expenseId: number, status: string, paymentDate: string | null): Observable<any> {
    return this.http.put(`${this.ApiBaseUrl}${expenseId}/status`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  initMercadoPago(): void {
    const script = document.createElement('script');
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => {
      new MercadoPago('APP_USR-d68ed33a-56aa-45be-ba50-bbe017333a6d', {
        locale: 'es-AR'
      });
    };
    document.body.appendChild(script);
  }

  createCheckoutButton(preferenceId: string): void {
    const mp = new MercadoPago('APP_USR-d68ed33a-56aa-45be-ba50-bbe017333a6d', {
      locale: 'es-AR'
    });
    const bricksBuilder = mp.bricks();
    bricksBuilder.create("wallet", "wallet_container", {
      initialization: {
        preferenceId: preferenceId,
      },
    });
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error ${error.status}, ` +
        `mensaje: ${error.error.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  getExpenseByOwner(ownerId: number): Observable<ExpenseInterface[]> {
    return this.http.get<ExpenseInterface[]>(`${this.ApiBaseUrl}all?owner_id=${ownerId}`);
  }
  
  /*createPaymentRequest(paymentData: any): Observable<string> {
    return this.http.post<string>(this.MercadoPagoApiUrl, paymentData);
  }*/
  getPdfByPaymentId(paymentId: string): Observable<Blob> {
  return this.http.get(`http://localhost:8080/api/bill/pdf/payment/${paymentId}`, { responseType: 'blob' });
}
  
  getAllExpenses(ownerId: number): Observable<ExpenseInterface[]> {
    return this.http.get<ExpenseInterface[]>(`${this.ApiBaseUrl}all?owner_id=${ownerId}`).pipe(
      catchError(this.handleError)
    );
  }
  
}
