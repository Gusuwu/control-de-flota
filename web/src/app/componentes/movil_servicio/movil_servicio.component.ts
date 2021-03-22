import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MovilServicio } from 'src/app/modelo/movil_servicio';
import { Servicio } from 'src/app/modelo/servicio';
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
  @Input() moviId: number = 0;

  movilservicio: MovilServicio[] = [];
  seleccionado = new MovilServicio();
  variable = true;

  columnas: string[] = ['moseId', 'servNombre' ,'moseServId', 'moseMoviId', 'mosePeriodo', 'moseKM', 'moseFecha', 'acciones'];
  dataSource = new MatTableDataSource<MovilServicio>();


  form = new FormGroup({});
  mostrarGrilla = false;
  mostrarFormulario = false;
  mostrarBitacora= false;

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
        moseMoviId: [''],
        moseServId: [''],
        mosePeriodo: [''],
        moseKM: [''],
        moseFecha: [''],
        moseFechaAlta: [''],
        moseBorrado: [''],
        servNombre: [''],
    });

    this.msService.get(`moseMoviId=${this.moviId}`).subscribe(
      (ms) => {
        this.movilservicio = ms;
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
    this.dataSource.data = this.movilservicio;
  }

  agregar() {
    this.seleccionado = new MovilServicio();
    this.form.setValue(this.seleccionado)
    this.mostrarFormulario = true;
  }

  delete(fila: MovilServicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        this.msService.delete(fila.moseId)
        .subscribe(() => {
          this.movilservicio = this.movilservicio.filter((movilservicio) => {
            if (movilservicio.moseId != fila.moseId) {
              return true
            } else {
              return false
            }
          });
          this.actualizarTabla(); 
        });
      }

      });
  }

  realizar(seleccionado: MovilServicio){
    this.msService.moseSeleccionado = seleccionado;
    this.mostrarBitacora = true;
    this.mostrarGrilla = true;
    this.seleccionado = seleccionado;
  }

  editar(seleccionado: MovilServicio) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado; 
    this.form.setValue(seleccionado);

  }

  volver(){
    this.mostrarBitacora = false;
    this.mostrarGrilla = false;
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    this.seleccionado.moseServId = this.servicios.find(grupo => grupo.servId == this.seleccionado.moseServId)!.servId;
    this.seleccionado.servNombre = this.servicios.find(grupo => grupo.servId == this.seleccionado.moseServId)!.servNombre;
    this.seleccionado.mosePeriodo = this.servicios.find(servicio  => servicio.servId == this.seleccionado.moseServId)!.servPeriodo;
    this.seleccionado.moseKM = this.servicios.find(servicio  => servicio.servId == this.seleccionado.moseServId)!.servKM;
    this.seleccionado.moseFecha = this.servicios.find(servicio  => servicio.servId == this.seleccionado.moseServId)!.servFecha;

    if(this.seleccionado.moseId){
      this.msService.put(this.seleccionado).subscribe((movilservicio)=>{
        this.mostrarFormulario = false;
      });
    }else{
      this.msService.post(this.seleccionado)
        .subscribe((movilservicio) => {
          this.movilservicio.push(movilservicio);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });
    }
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}