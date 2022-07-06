import { Component, OnInit } from '@angular/core';
import { Articulo } from '../../models/articulo';
import { ArticulosService } from '../../services/articulos.service';
import { UploadService } from '../../services/upload.service';
import { CompraService } from 'src/app/services/compra.service';
import { Compra } from 'src/app/models/compra';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ArticulosService, UploadService]
})
export class AdminComponent implements OnInit {
  public articulo: Articulo;
  public filesToUpload: Array<File>;
  public allCompras: Compra[];
  data: Compra[];
  TableRow: any[];
  public fileName: string;

  constructor(public articuloService: ArticulosService, public uploadService: UploadService, public compraService: CompraService) {
    this.articulo = new Articulo("", 0, "", "");
    this.filesToUpload = [];
    // this.compras = [];
    this.allCompras = [];
    this.TableRow = [];
    this.data = [];
    this.fileName = "ventas.xlsx";
  }

  ngOnInit(): void {
    this.getAllCompras();
  }

  exportexcel() {
    let element = document.getElementById('sales');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  createPDF() {

    const pdfDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: 'REPORTE DE VENTAS', style: 'header' },
        {
          table: {
            body: [
              [
                { text: 'FECHA', style: 'tableHeader' },
                { text: 'COMPRA', style: 'tableHeader' },
                { text: 'USUARIO', style: 'tableHeader' },
                { text: 'ARTICULO', style: 'tableHeader' },
                { text: 'CANTIDAD', style: 'tableHeader' },
                { text: 'PRECIO', style: 'tableHeader' },
                { text: 'TOTAL', style: 'tableHeader' }
              ],
              ...this.TableRow
            ]
          }
        }],
      footer: function (currentPage: number) {
        return [
          { text: (currentPage), alignment: 'center', style: 'footer' }
        ]
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        footer: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        }
      }
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download();
  }

  getAllCompras() {
    this.compraService.getAllCompras().subscribe(
      response => {
        this.allCompras = response;
        this.data = response;
        this.TableRow = this.allCompras.map(row => [row.fecha, row.compraId, row.usuarioId, row.nombreArticulo, row.cantidad, row.precio, row.total]);
        console.log(this.TableRow);
      }, error => {
        console.log(error);
      });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  onSubmitBook(form: any) {
    console.log("Adding article...");

    this.articuloService.addArticulo(this.articulo).subscribe(
      response => {
        console.log(response);
        this.uploadService.makeFileRequest("http://localhost:3700/api/articulos/upload-image/" + response.articulo._id, [], this.filesToUpload, "imagen").then((result: any) => {
          console.log(result);
          form.reset();
          const alert = document.createElement('div');
          alert.classList.add('alert');
          alert.classList.add('alert-success');
          alert.classList.add('alert-dismissible')
          alert.classList.add('fade');
          alert.classList.add('show');
          alert.innerHTML = `
          <strong>Book added successfully!</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          `;
          document.getElementsByClassName('form')[0].prepend(alert);
          form.reset();
        })
      }, error => {
        console.log(error);
      });
  }
}
