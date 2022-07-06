import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Carrito } from '../../models/carrito';
import { Pago } from 'src/app/models/pago';
import { PagoService } from 'src/app/services/pago.service';
import { CompraService } from 'src/app/services/compra.service';
import { Compra } from 'src/app/models/compra';
import { Router } from '@angular/router';

import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';

declare var paypal: { Buttons: (arg0: { createOrder: (data: any, actions: any) => any; onApprove: (data: any, actions: any) => Promise<void>; onError: (err: any) => void; }) => { (): any; new(): any; render: { (arg0: any): void; new(): any; }; }; };


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  providers: [CarritoService, PagoService, CompraService]
})
export class CarritoComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef | undefined;
  public payPalConfig?: IPayPalConfig;

  public cart: Carrito[];
  public pago: Pago;
  public compra: Compra;
  public total: number;
  public subtotal: number;
  public envio: number;
  public fecha: Date;


  constructor(public carritoService: CarritoService, public pagoService: PagoService, public compraService: CompraService, public router: Router) {
    this.cart = [];
    this.total = 0;
    this.subtotal = 0;
    this.envio = 0;
    this.fecha = new Date(Date.now());
    this.pago = new Pago("", "", "", "", "", "", 0, "", "", "", "");
    this.compra = new Compra("", "", "", 0, 0, "", "", this.fecha, 0, localStorage.getItem("compraId")!);
  }

  producto = {
    descripcion: 'producto en venta',
    precio: 599.99,
    img: 'imagen de tu producto'
  }
  title = 'angular-paypal-payment';

  ngOnInit(): void {
    this.getCarrito();
    this.initConfig();
    // paypal.Buttons({
    //   createOrder: (data, actions) => {
    //     return actions.order.create({
    //       purchase_units: [{
    //         description: this.producto.descripcion,
    //         amount: {
    //           currency_code: 'MXN',
    //           value: this.producto.precio
    //         }
    //       }]
    //     });
    //   },
    //   onApprove: async (data, actions) => {
    //     const order = await actions.order.capture();
    //     console.log(order);
    //   },
    //   onError: err => {
    //     console.log(err);
    //   }
    // }).render(this.paypalElement!.nativeElement);

  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'MXN',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'MXN',
            value: this.producto.precio.toString(),
          }
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      }
    };
  }

  onSubmit(form: any) {
    this.pago.total = this.total;
    this.pago.usuarioId = localStorage.getItem('usuarioCart')!;
    console.log(this.pago);
    this.pagoService.addMethod(this.pago).subscribe((res) => {

      for (let index = 0; index < this.cart.length; index++) {
        this.compra.usuarioId = localStorage.getItem('usuarioCart')!;
        this.compra.pagoId = localStorage.getItem('usuarioCart')!;
        this.compra.articuloId = this.cart[index]['articuloId'];
        this.compra.cantidad = this.cart[index]['cantidad'];
        this.compra.precio = this.cart[index]['precio'];
        this.compra.nombreArticulo = this.cart[index]['nombreArticulo'];
        this.compra.imagen = this.cart[index]['imagen'];
        this.compra.fecha = this.fecha;
        this.compra.total = this.total;

        this.compraService.addPurchase(this.compra).subscribe((res) => {
          console.log(res);
        },
          err => {
            console.log(err);
          });
      }

      console.log(res);

      for (let index = 0; index < this.cart.length; index++) {
        console.log(this.cart[index]['articuloId']);
        console.log(this.pago.usuarioId);
        this.carritoService.deleteCarrito(this.pago.usuarioId).subscribe((res) => {
          console.log(res);
        }, error => {
          console.log(error);
        })
      }

      localStorage.setItem('purchaseCompleted', 'true');
      this.router.navigate(['/login']);
    }, error => {
      console.log(error);
    });
  }

  changeCantidad(id: number) {
    console.log("Cambiando cantidad");
    var input = "#cantidad" + id;
    const selectElement = document.querySelector(input) as HTMLSelectElement || null;
    const s = document.getElementById(input);
    if (selectElement != null) {
      console.log(selectElement.value);
      let cantidad = parseInt(selectElement.value);
      let data = {
        cantidad: cantidad
      }
      this.carritoService.updateCarrito(id.toString(), data).subscribe((res) => {
        console.log(res);
        this.getCarrito();
      }, err => {
        console.log(err);
      })
    }
  }

  removeArticulo(id: string) {
    this.carritoService.deleteArticulo(id).subscribe((res) => {
      console.log(res);

      this.getCarrito();

    }, err => {
      console.log(err);
    })
  }

  comprar() {
    if (localStorage.getItem('identity') === null) {
      const alert = document.createElement('div');
      alert.classList.add('alert');
      alert.classList.add('alert-warning');
      alert.classList.add('alert-dismissible')
      alert.classList.add('fade');
      alert.classList.add('show');
      alert.innerHTML = `
                    <strong>You must be logged in to buy!</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    `;
      document.getElementsByClassName('articulos')[0].append(alert);
    } else {





      // this.router.navigate(['/pago']);
    }
  }
  getCarrito() {
    console.log(localStorage.getItem('usuarioId'));
    this.carritoService.getCarrito().subscribe((res) => {
      this.subtotal = 0;
      this.cart = res;
      console.log(this.cart);
      if (this.cart.length > 0) {
        for (let index = 0; index < this.cart.length; index++) {
          this.subtotal = this.subtotal + this.cart[index]['precio'] * this.cart[index]['cantidad'];
          console.log(this.cart[index]['precio']);
          console.log(this.total);
        }
        if (this.subtotal >= 299) {
          this.envio = 0;
          this.total = this.subtotal + this.envio;
        } else {
          this.envio = 100;
          this.total = this.subtotal + this.envio;
        }
        this.producto.precio = this.total;
      }
    },
      err => {
        console.log(err);
      });
  }

}
