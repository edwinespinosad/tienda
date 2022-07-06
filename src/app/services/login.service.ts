import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  URL_API = 'http://localhost:3700/api/login';

  constructor(private http: HttpClient) { }

  crearUser(user: User): Observable<any> {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.URL_API + '/new', params, { headers: headers });
  }

  getUser(email: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.URL_API + '/' + email, { headers: headers });
  }
}
