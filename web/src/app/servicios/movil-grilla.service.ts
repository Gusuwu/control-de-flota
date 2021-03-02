import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';

import { MovilG } from '../modelo/movil-grilla';
import { MovilGrupo } from '../modelo/movil_grupo';


@Injectable({
  providedIn: 'root'
})
export class MovilGService 
extends ApiService<MovilG>{

  movgru : MovilGrupo[] = [];

  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("movil_grilla", http, app);
  }


}