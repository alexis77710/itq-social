//Cuando te logueas en Facebook, 
// no tienes que meter tu clave cada vez que recargas la página, ¿verdad? 
// Eso es porque guardan tu "carnet" (Token) en el navegador. 
// Nosotros haremos lo mismo usando el localStorage.


//Primero pedimos los datos del usuario (para saber quién es).
//Luego pedimos el Token (para darle permiso de navegar).

import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService]
})
export class LoginComponent {
  public title: string;
  public user: User;
  public status: string;
  public identity: any; // Aquí guardaremos al usuario logueado
  public token: any;    // Aquí guardaremos el token

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Identifícate';
    this.status = '';
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  onSubmit(form: any){
    // 1. CONSEGUIR DATOS DEL USUARIO (IDENTITY)
    this._userService.signup(this.user).subscribe({
      next: (response: any) => {
        if(response.user && response.user._id){
          
          this.identity = response.user;
          // GUARDAR EN EL NAVEGADOR (localStorage)
          localStorage.setItem('identity', JSON.stringify(this.identity));

          // 2. CONSEGUIR EL TOKEN
          // Pasamos 'true' como segundo parámetro para pedir el token
          this._userService.signup(this.user, true).subscribe({
            next: (response: any) => {
              if(response.token){
                this.token = response.token;
                // GUARDAR TOKEN EN EL NAVEGADOR
                localStorage.setItem('token', this.token);

                this.status = 'success';
                
                // REDIRECCIONAR AL HOME
                // (Por ahora al home, luego lo mandaremos al Muro)
                this._router.navigate(['/']);

              }else{
                this.status = 'error';
              }
            },
            error: (error: any) => {
              this.status = 'error';
              console.log(error);
            }
          });

        }else{
          this.status = 'error';
        }
      },
      error: (error: any) => {
        this.status = 'error';
        console.log(error);
      }
    });
  }
}