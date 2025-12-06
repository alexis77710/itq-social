//Vamos a crear dos funciones rápidas en tu Servicio para que cualquier componente 
// (la barra de navegación, el perfil, el muro) pueda preguntar: "¿Quién está conectado?"

import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // <--- IMPORTANTE: Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // <--- IMPORTANTE: isPlatformBrowser
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { User } from '../models/user'; // Asegúrate de tener el modelo, si no, comenta esta línea por ahora

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // En Angular 19/17+ se recomienda usar inject() o el constructor clásico.
  // Usaremos el constructor clásico que es más fácil de leer al principio.
  public url: string;

// Agregamos estas dos propiedades para guardar los datos en memoria
  public identity: any;
  public token: any;

  constructor(private _http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // <--- Inyectamos el ID de la plataforma
  ) {
    this.url = GLOBAL.url;
    this.identity = null;
    this.token = null;
  }

  // 1. MÉTODO DE REGISTRO
  register(user: any): Observable<any> {
    // Convertimos el objeto usuario a JSON string
    let params = JSON.stringify(user);
    
    // Definimos las cabeceras (decimos que enviamos JSON)
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Hacemos la petición POST a /register
    return this._http.post(this.url + 'register', params, {headers: headers});
  }

  // 2. MÉTODO DE LOGIN
  signup(user: any, gettoken: any = null): Observable<any> {
    if(gettoken != null){
      user.gettoken = gettoken;
    }

    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'login', params, {headers: headers});
  }
  // --- NUEVAS FUNCIONES ---

  // --- FUNCIONES BLINDADAS PARA SSR ---

  getIdentity() {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Recuperamos el string tal cual
      let identity = localStorage.getItem('identity');
      
      // 2. Solo si existe y no es "undefined", lo convertimos
      if(identity && identity != "undefined"){
        this.identity = JSON.parse(identity);
      }else{
        // 3. Si no hay nada, devolvemos NULL explícito
        this.identity = null;
      }
    } else {
      this.identity = null;
    }
    
    return this.identity;
  }

  getToken(){
    // PREGUNTA CLAVE: ¿Estoy en el navegador?
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('token');
      
      if(token && token != "undefined"){
        this.token = token;
      }else{
        this.token = null;
      }
    } else {
      this.token = null;
    }

    return this.token;
  }

  
  // AGREGAR ESTO AL FINAL:
  updateUser(user: any): Observable<any>{
    let params = JSON.stringify(user);
    // Necesitamos el Token para autorizar la edición
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', this.getToken());

    return this._http.put(this.url + 'update-user/' + user._id, params, {headers: headers});
  }

  //función para pedir la lista al backend.
  // OBTENER LISTA DE USUARIOS (Paginado)
  getUsers(page: number = 1): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', this.getToken());

    return this._http.get(this.url + 'users/' + page, {headers: headers});
  }

  // OBTENER UN SOLO USUARIO (Para el perfil)
  getUser(id: string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', this.getToken());

    return this._http.get(this.url + 'user/' + id, {headers: headers});
  }
}


