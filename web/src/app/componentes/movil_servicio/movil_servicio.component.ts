import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MovilServicio } from 'src/app/modelo/movil_servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { ServicioTarea } from 'src/app/modelo/servicio_tarea';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { DatosService } from 'src/app/shared/datos/datos.service';



@Component({
  selector: 'app-movil-servicio',
  templateUrl: './movil_servicio.component.html',
  styleUrls: ['./movil_servicio.component.css']
})
export class MovilServicioComponent implements OnInit {

  @Input() servId: number = 0;

  movilserivicio: MovilServicio[] = [];
  seleccionado = new MovilServicio();

  columnas: string[] = ['moseId', 'moseServId', 'mosePeriodo', 'moseKM', 'moseFecha', 'acciones'];
  dataSource = new MatTableDataSource<ServicioTarea>();


  form = new FormGroup({});
  mostrarFormulario = false;

  servicios: Servicio[] = [];
  idAux: number = -1;
  

  constructor(private msService: MovilServicioService,
    private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datosService: DatosService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
        moseId: [''],
        moseServId: [''],
        mosePeriodo: [''],
        moseKM: [''],
        moseFechaAlta: [''],
        moseBorrado: [''],
    });

    this.msService.get(`moseServId=${this.servId}`).subscribe(
      (ms) => {
        this.datosService.movser = ms;
        this.actualizarTabla();
      }
    );

    this.servicioService.get().subscribe(
      (servicio) => {
        this.servicios = servicio;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.datosService.sertar.filter(borrado => borrado.setaBorrado==false);
  }

  agregar() {

    this.idAux--;
    this.seleccionado = new MovilServicio();
    this.seleccionado.moseId = this.idAux;

    this.form.setValue(this.seleccionado)

    this.mostrarFormulario = true;
  }

  delete(fila: MovilServicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        fila.moseBorrado = true;
        this.actualizarTabla();
      }

    });
  }

  editar(seleccionado: MovilServicio) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    
    this.form.setValue(seleccionado);

  }


  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if(this.seleccionado.moseId > 0){
      const elemento = this.movilserivicio.find(sertar => sertar.moseId == this.seleccionado.moseId);
      this.movilserivicio.splice(this.seleccionado.moseId, 1, elemento!);
    }else{
      this.datosService.movser.push(this.seleccionado);
    }

    this.mostrarFormulario=false;
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}