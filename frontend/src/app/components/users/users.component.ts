//Aquí vamos a llamar al servicio y manejar la paginación (botón "Siguiente" y "Anterior").

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router'; // Importar RouterLink
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/GLOBAL';
import { CommonModule } from '@angular/common'; // Importante para *ngFor

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink], // Agregar RouterLink a los imports
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  public title: string;
  public identity: any;
  public token: any;
  public page: number;
  public next_page: number;
  public prev_page: number;
  public status: string;
  public total: any;
  public pages: any;
  public users: User[] = []; // Array para guardar los usuarios
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Gente';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.status = '';
    this.page = 1;
    this.next_page = 1;
    this.prev_page = 1;
  }

  ngOnInit(){
    // Recoger la página actual de la URL
    this._route.params.subscribe(params => {
      let page = +params['page']; // El + convierte string a numero
      this.page = page;

      if(!params['page']){
        page = 1;
        this.page = 1;
      }

      this.next_page = page + 1;
      this.prev_page = page - 1;

      if(this.prev_page <= 0){
        this.prev_page = 1;
      }

      // Devolver listado de usuarios
      this.getUsers(page);
    });
  }

  getUsers(page: number){
    this._userService.getUsers(page).subscribe({
      next: (response: any) => {
        if(!response.users){
          this.status = 'error';
        }else{
          this.total = response.total;
          this.pages = response.pages;
          this.users = response.users;

          if(page > this.pages){
            this._router.navigate(['/gente', 1]);
          }
        }
      },
      error: (error: any) => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        this.status = 'error';
      }
    });
  }
}