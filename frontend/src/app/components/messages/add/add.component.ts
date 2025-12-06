//Agregar Mensaje (Formulario):
//Para enviar un mensaje, necesitamos seleccionar a quién. 
// Para hacerlo fácil y pro, cargaremos la lista de usuarios en un <select> (desplegable).


import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service'; // Para listar a la gente
import { GLOBAL } from '../../../services/GLOBAL';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
  providers: [MessageService, UserService]
})
export class AddComponent implements OnInit {
  public title: string;
  public message: Message;
  public identity: any;
  public token: any;
  public url: string;
  public status: string;
  public follows: any; 
  public users: any[] = []; // Aquí guardaremos la lista de usuarios para el select

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _userService: UserService
  ){
    this.title = 'Enviar mensaje';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.status = '';
    let userId = this.identity ? this.identity._id : '';
    // Inicializamos mensaje vacío
    this.message = new Message('', '', 'false', '', userId, '');
  }

  ngOnInit(){
    this.getMyFollows(); // Cargamos los usuarios
  }

  onSubmit(form: any){
    this._messageService.addMessage(this.token, this.message).subscribe({
      next: (response: any) => {
        if(response.message){
          this.status = 'success';
          form.reset();
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

  getMyFollows(){
    // Por ahora traemos TODOS los usuarios para poder escribirle a cualquiera
    // En una app real, traeríamos solo a los que seguimos
    this._userService.getUsers(1).subscribe({
        next: (response: any) => {
            if(response.users){
                this.users = response.users;
            }
        },
        error: (error: any) => {
            console.log(error);
        }
    });
  }
}