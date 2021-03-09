import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MovilG } from 'src/app/modelo/movil-grilla';
import { MovilOdometro } from 'src/app/modelo/odometro';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';
import { MovilOdometroService } from 'src/app/servicios/odometro.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { DatosService } from 'src/app/shared/datos/datos.service';



@Component({
  selector: 'app-movil-odometro',
  templateUrl: './odometro.component.html',
  styleUrls: ['./odometro.component.css']
})
export class MovilOdometroComponent implements OnInit {

  @Input() moviId: number = 0;

  odometros: MovilOdometro[] = [];
  seleccionado = new MovilOdometro();

  columnas: string[] = ['modoId', 'modoMoviId', 'modoFecha', 'modoOdometro', 'acciones'];
  dataSource = new MatTableDataSource<MovilOdometro>();


  form = new FormGroup({});
  mostrarFormulario = false;

  moviles : MovilG[] = [];
  movil = new MovilG();

  constructor(private odometroService: MovilOdometroService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datosService: DatosService,
    public ms : MovilGService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      modoId: [''],
      modoMoviId: [''],
      modoFecha: ['', Validators.required],
      modoBorrado: [''],
      modoFechaAlta: [''],
      modoOdometro: [''],
    });

    this.odometroService.get(`modoMoviId=${this.moviId}`).subscribe(
      (odometro) => {
        this.odometros = odometro;
        this.actualizarTabla();
      }
    );

    this.ms.get().subscribe(
        (movil) => {
          this.moviles = movil;
        }
      )



  }

  actualizarTabla() {
    this.dataSource.data = this.odometros;
  }


  agregar() {
    this.seleccionado = new MovilOdometro();
    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  }

  delete(fila: MovilOdometro) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        this.odometroService.delete(fila.modoId)
        .subscribe(() => {
          this.odometros = this.odometros.filter((movilgrupo) => {
            if (movilgrupo.modoId != fila.modoId) {
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

  editar(seleccionado: MovilOdometro) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    
    this.form.setValue(seleccionado);

  }


  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if(this.seleccionado.modoId){
      this.odometroService.put(this.seleccionado).subscribe((movilgrupo)=>{
        this.mostrarFormulario = false;
      });
    }else{
      this.odometroService.post(this.seleccionado)
        .subscribe((movilgrupo) => {
          this.odometros.push(movilgrupo);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });
    }
    
    this.movil.moviId = this.moviId;
    this.movil.moviModoOdometro = this.odometros.find(servicio => servicio.modoMoviId == this.movil.moviId)!.modoOdometro;
    this.movil.moviModoFecha = this.odometros.find(servicio => servicio.modoMoviId == this.movil.moviId)!.modoFecha;

    if(this.movil.moviId){

    const pos = this.moviles.findIndex(movil => movil.moviId == this.movil.moviId);

    this.ms.put(this.movil).subscribe((movil) => {
      this.moviles.splice(pos!, 1, this.movil);
      this.ms.id = this.movil.moviId;
      this.ms.odometro = this.movil.moviModoOdometro;
      this.ms.fecha = this.movil.moviModoFecha;               
    });

    }
   
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}