import { Routes } from '@angular/router';

// Importamos tus nuevos componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { SentComponent } from './components/messages/sent/sent.component';
import { ReceivedComponent } from './components/messages/received/received.component';
import { AddComponent } from './components/messages/add/add.component';
import { MainComponent } from './components/messages/main/main.component';
import { ProfileComponent } from './components/profile/profile.component';

// IMPORTANTE: Importar el Guardia
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Cuando la URL está vacía, vamos al Home
    { path: '', component: HomeComponent },
    
    // Rutas PÚBLICAS (Cualquiera entra)
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterComponent },
    
    // Rutas PRIVADAS (Necesitan Login - canActivate: [authGuard])
    { path: 'logout', component: LogoutComponent },
    { path: 'mis-datos', component: UserEditComponent, canActivate: [authGuard] },
    { path: 'gente', component: UsersComponent, canActivate: [authGuard] },
    { path: 'gente/:page', component: UsersComponent, canActivate: [authGuard] },
    { path: 'timeline', component: TimelineComponent, canActivate: [authGuard] },
    { path: 'perfil/:id', component: ProfileComponent, canActivate: [authGuard] },
    
    // RUTAS DE MENSAJERÍA (Protegemos la entrada principal)
    { 
        path: 'mensajes', 
        component: MainComponent,
        canActivate: [authGuard], // <--- El guardia protege todas las hijas de una vez
        children: [
            { path: '', redirectTo: 'recibidos', pathMatch: 'full' },
            { path: 'enviar', component: AddComponent },
            { path: 'recibidos', component: ReceivedComponent },
            { path: 'recibidos/:page', component: ReceivedComponent },
            { path: 'enviados', component: SentComponent },
            { path: 'enviados/:page', component: SentComponent }
        ]
    },

    // Ruta comodín (Siempre al final)
    { path: '**', component: HomeComponent }
];