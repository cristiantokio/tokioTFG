import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/loginservice';
import { UserModel } from '../model/user_model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginincorrecto: boolean = false;
  correoincorrecto: boolean = false;
  pswincorrecta: boolean = false;
  email: string = '';
  password: string = '';

  constructor(private router: Router, public loginService: LoginService ) {}

  ngAfterViewInit() {
    let token = localStorage.getItem("token");
    if(token != null && token != ""){
      this.router.navigate(['home']);
    }
  }

  login() {
    console.log(this.email);
    let emailVal = validarCorreo(this.email);
    let pswVal = validarContraseña(this.password)
    if(!emailVal){
      this.correoincorrecto = true;
    }else{
      this.correoincorrecto = false;
      }
    if(!pswVal){
      this.pswincorrecta = true;
    }else{
      this.pswincorrecta = false;
    }
    console.log(emailVal + "    "+ pswVal);
    if(emailVal && pswVal){
      this.loginService.getToken(this.email, this.password).subscribe(
        (user: UserModel) => {
          if(user.token){
            localStorage.setItem("token", user.token);
            localStorage.setItem("username", user.user);
            this.router.navigate(['home']);
          }
        },
        error => {
          console.error('Error al obtener el login:', error);
          this.loginincorrecto = true;
        }
      );
    }
    
  }
  
}

function validarCorreo(correo: string): boolean {
  const patronCorreo: RegExp = /^[a-zA-Z0-9._%+-]+@invoices\.net$/;
  return patronCorreo.test(correo);
}

function validarContraseña(contraseña: string): boolean {
  const patronContraseña: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{12,}$/;
  return patronContraseña.test(contraseña);
}
