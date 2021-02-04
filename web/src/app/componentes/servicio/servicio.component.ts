import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Servicio } from 'src/app/modelo/servicio';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { DatosService } from 'src/app/shared/datos/datos.service';
import { ServicioTareaService } from 'src/app/servicios/servicio_tarea';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit, AfterViewInit {

  constructor(public sS : ServicioService, public formBuilder : FormBuilder, public datosService: DatosService, public stService : ServicioTareaService) { }

  servicios : Servicio [] = [];
  columnas: string[] = ['servNombre', 'servDescripcion','servPeriodo', 'servKM', 'servFecha', 'acciones'];
  dataSource = new MatTableDataSource<Servicio>();
  
  formulario = new FormGroup({});
  mostrarFormulario = false;

  @ViewChild(MatSort) sort! : MatSort;

  servicioSelected = new Servicio();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      servId: [''],
      servDescripcion: ['', Validators.required],
      servNombre: ['', Validators.required],
      servPeriodo: ['', Validators.required],
      servKM: ['', Validators.required],
      servFecha: [''],
      servBorrado: [''],
      servFechaAlta: ['']
    });

    this.sS.get().subscribe(
      (servicios) => {
        this.servicios = servicios;
        this.actualizar();
      }
    )
  }

  mostrarServicio():Boolean{
    if(this.servicioSelected.servId){
      return this.mostrarFormulario = true;
    }else{
      return this.mostrarFormulario = false;
    }
  }

  actualizar(){
   this.dataSource.data = this.servicios;
   this.dataSource.sort = this.sort;
  }

  actualizarST(id : number){
    this.datosService.sertar.forEach( (dato) => { dato.setaServId = id;
      if(dato.setaBorrado){
        this.stService.delete(dato.setaId).subscribe();
      }else if(dato.setaId < 0){
        this.stService.post(dato).subscribe();
      }else (dato.setaId > 0 )
        this.stService.put(dato).subscribe();
      }
   );
    this.actualizar();
    this.mostrarFormulario = false;
  }

  agregar() {
    this.formulario.reset();
    this.servicioSelected = new Servicio();
    this.mostrarFormulario = true;
  }

  editar(seleccionado: Servicio) {
    this.mostrarFormulario = true;
    this.servicioSelected = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  borrar(fila: Servicio) {
        this.sS.delete(fila.servId)
          .subscribe(() => {
            this.servicios = this.servicios.filter((grupo) => {
              if (grupo.servId != fila.servId) {
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

    Object.assign(this.servicioSelected, this.formulario.value);

    if (this.servicioSelected.servId) {
      this.sS.put(this.servicioSelected)
        .subscribe((servicio) => {
          this.actualizarST(servicio.servId);
          //this.mostrarFormulario = false;
        });

    } else {
      this.sS.post(this.servicioSelected)
        .subscribe((servicio) => {
          this.servicios.push(servicio);
          this.actualizarST(servicio.servId);
          //this.mostrarFormulario = false;
          //this.actualizar();
        });

    }

  }

  cancelar() {
    this.mostrarFormulario = false;
  }


}
