//Aquí vamos a capturar el ID de la URL (ese código raro 6933...) y usarlo para buscar los datos.

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/GLOBAL';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [UserService]
})
export class ProfileComponent implements OnInit {
  public title: string;
  public user: User | null = null; // Puede ser nulo al principio
  public status: string;
  public identity: any;
  public token: any;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Perfil';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.status = '';
  }

  ngOnInit(){
    this.loadPage();
  }

  loadPage(){
    this._route.params.subscribe(params => {
      let id = params['id']; // Sacamos el ID de la URL
      this.getUser(id);
    });
  }

  getUser(id: string){
    this._userService.getUser(id).subscribe({
      next: (response: any) => {
        if(response.user){
          this.user = response.user;
        }else{
          this.status = 'error';
        }
      },
      error: (error: any) => {
        console.log(error);
        this._router.navigate(['/perfil', this.identity._id]); // Si falla, te manda a tu propio perfil
      }
    });
  }
}