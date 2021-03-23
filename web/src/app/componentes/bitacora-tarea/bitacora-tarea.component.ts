import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BitacoraTarea } from 'src/app/modelo/bitacora-tarea';

import { Tarea } from 'src/app/modelo/tarea';
import { BitacoraTareaService } from 'src/app/servicios/bitacora-tarea.service';

import { TareaService } from 'src/app/servicios/tarea.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';




@Component({
  selector: 'app-servicio-tarea',
  templateUrl: './servicio_tarea.component.html',
  styleUrls: ['./servicio_tarea.component.css']
})
export class BitacoraTareaComponent implements OnInit {

  @Input() mobiId: number = 0;

  bitacoratareas: BitacoraTarea[] = [];
  seleccionado = new BitacoraTarea();

  columnas: string[] = ['tareNombre', 'tareDescripcion', 'tareUnidadMedida', 'tareCantidad', 'tareCosto', 'setaServId', 'setaTareId', 'acciones'];
  dataSource = new MatTableDataSource<BitacoraTarea>();


  form = new FormGroup({});
  mostrarFormulario = false;

  tareas: Tarea[] = [];

  constructor(private bitacoraTareaService: BitacoraTareaService,
    private tareaService: TareaService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
        bitaId: [''],
        bitaMobiId: [''],
        bitaTareId: [''],
        bitaObservaciones: [''],
        bitaCantidad: [''],
        bitaCosto: [''],
        bitaFechaAlta: [''],
        bitaBorrado: [''],
     
    });

    this.bitacoraTareaService.get(`bitaMobiId=${this.mobiId}`).subscribe(
      (tareas) => {
        this.bitacoratareas = tareas;
        this.actualizarTabla();
      }
    );

    this.tareaService.get().subscribe(
      (productos) => {
        this.tareas = productos;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.bitacoratareas;
  }

  agregar() {
   
    this.seleccionado = new BitacoraTarea();
    this.form.setValue(this.seleccionado)
    this.mostrarFormulario = true;
  }

  delete(fila: BitacoraTarea) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        fila.bitaBorrado = true;
        this.actualizarTabla();
      }

    });
  }

  editar(seleccionado: BitacoraTarea) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    
    this.form.setValue(seleccionado);

  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if(this.seleccionado.bitaId > 0){
      
    }else{
      
    }

    this.mostrarFormulario=false;
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}