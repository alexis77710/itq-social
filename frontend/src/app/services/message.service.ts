//Aquí están las funciones para conectar con tu Backend de mensajería.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public url: string;

  constructor(private _http: HttpClient) { 
    this.url = GLOBAL.url;
  }

  // 1. ENVIAR MENSAJE
  addMessage(token: string, message: Message): Observable<any>{
    let params = JSON.stringify(message);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);

    return this._http.post(this.url + 'message', params, {headers: headers});
  }

  // 2. RECIBIDOS (INBOX)
  getMyMessages(token: string, page: number = 1): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    return this._http.get(this.url + 'my-messages/' + page, {headers: headers});
  }

  // 3. ENVIADOS (OUTBOX)
  getEmittedMessages(token: string, page: number = 1): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    return this._http.get(this.url + 'messages-to/' + page, {headers: headers});
  }
}