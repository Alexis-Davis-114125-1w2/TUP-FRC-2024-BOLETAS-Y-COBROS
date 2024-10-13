
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from '../inicio/inicio.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { ListadoComponent } from '../listado/listado.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'pagar', component: PaymentFormComponent },
  { path: 'listado', component: ListadoComponent },


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutesModules { }
