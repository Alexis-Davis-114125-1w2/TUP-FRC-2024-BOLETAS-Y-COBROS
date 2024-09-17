
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarBoletasComponent } from '../consultar-boletas/consultar-boletas.component'; 
import { InicioComponent } from '../inicio/inicio.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'consultar-boletas', component: ConsultarBoletasComponent },
  { path: 'consultar-pagos-historicos', component: ConsultarBoletasComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutesComponent { }
