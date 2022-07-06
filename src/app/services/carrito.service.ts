import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Carrito } from '../models/carrito';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  URL_API = 'http://localhost:3700/api/carrito';

  constructor(private http: HttpClient) { }

  addACarrito(carrito: Carrito): Observable<any> {
    let params = JSON.stringify(carrito);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log(params);
    return this.http.post(this.URL_API + '/add', params, { headers: headers });
  }

  getCarrito(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let user = localStorage.getItem('usuarioCart') || "";
    let link = this.URL_API + '/' + user;
    return this.http.get(link, { headers: headers });
  }

  updateCarrito(id: string, data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.URL_API + '/' + id, data, { headers: headers });
  }

  deleteArticulo(id: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let link = this.URL_API + "/" + id;
    console.log(link);
    return this.http.delete(link, { headers: headers });
  }

  deleteCarrito(id: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let link = this.URL_API + "/deleteCarrito/" + id;
    console.log(link);
    return this.http.delete(link, { headers: headers });
  }
}
