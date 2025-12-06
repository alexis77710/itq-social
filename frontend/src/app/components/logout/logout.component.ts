//Este componente es especial: 
// No tiene vista. Su único trabajo es borrar tus datos del bolsillo (localStorage) y patearte al Login.

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: '', // No necesitamos HTML
  providers: [UserService]
})
export class LogoutComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private _router: Router
  ){}

  ngOnInit(){
    this.logout();
  }

  logout(){
    // 1. Borrar datos del localStorage
    localStorage.clear();

    // 2. Poner las variables del servicio en null
    this._userService.identity = null;
    this._userService.token = null;

    // 3. Redireccionar al Login
    this._router.navigate(['/login']);
  }
}