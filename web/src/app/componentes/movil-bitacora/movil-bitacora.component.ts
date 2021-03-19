import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Grupo } from 'src/app/modelo/grupo';
import { GrupoServicio } from 'src/app/modelo/grupo_servicio';
import { MovilBitacora } from 'src/app/modelo/movil_bitacora';
import { MovilGrupo } from 'src/app/modelo/movil_grupo';
import { MovilServicio } from 'src/app/modelo/movil_servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { GrupoService } from 'src/app/servicios/grupo.service';
import { GrupoServicioService } from 'src/app/servicios/grupo_servicio.service';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';
import { MovilBitacoraService } from 'src/app/servicios/movil_bitacora.service';
import { MovilGrupoService } from 'src/app/servicios/movil_grupo.service';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { DatosService } from 'src/app/shared/datos/datos.service';



@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() moviId: number = 0;
  @Input() mostrarForm :boolean = false;
  @Input() mostrarTabla : boolean = false;

  movilbitacora: MovilBitacora[] = [];
  seleccionado = new MovilBitacora();
  

  columnas: string[] = ['mobiId', 'mobiMoviId', 'mobiMoseId','mobiFecha', 'mobiObservaciones', 'mobiOdometro', 'acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();


  form = new FormGroup({});
  mostrarFormulario = false;
  mostrarGrilla = false;

  constructor(private movilBitacoraService: MovilBitacoraService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
   ) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
        mobiId: [''],
        mobiMoviId: [''],
        mobiMoseId: ['', Validators.required],
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
    });

    this.movilBitacoraService.get(`mobiMoviId=${this.moviId}`).subscribe(
      (bitacora) => {
        this.movilbitacora = bitacora;
        this.actualizarTabla();
      }
    );
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

  }


  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if(this.seleccionado.mobiId){
      this.movilBitacoraService.put(this.seleccionado).subscribe((bitacora)=>{
        this.mostrarFormulario = false;
      });

    }else{
      this.movilBitacoraService.post(this.seleccionado)
        .subscribe((bitacora) => {
          this.movilbitacora.push(bitacora);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });
      
    }
   
  }
  cancelar() {
    this.mostrarFormulario = false;
    this.mostrarGrilla = false;

  }


}