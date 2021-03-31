import { AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';
import { DatosService } from 'src/app/shared/datos/datos.service';
import { MovilGrupoService } from 'src/app/servicios/movil_grupo.service';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { MovilG } from 'src/app/modelo/movil-grilla';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';


@Component({
  selector: 'app-movil-avl',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit, AfterViewInit {

  constructor(public mS : MovilService, public msG: MovilGService, public formBuilder : FormBuilder, public datosService : DatosService, public mgService : MovilGrupoService, public movilgService : MovilGService, public msService: MovilServicioService) { }

  //@Input() moviId : number = 0;

  variable = true;

  moviles : Movil [] = [];
  movilesG : MovilG [] = [];
  columnas: string[] = ['movilID', 'patente','marca','modelo',  'acciones'];
  dataSource = new MatTableDataSource<Movil>();
  
  formulario = new FormGroup({});
  mostrarFormulario = false;
  mostrarForm = false;

  @ViewChild(MatSort) sort! : MatSort;

  movilSelected = new Movil();


  patente : string = "";
  descripcion : string = "";
  dependencia : string = "";
  movil = new MovilG();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      moviId: [''],
      moviModoFecha: ['', Validators.required],
      moviModoOdometro: ['', Validators.required],
      moviBorrado: [''],
      moviFechaAlta: ['']
    });

    this.mS.get().subscribe(
      (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
    )

    this.msG.get().subscribe(
        (movil) => {
          this.movilesG = movil;
          this.actualizar();
        }
      )
  }

  actualizar(){
   this.dataSource.data = this.moviles;
   this.dataSource.sort = this.sort;
  }


  busqueda(){
    if(this.patente && !this.dependencia && !this.descripcion){
      this.mS.get(`patente=${this.patente}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
      )
    }else if(!this.patente && !this.dependencia && this.descripcion){
      this.mS.get(`descripcion=${this.descripcion}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
      )
    }else{
      this.mS.get(`dependencia=${this.dependencia}`).subscribe(
      (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
      )
    }

    if(this.patente && this.descripcion){
      this.mS.get(`patente=${this.patente}&descripcion=${this.descripcion}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
      )
    }else if(this.patente && this.dependencia){
      this.mS.get(`patente=${this.patente}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
      )
    }else if(this.dependencia && this.descripcion){
      this.mS.get(`descripcion=${this.descripcion}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
      )
    }else if(this.patente && this.descripcion && this.dependencia){
      this.mS.get(`patente=${this.patente}&descripcion=${this.descripcion}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
      )
    }else{

    }
    
  }

  agregar(seleccionado : Movil) {
    this.formulario.reset();
    
    if(seleccionado.moviId == null){
      this.movil.moviId = seleccionado.movilID;
    }else if(seleccionado.moviId && !seleccionado.moviBorrado){
        alert("El movil seleccionado ya está en control de flota");
    }else{
      this.movil.moviId = seleccionado.movilID;
    }

    if (this.movil.moviId) {

      if(seleccionado.moviBorrado){
        this.movil.moviBorrado = !seleccionado.moviBorrado;
        this.movil.patente = seleccionado.patente;
        this.movil.dependencia = seleccionado.dependencia;
        this.movil.descripcion = seleccionado.descripcion;
        this.movil.marca =  seleccionado.marca;
        this.movil.modelo =  seleccionado.modelo;
        this.movil.anio =  seleccionado.anio;
        this.movil.tipoMovil =  seleccionado.tipoMovil;
        this.movil.numeroMovil =  seleccionado.numeroMovil;
        this.movil.color =  seleccionado.color;

        this.msG.put(this.movil)
        .subscribe((movil) => {             
        });
      }else{
        this.msG.post(this.movil)
          .subscribe((movil) => {
            this.movilesG.push(movil);                
          });
         this.msG.odometro = this.movil;
      }
     this.mostrarFormulario = true;              
    }

    
  }

  

  cancelar() {
    this.mostrarFormulario = false;
  }


}