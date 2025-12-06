//Componente Principal (Para el menú de mensajes)
//Este componente será el "papá" de los otros. 
// Solo tendrá unos botones bonitos para navegar entre 
// "Enviar", "Recibidos" y "Enviados".

import { Component, OnInit, DoCheck } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Importante para la navegación hija

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Importamos esto para que funcionen los links
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  public title: string;

  constructor(){
    this.title = 'Mensajería Privada';
  }

  ngOnInit(){}
}