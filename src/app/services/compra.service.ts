import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Compra } from '../models/compra';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http: HttpClient) { }

  addPurchase(compra: Compra): Observable<any> {
    let params = JSON.stringify(compra);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://localhost:3700/api/compras/addCompra', params, { headers: headers });
  }

  getCompras(correo: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let link = 'http://localhost:3700/api/compras/getCompras/' + correo;
    console.log(link);
    return this.http.get(link, { headers: headers });
  }

  getAllCompras(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let link = 'http://localhost:3700/api/compras/getCompras';
    console.log(link);
    return this.http.get(link, { headers: headers });
  }
}
