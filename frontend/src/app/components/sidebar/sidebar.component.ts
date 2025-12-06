//Aquí manejaremos el formulario para enviar texto e imagen.
//este esta en la ruta timeline a la izquierda del muro de publicaciones.

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/GLOBAL';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service'; // Para subir foto al post
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {
  public identity: any;
  public token: any;
  public stats: any;
  public url: string;
  public status: string;
  public publication: Publication;
  public filesToUpload: Array<File> = [];

  // Esto sirve para avisarle al Timeline que recargue cuando publicamos algo
  @Output() sended = new EventEmitter();

  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService,
    private _router: Router
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.status = '';
    this.publication = new Publication("", "", "", "", this.identity);
  }

  ngOnInit(){}

  onSubmit(form: any){
    this._publicationService.addPublication(this.token, this.publication).subscribe({
        next: (response: any) => {
            if(response.publication){
                
                // Si hay imagen, la subimos
                if(this.filesToUpload.length > 0){
                    this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
                                   .then((result:any)=>{
                                       this.publication = result.publication;
                                       this.status = 'success';
                                       form.reset();
                                       this.sended.emit({send:'true'}); // Avisar al padre
                                   });
                }else{
                    this.status = 'success';
                    form.reset();
                    this.sended.emit({send:'true'}); // Avisar al padre
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

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}