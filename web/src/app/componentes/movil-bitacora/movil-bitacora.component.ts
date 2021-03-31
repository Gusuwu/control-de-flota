import { Component, Input, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { getMatFormFieldDuplicatedHintError } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { audit } from 'rxjs/operators';
import { BitacoraTarea } from 'src/app/modelo/bitacora-tarea';
import { Grupo } from 'src/app/modelo/grupo';
import { GrupoServicio } from 'src/app/modelo/grupo_servicio';
import { MovilG } from 'src/app/modelo/movil-grilla';
import { MovilBitacora } from 'src/app/modelo/movil_bitacora';
import { MovilGrupo } from 'src/app/modelo/movil_grupo';
import { MovilServicio } from 'src/app/modelo/movil_servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { ServicioTarea } from 'src/app/modelo/servicio_tarea';
import { BitacoraTareaService } from 'src/app/servicios/bitacora-tarea.service';
import { GrupoService } from 'src/app/servicios/grupo.service';
import { GrupoServicioService } from 'src/app/servicios/grupo_servicio.service';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';
import { MovilBitacoraService } from 'src/app/servicios/movil_bitacora.service';
import { MovilGrupoService } from 'src/app/servicios/movil_grupo.service';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ServicioTareaService } from 'src/app/servicios/servicio_tarea';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { DatosService } from 'src/app/shared/datos/datos.service';



