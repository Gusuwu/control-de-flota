import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { HomeComponent } from './componentes/home/home.component';
import { AppConfigService } from './core/config.service';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ServicioComponent } from './componentes/servicio/servicio.component';
import { TareaComponent } from './componentes/tarea/tarea.component';
import { ServicioTareaComponent } from './componentes/servicio_tarea/servicio_tarea.component';
import { ConfirmarComponent } from './shared/confirmar/confirmar.component';
import { GrupoServicioComponent } from './componentes/grupo_servicio/grupo_servicio.component';
import { MovilComponent } from './componentes/movil-avl/movil.component';
import { MovilGrupoComponent } from './componentes/movil_grupo/movil_grupo.component';
import { MovilServicioComponent } from './componentes/movil_servicio/movil_servicio.component';
import { MovilGComponent } from './componentes/movil/movil.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MovilOdometro } from './modelo/odometro';
import { MovilOdometroComponent } from './componentes/odometro/odometro.component';
import { AlertaComponent } from './shared/alerta/alerta.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MovilBitacora } from './modelo/movil_bitacora';
import { MovilBitacoraComponent } from './componentes/movil-bitacora/movil-bitacora.component';
import { BitacoraTareaComponent } from './componentes/bitacora-tarea/bitacora-tarea.component';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
  

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GrupoComponent,
    ServicioComponent,
    TareaComponent,
    ServicioTareaComponent,
    GrupoServicioComponent,
    MovilComponent,
    MovilGrupoComponent,
    MovilServicioComponent,
    ConfirmarComponent,
    AlertaComponent,
    MovilGComponent,
    MovilOdometroComponent,
    MovilBitacoraComponent,
    BitacoraTareaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatToolbarModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatListModule,
    MatDividerModule,
    MatGridListModule,

  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfig(config: AppConfigService) {
  return () => config.load();
}