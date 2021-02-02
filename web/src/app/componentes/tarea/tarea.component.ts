import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Tarea } from 'src/app/modelo/tarea';
import { TareaService } from 'src/app/servicios/tarea.service';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css']
})
export class TareaComponent implements OnInit, AfterViewInit {

  constructor(public tS : TareaService, public formBuilder : FormBuilder) { }

  tareas : Tarea [] = [];
  columnas: string[] = ['tareNombre', 'tareDescripcion','tareUnidadMedida', 'tareCantidad', 'tareCosto', 'acciones'];
  dataSource = new MatTableDataSource<Tarea>();
  
  formulario = new FormGroup({});
  mostrarFormulario = false;

  @ViewChild(MatSort) sort! : MatSort;

  tareaSeleccted = new Tarea();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      tareId: [''],
      tareNombre: ['', Validators.required],
      tareDescripcion: ['', Validators.required],
      tareUnidadMedida: ['', Validators.required],
      tareCantidad: ['', Validators.required],
      tareCosto: [''],
      tareBorrado: [''],
      tareFechaAlta: ['']
    });

    this.tS.get().subscribe(
      (tareas) => {
        this.tareas = tareas;
        this.actualizar();
      }
    )
  }

  actualizar(){
   this.dataSource.data = this.tareas;
   this.dataSource.sort = this.sort;
  }

  agregar() {
    this.formulario.reset();
    this.tareaSeleccted = new Tarea();
    this.mostrarFormulario = true;
  }

  editar(seleccionado: Tarea) {
    this.mostrarFormulario = true;
    this.tareaSeleccted = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  borrar(fila: Tarea) {
        this.tS.delete(fila.tareId)
          .subscribe(() => {
            this.tareas = this.tareas.filter((grupo) => {
              if (grupo.tareId != fila.tareId) {
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

    Object.assign(this.tareaSeleccted, this.formulario.value);

    if (this.tareaSeleccted.tareId) {
      this.tS.put(this.tareaSeleccted)
        .subscribe((servicio) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.tS.post(this.tareaSeleccted)
        .subscribe((tarea) => {
          this.tareas.push(tarea);
          this.mostrarFormulario = false;
          this.actualizar();
        });

    }

  }

  cancelar() {
    this.mostrarFormulario = false;
  }


}
