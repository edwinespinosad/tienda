import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pago } from '../models/pago';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PagoService {
  
  constructor(private http: HttpClient) { }

  addMethod(pago: Pago): Observable<any> {
    let params = JSON.stringify(pago);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://localhost:3700/api/pago/addMethod', params, { headers: headers });
  }
}
