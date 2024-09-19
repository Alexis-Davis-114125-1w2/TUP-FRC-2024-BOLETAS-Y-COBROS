import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component'; 
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { ListadoComponent } from './listado/listado.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
    , InicioComponent
    , ListadoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontBYC';
}
