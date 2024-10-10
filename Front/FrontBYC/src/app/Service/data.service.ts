import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoComponent } from '../listado/listado.component';
import { BoletaInterface } from '../listado/boleta-interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public i = 1;
  private ApiNuestraPorId = "http://localhost:8080/api/expenses/{ownerId}/ownerId?owner_id=" + this.i;
  private TraerAllBoletas = "http://localhost:8080/api/expenses/all";
  private ApiBaseUrl = "http://localhost:8080/api/expenses/";
  constructor(private http : HttpClient) {
    
   }
 
  
  TraerBoletasPorId(ownerId: number): Observable<BoletaInterface[]> {
    return this.http.get<BoletaInterface[]>(`${this.ApiBaseUrl}${ownerId}/ownerId?owner_id=${ownerId}`);
  }
  TraerTODASboletas(): Observable<any[]> {
    return this.http.get<BoletaInterface[]>(`${this.ApiBaseUrl}all`);
  }

  TraerPorFiltro(status : string): Observable<BoletaInterface[]> {
    return this.http.get<BoletaInterface[]>(`${this.ApiBaseUrl}${status}/status`);
  }

}
