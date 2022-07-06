import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Compra } from 'src/app/models/compra';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { CompraService } from 'src/app/services/compra.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService, CarritoService, CompraService]
})
export class LoginComponent implements OnInit {
  public user: User;
  public compras: Compra[];
  public identity: string | null;
  public error: string | null;
  public idCompras: Array<string | number> = new Array();
public admin: boolean = false;
  constructor(public loginService: LoginService, private router: Router, public carritoService: CarritoService, public compraService: CompraService) {
    this.user = new User("", "", "", "");
    this.compras = [];
    this.error = null;
    this.identity = null;
  }

  ngOnInit(): void {
    this.identity = localStorage.getItem('usuarioCart');
    this.error = localStorage.getItem('loginFirst');
    this.getCompras();
    if(window.localStorage.getItem('usuarioCart') === "admin@admin.com") this.admin = true;
  }

  getCompras() {
    this.compraService.getCompras(this.identity!).subscribe(
      response => {
        this.compras = response;
        console.log(this.idCompras);
        console.log(response['compraId']);
        for (let index = 0; index < this.compras.length; index++) {

          var Compras = (this.compras[index]['compraId']);
          console.log(Compras);
          this.idCompras.push(Compras);
          this.idCompras = this.idCompras.filter((item, i) => {
            return this.idCompras.indexOf(item) === i;
          });
        }
        console.log(this.idCompras);

        console.log(response);
        this.compras = response;
      }
    );
  }

  signOut(email: string) {
    console.log("Sign out");
    localStorage.removeItem('identity');
    localStorage.removeItem('usuarioCart');
    this.router.navigate(['/home']).then(() => {window.location.reload();})
  }

  onSubmitCrear(form: any) {
    console.log("Submit");
    this.loginService.crearUser(this.user).subscribe(
      response => {
        console.log(response);
        const alert = document.createElement('div');
        alert.classList.add('alert');
        alert.classList.add('alert-success');
        alert.classList.add('alert-dismissible')
        alert.classList.add('fade');
        alert.classList.add('show');
        alert.innerHTML = `
          <strong>Usuario creado correctamente!</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          `;
        document.getElementsByClassName('formCrear')[0].prepend(alert);

        window.location.reload();
      }, error => {
        console.log(error);
      }
    );
  }

  onSubmit(form: any, email: string, password: string) {
    console.log("Submit");
    this.loginService.getUser(email).subscribe(
      response => {
        if (response === null) {
          const alert = document.createElement('div');
          alert.classList.add('alert');
          alert.classList.add('alert-danger');
          alert.classList.add('alert-dismissible')
          alert.classList.add('fade');
          alert.classList.add('show');
          alert.innerHTML = `
          <strong>Tu correo no esta registrado aun</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          `;
          document.getElementsByClassName('form')[0].prepend(alert);

        } else {
          console.log(response);
          if (response['email'] === email && response['password'] === password) {
            localStorage.setItem('identity', JSON.stringify(response['email']));
            localStorage.setItem('usuarioCart', email);
            localStorage.removeItem('loginFirst');
            // go to home and reload
            this.router.navigate(['/home']).then(() => { window.location.reload(); })

          } else {
            console.log("Error cuenta no encontrado");
            const alert = document.createElement('div');
            alert.classList.add('alert');
            alert.classList.add('alert-danger');
            alert.classList.add('alert-dismissible')
            alert.classList.add('fade');
            alert.classList.add('show');
            alert.innerHTML = `
                      <strong>Correo o contraseña invalida</strong>
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                      `;
            document.getElementsByClassName('form')[0].prepend(alert);
          }
        }
      }, error => {
        console.log(error);
      });
  }


}
