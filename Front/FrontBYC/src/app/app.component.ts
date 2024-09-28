import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { ListadoComponent } from './listado/listado.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {StripePaymentComponent} from "./stripe-payment/stripe-payment.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
    , InicioComponent
    , ListadoComponent,
    FormsModule,
    StripePaymentComponent,
    HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontBYC';
}
