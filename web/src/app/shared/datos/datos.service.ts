
import { Injectable } from '@angular/core';
import { GrupoServicio } from 'src/app/modelo/grupo_servicio';
import { ServicioTarea } from 'src/app/modelo/servicio_tarea';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

    sertar : ServicioTarea[] = [];
    gruser : GrupoServicio[] = [];

  constructor(){}
}