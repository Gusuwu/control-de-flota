import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { HomeComponent } from './componentes/home/home.component';
import { ServicioComponent } from './componentes/servicio/servicio.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'grupos', component: GrupoComponent },
  { path: 'servicios', component: ServicioComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
