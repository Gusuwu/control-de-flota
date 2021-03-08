import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { MovilOdometro } from '../modelo/odometro';


@Injectable({
  providedIn: 'root'
})
export class MovilOdometroService 
extends ApiService<MovilOdometro>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("movil_odometro", http, app);
  }


}