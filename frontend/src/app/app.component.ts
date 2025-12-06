import { Component, OnInit, DoCheck, Inject, PLATFORM_ID } from '@angular/core'; // <--- IMPORTANTE
import { isPlatformBrowser, CommonModule, DOCUMENT } from '@angular/common'; // <--- IMPORTANTE
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/GLOBAL';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  public title = 'NG-SOCIAL';
  public identity: any;
  public url: string;
  public isDarkMode: boolean = false;

  constructor(
    private _userService: UserService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object // <--- INYECTAMOS LA PLATAFORMA
  ){
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    
    // BLINDAJE: Solo ejecutamos esto si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
        const localTheme = localStorage.getItem('theme');
        if(localTheme === 'dark'){
            this.isDarkMode = true;
            this.document.body.classList.add('dark-theme');
        }
    }
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  toggleTheme(){
    // BLINDAJE: Solo si es navegador (aunque el click solo pasa en navegador, es buena práctica)
    if (isPlatformBrowser(this.platformId)) {
        this.isDarkMode = !this.isDarkMode;
        
        if(this.isDarkMode){
            this.document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }else{
            this.document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }
  }
}