@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() moviId: number = 0;
  @Input() moseId: number = 0;
  @Input() servId: number = 0;
  @Input() mostrarForm :boolean = false;
  @Input() mostrarTabla : boolean = false;

  movilbitacora: MovilBitacora[] = [];
  moviles : MovilG[] = [];
  serviciostareas : ServicioTarea[] = [];
  seleccionado = new MovilBitacora();
  bitacoratarea = new BitacoraTarea();
  bitacorastareas : BitacoraTarea[] = [];

  idAux: number = -1;
  edit : number = 0;
  

  columnas: string[] = ['servNombre','mobiIdAnterior','mobiIdSiguiente','mobiFecha', 'mobiObservaciones','mobiProximoOdometro','mobiProximaFecha','mobiOdometro','mobiPendiente', 'acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();


  form = new FormGroup({});
  mostrarFormulario = false;
  mostrarGrilla = false;
  mostrarTarea = false;

  constructor(private movilBitacoraService: MovilBitacoraService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public movilService : MovilGService,
    public movilservicioService : MovilServicioService,
    public servicioTareasService : ServicioTareaService,
    public bitacoraTareaService : BitacoraTareaService
   ) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
        mobiId: [''],
        mobiMoviId: [''],
        mobiMoseId: [''],
        mobiServId: [''],
        mobiFecha: [''],
        mobiObservaciones: [''],
        mobiOdometro: [''],
        mobiProximoOdometro: [''],
        mobiProximaFecha: [''],
        mobiIdAnterior: [''],
        mobiIdSiguiente: [''],
        mobiPendiente: [''],
        mobiFechaAlta: [''],
        mobiBorrado: [''],
        servNombre: [''],
    });

    this.movilBitacoraService.get(`mobiMoviId=${this.moviId}`).subscribe(
      (bitacora) => {
        this.movilbitacora = bitacora;
        this.actualizarTabla();
      }
    );

    this.bitacoraTareaService.get().subscribe(
      (bita) => {
        this.bitacorastareas = bita;
        this.actualizarTabla();
      }
    );
   
    this.movilService.get(`moviId=${this.moviId}`).subscribe(
      (bitacora) => {
        this.moviles = bitacora;
        this.actualizarTabla();
      }
    );

    this.servicioTareasService.get().subscribe((tareas)=> {
      this.serviciostareas=tareas;
    })

  }

  actualizarTabla() {
    this.dataSource.data = this.movilbitacora;
  }

  actualizar(){
    this.dataSource.data = this.movilBitacoraService.moviBita.filter(borrado => borrado.mobiBorrado==false);
  }

  agregar() {
    this.mostrarGrilla = true;
    this.mostrarTabla = true;
    this.seleccionado = new MovilBitacora();
    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  }

  delete(fila: MovilBitacora) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        this.movilBitacoraService.delete(fila.mobiId)
        .subscribe(() => {
          this.movilbitacora = this.movilbitacora.filter((bitacora) => {
            if (bitacora.mobiId != fila.mobiId) {
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

  editar(seleccionado: MovilBitacora) {
    this.mostrarFormulario = true;
    this.mostrarGrilla = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
    this.edit = 1;
  }

  realizar(seleccionado: MovilBitacora){
    this.mostrarGrilla = true;
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
    this.edit = 0;
  }

  tareas(seleccionado: MovilBitacora){
    this.mostrarTarea = true;
    this.mostrarGrilla = true;
    this.seleccionado = seleccionado;
  }

  volver(){
    this.mostrarTarea = true;
    this.mostrarGrilla = true;
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    this.idAux--;

    Object.assign(this.seleccionado, this.form.value);
    let id: number;
    let fechaaux : Date = new Date();

    fechaaux.setDate(this.seleccionado.mobiFecha.getDate() + this.movilservicioService.moseSeleccionado.mosePeriodo)

    this.seleccionado.mobiMoviId = this.moviId;
    this.seleccionado.mobiMoseId = this.moseId;
    this.seleccionado.mobiServId = this.servId;
    this.seleccionado.mobiOdometro = this.movilService.odometro.moviModoOdometro;
    this.seleccionado.mobiProximoOdometro = this.movilservicioService.moseSeleccionado.moseKM + this.seleccionado.mobiOdometro;
    this.seleccionado.mobiProximaFecha = fechaaux;
    this.seleccionado.mobiPendiente = true;


    if(this.seleccionado.mobiId){
      if(this.edit == 0){
        //this.seleccionado.mobiPendiente = false; 
        let idanterior = this.movilbitacora.find(bita => bita.mobiId < this.seleccionado.mobiId);
        if(idanterior!.mobiId > 0 || idanterior!.mobiId != null){
          this.seleccionado.mobiIdAnterior = idanterior!.mobiId;
          idanterior!.mobiIdSiguiente = this.seleccionado.mobiId;
          idanterior!.mobiPendiente = false;
          this.movilBitacoraService.put(idanterior!).subscribe((bitacora)=>{
            this.mostrarFormulario = false;
          });
        }else{
          this.seleccionado.mobiIdAnterior = 0;
        }
      }
      this.movilBitacoraService.put(this.seleccionado).subscribe((bitacora)=>{
        this.mostrarFormulario = false;
          this.mostrarGrilla = false;
      });

    }else{
      
      this.movilBitacoraService.post(this.seleccionado)
        .subscribe((bitacora) => {
          this.movilbitacora.push(bitacora);
          let aux = this.serviciostareas.filter(tarea => tarea.setaServId == this.seleccionado.mobiServId);

          let length = aux.length;

          for(let i = 0; i <= length; i++ ){

              this.bitacoratarea.bitaId = this.idAux;
              this.bitacoratarea.bitaMobiId = +bitacora.mobiId;
              this.bitacoratarea.bitaTareId = aux[i].setaTareId;
              this.bitacoratarea.bitaCantidad = aux[i].tareCantidad;
              this.bitacoratarea.bitaCosto = aux[i].tareCosto;

              this.bitacoraTareaService.tareas.push(this.bitacoratarea);
          }
          
          this.actualizarTabla();
          this.insertarTareas(this.bitacoratarea.bitaMobiId);
          
          alert("Bitacora insertada con exito!");
          this.mostrarFormulario = false;
          this.mostrarGrilla = false;
         
        });
        
    }
     
  }

  //`bitaMobiId=${seleccionado.mobiId}`

  insertarTareas(id : number){
    this.bitacoraTareaService.tareas.forEach( (dato) => { 

      dato.bitaMobiId = id;

     if(dato.bitaBorrado){
           this.bitacoraTareaService.delete(dato.bitaId).subscribe();
         }else if(dato.bitaId < 0){
           this.bitacoraTareaService.post(dato).subscribe();
         }else (dato.bitaId > 0 )
           this.bitacoraTareaService.put(dato).subscribe();
       }
     );
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.mostrarGrilla = false;
  }


}