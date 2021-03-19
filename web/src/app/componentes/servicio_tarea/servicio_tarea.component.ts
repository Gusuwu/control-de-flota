import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ServicioTarea } from 'src/app/modelo/servicio_tarea';
import { Tarea } from 'src/app/modelo/tarea';
import { ServicioTareaService } from 'src/app/servicios/servicio_tarea';
import { TareaService } from 'src/app/servicios/tarea.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { DatosService } from 'src/app/shared/datos/datos.service';



@Component({
  selector: 'app-servicio-tarea',
  templateUrl: './servicio_tarea.component.html',
  styleUrls: ['./servicio_tarea.component.css']
})
export class ServicioTareaComponent implements OnInit {

  @Input() servId: number = 0;

  serviciotareas: ServicioTarea[] = [];
  seleccionado = new ServicioTarea();

  columnas: string[] = ['tareNombre', 'tareDescripcion', 'tareUnidadMedida', 'tareCantidad', 'tareCosto', 'setaServId', 'setaTareId', 'acciones'];
  dataSource = new MatTableDataSource<ServicioTarea>();


  form = new FormGroup({});
  mostrarFormulario = false;

  tareas: Tarea[] = [];
  idAux: number = -1;


  seleccionadoSelect : number = 0;
  descripcion : string = "";
  medida : string = "";
  cantidad : number = 0;
  costo : number = 0;
  

  constructor(private servicioTareaService: ServicioTareaService,
    private tareaService: TareaService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datosService: DatosService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      setaId: [''],
      setaServId: [''],
      setaTareId: ['', Validators.required],
      setaBorrado: [''],
      setaFechaAlta: [''],
      tareNombre: [''],
      tareDescripcion: [''],
      tareUnidadMedida: [''],
      tareCantidad: [''],
      tareCosto: [''],
    });

    this.servicioTareaService.get(`setaServId=${this.servId}`).subscribe(
      (servicioTarea) => {
        this.datosService.sertar = servicioTarea;
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
    this.dataSource.data = this.datosService.sertar.filter(borrado => borrado.setaBorrado==false);
  }

  agregar() {

    this.idAux--;
    this.seleccionado = new ServicioTarea();
    this.seleccionado.setaId = this.idAux;

    this.form.setValue(this.seleccionado)

    this.mostrarFormulario = true;
  }

  delete(fila: ServicioTarea) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        fila.setaBorrado = true;
        this.actualizarTabla();
      }

    });
  }

  editar(seleccionado: ServicioTarea) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    
    this.form.setValue(seleccionado);

  }

  mostrarValores(){
      this.descripcion = this.tareas.find(tarea => tarea.tareId == this.seleccionadoSelect)!.tareDescripcion;
      this.medida = this.tareas.find(tarea => tarea.tareId == this.seleccionadoSelect)!.tareUnidadMedida;
      this.cantidad = this.tareas.find(tarea => tarea.tareId == this.seleccionadoSelect)!.tareCantidad;
      this.costo = this.tareas.find(tarea => tarea.tareId == this.seleccionadoSelect)!.tareCosto;
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    this.seleccionado.tareNombre = this.tareas.find(tarea => tarea.tareId == this.seleccionado.setaTareId)!.tareNombre;
    this.seleccionado.tareDescripcion = this.tareas.find(tarea => tarea.tareId == this.seleccionado.setaTareId)!.tareDescripcion;
    this.seleccionado.tareUnidadMedida = this.tareas.find(tarea => tarea.tareId == this.seleccionado.setaTareId)!.tareUnidadMedida;
    this.seleccionado.tareCantidad = this.tareas.find(tarea => tarea.tareId == this.seleccionado.setaTareId)!.tareCantidad;
    this.seleccionado.tareCosto = this.tareas.find(tarea => tarea.tareId == this.seleccionado.setaTareId)!.tareCosto;

    if(this.seleccionado.setaId > 0){
      const elemento = this.serviciotareas.find(sertar => sertar.setaId == this.seleccionado.setaId);
      this.serviciotareas.splice(this.seleccionado.setaId, 1, elemento!);
    }else{
      this.datosService.sertar.push(this.seleccionado);
    }

    this.mostrarFormulario=false;
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}