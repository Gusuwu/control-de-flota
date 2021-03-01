import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';

import { MovilG } from '../modelo/movil-grilla';


@Injectable({
  providedIn: 'root'
})
export class MovilGService 
extends ApiService<MovilG>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("movil_grilla", http, app);
  }


}