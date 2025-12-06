//servicio exclusivo para subir archivos. 
// Así lo reutilizaremos luego para subir las fotos de las publicaciones.

import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url: string;

  constructor() { 
    this.url = GLOBAL.url;
  }

  // Función clásica para subir archivos (AJAX)
  makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string){
    return new Promise(function(resolve, reject){
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      // Adjuntar los archivos al formulario virtual
      for(var i = 0; i < files.length; i++){
        formData.append(name, files[i], files[i].name);
      }

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }
        }
      }

      // Abrir la petición POST
      xhr.open('POST', url, true);
      // Adjuntar el token de seguridad
      xhr.setRequestHeader('Authorization', token);
      // Enviar
      xhr.send(formData);
    });
  }
}