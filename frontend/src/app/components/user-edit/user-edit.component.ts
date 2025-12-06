//componente editar perfil del usuario 
//Aquí hay un truco importante: Cuando actualices tus datos, 
// tienes que actualizar también el localStorage. 
// Si no lo haces, seguirás viendo tu nombre viejo hasta que cierres sesión.

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GLOBAL } from '../../services/GLOBAL'; // <--- Para la URL de la imagen

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity: any;
  public token: any;
  public status: string;
  public url: string;
  public filesToUpload: Array<File> = []; // Variable para guardar el archivo

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService
  ){
    this.title = 'Actualizar mis datos';
    this.user = new User("","","","","","","",""); // Usuario vacío temporal
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.status = '';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    // Rellenamos el formulario con los datos actuales del usuario
    this.user = this.identity; 
  }
    // 1. CAPTURAR EL ARCHIVO DEL INPUT
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
  // 2. ENVIAR EL FORMULARIO
  onSubmit(form: any){
    this._userService.updateUser(this.user).subscribe({
      next: (response: any) => {
        if(response.user){
          this.status = 'success';
          
          // ACTUALIZAR EL LOCALSTORAGE
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          // 2. SUBIR LA IMAGEN (Si hay una seleccionada)
          if(this.filesToUpload.length > 0){
             // ruta: /upload-image-user/:id
             this._uploadService.makeFileRequest(this.url + 'upload-image-user/'+this.user._id, [], this.filesToUpload, this.token, 'image')
                 .then((result: any) => {
                    // Actualizamos la imagen en el objeto usuario
                    this.user.image = result.user.image;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    console.log(result);
                 });
          }

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