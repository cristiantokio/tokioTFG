import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import { UserModel } from "../model/user_model";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(private http: HttpClient) {}

  getToken(email: string, psw: string ): Observable<UserModel> {
    return this.http.get<any>(`https://fv6fzpw1ng.execute-api.eu-west-1.amazonaws.com/dev/login?user=${email}&psw=${psw}`).pipe(
      map(data => {
        console.log('Datos login');
        console.log(data);
        return data;
      })
    );
  }

}