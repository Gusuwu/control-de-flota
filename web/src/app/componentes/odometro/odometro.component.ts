import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MovilG } from 'src/app/modelo/movil-grilla';
import { MovilOdometro } from 'src/app/modelo/odometro';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';
import { MovilOdometroService } from 'src/app/servicios/odometro.service';
import { AlertaComponent } from 'src/app/shared/alerta/alerta.component';
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
    
    this.ms.odometro.moviId = this.seleccionado.modoMoviId;
    this.ms.odometro.moviModoOdometro = this.seleccionado.modoOdometro;
    this.ms.odometro.moviModoFecha = this.seleccionado.modoFecha;
    
    const elemento = this.odometros.find(odo => odo.modoMoviId == this.seleccionado.modoMoviId)!.modoOdometro;

    if(elemento > this.seleccionado.modoOdometro){
      this.dialog.open(AlertaComponent);
    }else if (this.seleccionado.modoOdometro >= 1000){
        const dialogRef = this.dialog.open(ConfirmarComponent);

        dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);

        if(result){
          if(this.seleccionado.modoId){
            this.odometroService.put(this.seleccionado).subscribe((movilodometro)=>{
            this.mostrarFormulario = false;
            });
          }else{
            this.odometroService.post(this.seleccionado)
            .subscribe((movilodometro) => {
              this.odometros.push(movilodometro);
              this.mostrarFormulario = false;
              this.actualizarTabla();
            });
          }
       
        }

      });
      
    }else{
      if(this.seleccionado.modoId){
        this.odometroService.put(this.seleccionado).subscribe((movilodometro)=>{
        this.mostrarFormulario = false;
        });
      }else{
        this.odometroService.post(this.seleccionado)
        .subscribe((movilodometro) => {
          this.odometros.push(movilodometro);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });
      }
    }
    this.actualizarTabla();
  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}