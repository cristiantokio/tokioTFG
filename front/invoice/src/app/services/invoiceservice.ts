import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InvoiceModel } from "../model/invoice_model";
import { Observable, catchError, map, of } from "rxjs";
import { InvoiceSetModel } from "../model/invoiceSet_model";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  constructor(private http: HttpClient) {}

  getInvoices(username: string, token: string): Observable<InvoiceModel[]> {
    return this.http.get<any[]>("https://fv6fzpw1ng.execute-api.eu-west-1.amazonaws.com/dev/registroventas", {
      headers: { Authorization: token },
      params: new HttpParams({fromObject: { username: username }})
    }).pipe(
      map(data => {
        return data;
      })
    );
  }

  setInvoice(product: InvoiceSetModel): Observable<InvoiceModel | null> {
    console.log(product);
    return this.http.post<InvoiceModel>("https://fv6fzpw1ng.execute-api.eu-west-1.amazonaws.com/dev/registroventas", product)
      .pipe(
        catchError(err => {
          console.error('Error occurred:', err);
          return of(null);
        })
      );
  }

  editInvoice(product: InvoiceModel): Observable<InvoiceModel  | null> {
    console.log(product);
    return this.http.put<InvoiceModel>("https://fv6fzpw1ng.execute-api.eu-west-1.amazonaws.com/dev/registroventas", product)
      .pipe(
        catchError(err => {
          console.error('Error occurred:', err);
          return of(null);
        })
      );
  }
}