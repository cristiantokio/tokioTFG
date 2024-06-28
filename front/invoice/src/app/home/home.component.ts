import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { InvoiceService } from '../services/invoiceservice';
import { InvoiceModel } from '../model/invoice_model';
import Swal from 'sweetalert2'
import { InvoiceSetModel } from '../model/invoiceSet_model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnInit {
  async openFormPost() {
    const { value: formValues } = await Swal.fire({
      title: "Multiple inputs",
      html: `
        <p>NOMBRE PRODUCTO</p>
        <input id="product" class="product">
        <p>PRECIO</p>
        <input type="number" step=".01" id="price" class="price">
        <p>CANTIDAD</p>
        <input type="number" id="quantity" class="quantity">
      `,
      focusConfirm: false,
      preConfirm: () => {
        let product = (document.getElementById("product") as HTMLInputElement).value ?? null;
        let price = (document.getElementById("price") as HTMLInputElement).value ?? null;
        let quantity = (document.getElementById("quantity") as HTMLInputElement).value ?? null;
        if(product == "" || price == "" || quantity == ""){
          return null;
        }
        return [
          product, price, quantity
        ];
      }
    });
    if (formValues) {
      const invoiceLiteral: InvoiceSetModel = {
        product: formValues[0],
        price: formValues[1],
        quantity: formValues[2]
    }
      this.invoiceService
    .setInvoice(invoiceLiteral)
    .subscribe(invoice => this.invoices.push(invoice!));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "El producto se ha subido correctamente",
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Los datos no pueden estar vacios!",
      })
    }
  throw new Error('Method not implemented.');
  }
  async openFormPut(invoice: InvoiceModel) {
    const { value: formValues } = await Swal.fire({
      title: "Multiple inputs",
      html: `
        <p>NOMBRE PRODUCTO</p>
        <input id="product" class="product" value="${invoice.product}">
        <p>PRECIO</p>
        <input type="number" step=".01" id="price" class="price" value="${invoice.price}">
        <p>CANTIDAD</p>
        <input type="number" id="quantity" class="quantity" value="${invoice.quantity}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        let product = (document.getElementById("product") as HTMLInputElement).value ?? null;
        let price = (document.getElementById("price") as HTMLInputElement).value ?? null;
        let quantity = (document.getElementById("quantity") as HTMLInputElement).value ?? null;
        if(product == "" || price == "" || quantity == ""){
          return null;
        }
        return [
          product, price, quantity
        ];
      }
    });
    if (formValues) {
      const invoiceLiteral: InvoiceModel = {
        id: invoice.id,
        product: formValues[0],
        price: formValues[1],
        quantity: formValues[2],
        date: invoice.date
    }
      this.invoiceService
    .editInvoice(invoiceLiteral)
    .subscribe(invoice => this.invoices.push(invoice!));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "El producto se ha subido correctamente",
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Los datos no pueden estar vacios!",
      })
    }
  throw new Error('Method not implemented.');
  }

  closeSession() {
    localStorage.setItem("token", "");
    localStorage.setItem("username", "");
    this.router.navigate(['login']);
  }
  invoices: InvoiceModel[] = [];
  title = 'invoice-web';
  displayedColumns: string[] = ['id', 'product', 'price',  'quantity', 'date', 'actions' ];
  dataSource = new MatTableDataSource<InvoiceModel>();
  constructor(private router: Router, public invoiceService: InvoiceService) {}
  ngOnInit() {
    
    this.invoiceService.getInvoices(localStorage.getItem("username")!, localStorage.getItem("token")!).subscribe(
      (data: InvoiceModel[]) => {
        this.invoices = data;
        this.dataSource.data = this.invoices;
      },
      error => {
        console.error('Error al obtener las facturas:', error);
      }
    );
  }
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
  
    ngAfterViewInit() {
      let token = localStorage.getItem("token");
      if(token == null || token == ""){
        this.router.navigate(['login']);
      }
      this.dataSource.paginator = this.paginator;
    }
}
