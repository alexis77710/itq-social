//componente para el timeline o muro de publicaciones.
//Aquí vamos a llamar al servicio getPublications para traer los posts paginados.
//es todo el muro de la derecha con las publicaciones de los usuarios.
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/GLOBAL';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { CommonModule } from '@angular/common'; // Para *ngFor y *ngIf

import { SidebarComponent } from '../sidebar/sidebar.component'; // Importar el Sidebar para que este al lado de la lista de publicaciones.
@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent], 
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
  public identity: any;
  public token: any;
  public title: string;
  public url: string;
  public status: string;
  public page: number;
  public total: any;
  public pages: any;
  public publications: Publication[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ){
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.status = '';
    this.page = 1;
  }

  ngOnInit(){
    this.getPublications(this.page);
  }

  getPublications(page: number, adding = false){
    this._publicationService.getPublications(this.token, page).subscribe({
        next: (response: any) => {
            if(response.publications){
                this.total = response.total_items;
                this.pages = response.pages;
                
                // Si 'adding' es true, añadimos al array (Infinite Scroll futuro)
                // Por ahora reemplazamos para paginación simple
                this.publications = response.publications;

                if(page > this.pages){
                    // Si se pasa de página, volver a la 1
                    // this._router.navigate(['/home']);
                }
            }else{
                this.status = 'error';
            }
        },
        error: (error: any) => {
            var errorMessage = <any>error;
            console.log(errorMessage);
            this.status = 'error';
        }
    });
  }
  // AGREGAR ESTA FUNCIÓN PARA QUE EL SIDEBAR PUEDA RECARGAR EL MURO
    refresh(event: any = null){
        this.getPublications(1);
    }
}