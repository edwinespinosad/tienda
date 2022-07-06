import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Articulo } from '../models/articulo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  URL_API = 'http://localhost:3700/api/articulos';
  articulos: Articulo[] = [];
  constructor(private http: HttpClient) { }

  getArticulos() {
    return this.http.get<Articulo[]>(this.URL_API);
  }

  getArticulo(id: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log(this.URL_API + '/' + id);
    return this.http.get<Articulo>(this.URL_API + '/' + id, { headers });
  }

  addArticulo(articulo: Articulo): Observable<any> {
    let params = JSON.stringify(articulo);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.URL_API + '/addArticulo', params, { headers });
  }

  deleteArticulo(id: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(this.URL_API + '/delete/' + id, { headers: headers });
  }

  updateArticulo(id: string, data: any) {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.URL_API + '/update/' + id, params, { headers: headers });
  }
}
