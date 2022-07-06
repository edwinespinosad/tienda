import { Component, OnInit } from '@angular/core';
import { Carrito } from 'src/app/models/carrito';
import { Articulo } from '../../models/articulo';
import { ArticulosService } from '../../services/articulos.service';
import { CarritoService } from '../../services/carrito.service'
import * as uuid from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ArticulosService, CarritoService, UploadService]
})
export class HomeComponent implements OnInit {
  public cart: Carrito;
  public compraId: string;
  public admin: boolean = false;
  public articuloI: Articulo;
  public filesToUpload: Array<File>;

  constructor(public articuloService: ArticulosService, public carritoService: CarritoService, private route: ActivatedRoute, private router: Router, public uploadService: UploadService) {
    this.compraId = "";
    this.cart = new Carrito("", "", 0, 0, "", "", "");
    this.articuloI = new Articulo("", 0, "", "");
    this.filesToUpload = [];

  }

  ngOnInit(): void {
    this.getArticulos();
    if (window.localStorage.getItem('usuarioCart') === "admin@admin.com") {
      console.log("\n ADMIN")
      this.admin = true;
    }
  }

  onSubmit(form: any) {
    console.log(this.filesToUpload);
    this.articuloService.updateArticulo(this.articuloI._id!, this.articuloI).subscribe(
      response => {
        console.log(response);
        if (this.filesToUpload.length > 0) {
          this.uploadService.makeFileRequest("http://localhost:3700/api/articulos/upload-image/" + this.articuloI._id, [], this.filesToUpload, 'imagen').then((result: any) => {
            console.log(result);
            this.articuloI.imagen = result.imagen;
            this.router.navigate(['/home']).then(() => { window.location.reload(); })
          });
        } else {
          this.router.navigate(['/home']).then(() => { window.location.reload(); })
        }
      }, error => {
        console.log(error);
      });

  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }
  getArticulos() {
    console.log('getArticulos');
    this.articuloService.getArticulos().subscribe((res) => {
      this.articuloService.articulos = res;
    });
  }

  getArticulo(id: string) {
    console.log("getting articulo")
    this.articuloService.getArticulo(id).subscribe((res) => {
      this.articuloI = res;
      console.log(this.articuloI)
    }, err => console.log(err));
  }

  deleteArticulo(id: string) {
    this.articuloService.deleteArticulo(id).subscribe((res) => {
      this.ngOnInit();
      console.log('deleteArticulo');
    }, err => console.log(err));
  }

  addACarrito(id: string, nombre: string, precio: number, imagen: string) {
    var cantidad = parseInt("1");
    console.log("Cantidad: " + cantidad + " " + typeof (cantidad));
    let usuarioId = localStorage.getItem("usuarioCart") || "";
    if (localStorage.getItem("compraId") == null) {
      this.compraId = uuid.v4();
      console.log(this.compraId);
      localStorage.setItem("compraId", this.compraId);
    }

    if (localStorage.getItem('usuarioCart') !== null) {
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
                    <strong>Articulo agregado a carrito!</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    `;
          document.getElementsByClassName('container')[0].prepend(alert);

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
                    <strong>Error al agregar el articulo!</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    `;
          document.getElementsByClassName('book')[0].prepend(alert);
        }
      );
      // }
      console.log(id);
    } else {
      this.router.navigate(['/login']);
      localStorage.setItem('loginFirst', 'Debes iniciar sesion primero!');
    }
  }
}
