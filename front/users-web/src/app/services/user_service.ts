import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import { UserModel } from "../model/user_model";
import { UserSetModel } from "../model/userSet_model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserModel[]> {
    return this.http.get<any>(`https://fv6fzpw1ng.execute-api.eu-west-1.amazonaws.com/dev/users`).pipe(
      map(data => {
        return data;
      })
    );
  }

  setUser(user: UserSetModel): Observable<UserModel | null> {
    console.log(user);
    return this.http.post<UserModel>("https://fv6fzpw1ng.execute-api.eu-west-1.amazonaws.com/dev/users", user)
      .pipe(
        catchError(err => {
          console.error('Error occurred:', err);
          return of(null);
        })
      );
  }

  editUser(user: UserModel): Observable<UserModel  | null> {
    console.log(user);
    return this.http.put<UserModel>("https://fv6fzpw1ng.execute-api.eu-west-1.amazonaws.com/dev/users", user)
      .pipe(
        catchError(err => {
          console.error('Error occurred:', err);
          return of(null);
        })
      );
  }

}