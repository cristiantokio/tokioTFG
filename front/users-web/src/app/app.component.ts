import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import Swal from 'sweetalert2'
import { UserService } from './services/user_service';
import { UserModel } from './model/user_model';
import { UserSetModel } from './model/userSet_model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTableModule, MatPaginatorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {


  users: UserModel[] = [];
  title = 'user-web';
  displayedColumns: string[] = ['email', 'psw', 'fecha_creacion',  'rol', 'token', 'ultima_sesion', 'actions' ];
  dataSource = new MatTableDataSource<UserModel>();
  constructor(public userService: UserService) {}
  ngOnInit() {
    this.userService.getUsers().subscribe(
      (data: UserModel[]) => {
        this.users = data;
        this.dataSource.data = this.users;
      },
      error => {
        console.error('Error al obtener las facturas:', error);
      }
    );
  }


  async openFormPost() {
    const { value: formValues } = await Swal.fire({
      title: "Multiple inputs",
      html: `
        <p>Email</p>
        <input id="email" class="email">
        <p>Psw</p>
        <input id="password" type="password" class="password">
        <p>Repita Psw</p>
        <input id="passwordRepeat" type="password" class="passwordRepeat">
        <p>Delegacion</p>
        <select id="selectDelegation">
          <option value="D1" selected>Delegacion 1</option>
          <option value="D2">Delegacion 2</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        let email = (document.getElementById("email") as HTMLInputElement).value ?? null;
        let password = (document.getElementById("password") as HTMLInputElement).value ?? null;
        let passwordRepeat = (document.getElementById("passwordRepeat") as HTMLInputElement).value ?? null;
        let selectDelegation = (document.getElementById("selectDelegation") as HTMLSelectElement).value ?? null;
        if(email == "" || password == "" || passwordRepeat == "" || selectDelegation == "" || password !== passwordRepeat){
          return null;
        }
        return [
          email, password, selectDelegation
        ];
      }
    });
    if (formValues) {
      const invoiceLiteral: UserSetModel = {
        email: formValues[0],
        psw: formValues[1],
        rol: formValues[2]
    }
      this.userService
    .setUser(invoiceLiteral)
    .subscribe(user => this.users.push(user!));
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
        text: "Los datos no pueden estar vacios y las psw iguales!",
      })
    }
  throw new Error('Method not implemented.');
  }


  async openFormPut(user: UserModel) {
    const { value: formValues } = await Swal.fire({
      title: "Multiple inputs",
      html: `
        <p>Editar Psw</p>
        <input id="password" type="password" class="password">
        <p>Repita Psw</p>
        <input id="passwordRepeat" type="password" class="passwordRepeat">
      `,
      focusConfirm: false,
      preConfirm: () => {
        let password = (document.getElementById("password") as HTMLInputElement).value ?? null;
        let passwordRepeat = (document.getElementById("passwordRepeat") as HTMLInputElement).value ?? null;
        if(password == "" || password !== passwordRepeat){
          return null;
        }
        return [
          password, passwordRepeat
        ];
      }
    });
    if (formValues) {
      const userLiteral: UserModel = {
        email: user.email,
        psw: formValues[0],
        fecha_creacion: user.fecha_creacion,
        rol: user.rol,
        token: user.token,
        ultima_sesion: user.ultima_sesion
    }
      this.userService
    .editUser(userLiteral)
    .subscribe(user => this.users.push(user!));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "El usuario se ha creado correctamente",
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Los datos no pueden estar vacios y las psw iguales!",
      })
    }
  throw new Error('Method not implemented.');
  }



  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
