//Necesitamos saber si el usuario está logueado para cambiar los botones.

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // Para los botones
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common'; // Para el *ngIf
import { GLOBAL } from '../../services/GLOBAL';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- IMPORTANTE
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  public title: string;
  public identity: any;
  public url: string;
  
  constructor(private _userService: UserService){
    this.title = 'Bienvenido a NG-SOCIAL';
    this.identity = this._userService.getIdentity();
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    // Refrescamos la identidad por si acaso
    this.identity = this._userService.getIdentity();
  }
}
