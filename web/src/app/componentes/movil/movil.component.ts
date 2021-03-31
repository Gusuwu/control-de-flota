import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DatosService } from 'src/app/shared/datos/datos.service';
import { MovilGrupoService } from 'src/app/servicios/movil_grupo.service';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { MovilG } from 'src/app/modelo/movil-grilla';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';
import {MatTabsModule} from '@angular/material/tabs';



@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilGComponent implements OnInit, AfterViewInit {

  constructor(public mS : MovilGService, public formBuilder : FormBuilder, public mgService : MovilGrupoService, public msService: MovilServicioService) { }

  moviles : MovilG [] = [];
  columnas: string[] = ['moviId', 'patente', 'marca', 'modelo', 'moviModoFecha','moviModoOdometro', 'acciones'];
  dataSource = new MatTableDataSource<MovilG>();
  
  formulario = new FormGroup({});
  mostrarEditar = false;
  mostrarManten = false;
  mostrarGrilla = false;
  mostrarAgregar = false;
  mostrarMovil = false;

  @ViewChild(MatSort) sort! : MatSort;

  movilSelected = new MovilG();
  movil = new MovilG();
  patente : string = "";
  descripcion : string = "";
  dependencia : string = "";

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
      moviFechaAlta: [''],
      descripcion: [''],
      marca : [''],
      modelo : [''],
      anio : [''],
      chasis : [''],
      numeroMovil : [''],
      color : [''],
    });

    this.actualizarServicios();
  }

  actualizarServicios(){
    this.mS.get().subscribe(
      (movil) => {
        this.moviles = movil;
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

  agregar() {
    this.formulario.reset();
    this.movilSelected = new MovilG();
    this.mostrarGrilla = true;
    this.mostrarAgregar = true;
  }

  editar(seleccionado: MovilG) {
    this.mostrarEditar = true;
    this.mostrarGrilla = true;
    this.mostrarMovil = false;
    this.movilSelected = seleccionado;
    this.mS.odometro = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  editarMovil(){
    this.mostrarMovil = true;
    this.mostrarEditar = false;
    this.formulario.setValue(this.movilSelected);
  }

  modificar(seleccionado: MovilG) {
    this.mostrarManten = true;
    this.mostrarGrilla = true;
    this.movilSelected = seleccionado;
    this.mS.odometro = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  borrar(fila: MovilG) {
        this.mS.delete(fila.moviId)
          .subscribe(() => {
            this.moviles = this.moviles.filter((movil) => {
              if (movil.moviId != fila.moviId) {
                return true
              } else {
                return false
              }
            });
            this.actualizar();
          });
  }

  guardar() {
    if (!this.formulario.valid) {
      return;
    }

    Object.assign(this.movilSelected, this.formulario.value);

    this.mS.put(this.movilSelected).subscribe((movil) => {
      this.mostrarMovil = false;
    });

    this.mostrarGrilla = false;
  }

  agregarOdometro(seleccionado : MovilG) {
    this.movil.moviId = seleccionado.moviId;
   
    }

  volver(){
      this.mostrarMovil = false;
      this.mostrarEditar = true;
  }
  
  volverGrilla(){
    this.mostrarEditar = false;
    this.mostrarManten = false;
    this.mostrarAgregar = false;
    this.mostrarGrilla = false;
    this.actualizar();
  }

  cancelar() {
    
  

    this.actualizarServicios(); 
    
    this.mostrarEditar = false;
    this.mostrarManten = false;
    this.mostrarAgregar = false;
    this.mostrarGrilla = false;
    this.actualizar();
  }
 


}
