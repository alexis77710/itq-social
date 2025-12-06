import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms'; // <--- IMPORTANTE PARA FORMULARIOS
import { CommonModule } from '@angular/common'; // <--- IMPORTANTE PARA *ngIf

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // <--- AQUÍ SE CARGAN LOS MÓDULOS
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [UserService] // Cargamos el servicio aquí
})
export class RegisterComponent {
  public title: string;
  public user: User;
  public status: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Regístrate';
    this.status = '';
    // Inicializamos el usuario vacío para rellenarlo en el form
    this.user = new User("", "", "", "", "", "", "ROLE_USER", ""); 
  }

  onSubmit(form: any){
    // Llamamos al servicio de registro
    this._userService.register(this.user).subscribe({
      next: (response: any) => {
        if(response.user && response.user._id){
          this.status = 'success';
          form.reset(); // Limpia el formulario si salió bien
        }else{
          this.status = 'error';
        }
      },
      error: (error: any) => {
        console.log(error);
        this.status = 'error';
      }
    });
  }
}