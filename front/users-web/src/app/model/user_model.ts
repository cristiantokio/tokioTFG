export class UserModel {
    constructor(public email: string, public psw: string, 
        public fecha_creacion: string, 
        public rol: string, public token: string, public ultima_sesion: string){}
}