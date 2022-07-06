import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Articulo } from 'src/app/models/articulo';
import { Carrito } from 'src/app/models/carrito';
import { ArticulosService } from '../../services/articulos.service';
import * as uuid from 'uuid';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.css'],
  providers: [ArticulosService, CarritoService]
})
export class VistaComponent implements OnInit {
  id: string;
  public articulo: Articulo;
  public cart: Carrito;
  public compraId: string;

  constructor(public articulosService: ArticulosService, public route: ActivatedRoute, public carritoService: CarritoService) {
    this.id = this.route.snapshot.params['id'];
    this.articulo = new Articulo("", 0, "", "");
    this.cart = new Carrito("", "", 0, 0, "", "", "");
    this.compraId = "";
  }

  ngOnInit(): void {
    this.getArticulo(this.id);

  }


  addACarrito(id: string, nombre: string, precio: number, imagen: string) {
    console.log(localStorage.getItem("usuarioCart"))
    if (localStorage.getItem("usuarioCart") === null) {
      const alert = document.createElement('div');
      alert.classList.add('alert');
      alert.classList.add('alert-danger');
      alert.classList.add('alert-dismissible')
      alert.classList.add('fade');
      alert.classList.add('show');
      alert.innerHTML = `
                <strong>Inicia sesion primero!</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
      document.getElementsByClassName('articulo')[0].prepend(alert);
    } else {
      if (localStorage.getItem("compraId") == null) {
        this.compraId = uuid.v4();
        console.log(this.compraId);
        localStorage.setItem("compraId", this.compraId);
      }

      const input = document.getElementById("quantity") as HTMLInputElement | null;
      if (input) {

        var cantidad = parseInt(input?.value);
        console.log("Cantidad: " + cantidad + " " + typeof (cantidad));
        let usuarioId = localStorage.getItem("usuarioCart") || "";

        this.cart = new Carrito(usuarioId, id, cantidad, precio, nombre, imagen, localStorage.getItem("compraId")!);

        this.carritoService.addACarrito(this.cart).subscribe(
          response => {
            console.log(response);
            const alert = document.createElement('div');
            alert.classList.add('alert');
            alert.classList.add('alert-success');
            alert.classList.add('alert-dismissible')
            alert.classList.add('fade');
            alert.classList.add('show');
            alert.innerHTML = `
                      <strong>Articulo agregado a tu carrito!</strong>
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                      `;
            document.getElementsByClassName('articulo')[0].prepend(alert);
          },
          error => {
            console.log(error);
            const alert = document.createElement('div');
            alert.classList.add('alert');
            alert.classList.add('alert-danger');
            alert.classList.add('alert-dismissible')
            alert.classList.add('fade');
            alert.classList.add('show');
            alert.innerHTML = `
                      <strong>Error al agregar articulo!</strong>
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                      `;
            document.getElementsByClassName('articulo')[0].prepend(alert);
          }
        );
      }
      console.log(id);
    }



  }

  getArticulo(id: string) {
    this.articulosService.getArticulo(id).subscribe((res) => {
      this.articulo = res;
    }, err => console.log(err));
  }

}
