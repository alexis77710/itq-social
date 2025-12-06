//Enviados (Outbox):

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/GLOBAL';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sent',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importante para *ngFor
  templateUrl: './sent.component.html',
  styleUrl: './sent.component.css',
  providers: [MessageService, UserService]
})
export class SentComponent implements OnInit {
  public title: string;
  public messages: Message[] = [];
  public identity: any;
  public token: any;
  public url: string;
  public status: string;
  public page: number;
  public next_page: number;
  public prev_page: number;
  public total: any;
  public pages: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _userService: UserService
  ){
   this.title = 'Mensajes Enviados'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.status = '';
    this.page = 1;
    this.next_page = 1;
    this.prev_page = 1;
  }

  ngOnInit(){
    this._route.params.subscribe(params => {
        let page = +params['page'];
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

        this.getEmittedMessages(this.token, this.page);
    });
  }

  getEmittedMessages(token: string, page: number){
    // CORRECCIÓN: Usar .getEmittedMessages (Enviados)
    this._messageService.getEmittedMessages(token, page).subscribe({ 
        next: (response: any) => {
            if(response.messages){
                this.messages = response.messages;
                this.total = response.total;
                this.pages = response.pages;
            }
        },
        error: (error: any) => {
            console.log(error);
        }
    });
  }
}