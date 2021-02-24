import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';
import { DatosService } from 'src/app/shared/datos/datos.service';
import { MovilGrupoService } from 'src/app/servicios/movil_grupo.service';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';


@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit, AfterViewInit {

  constructor(public mS : MovilService, public formBuilder : FormBuilder, public datosService : DatosService, public mgService : MovilGrupoService, public msService: MovilServicioService) { }

  moviles : Movil [] = [];
  columnas: string[] = ['moviId', 'moviModoFecha','moviModoOdometro', 'acciones'];
  dataSource = new MatTableDataSource<Movil>();
  
  formulario = new FormGroup({});
  mostrarFormulario = false;
  mostrarForm = false;

  @ViewChild(MatSort) sort! : MatSort;

  movilSelected = new Movil();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      moviId: [''],
      moviModoFecha: ['', Validators.required],
      moviModoOdometro: ['', Validators.required],
      moviBorrado: [''],
      moviFechaAlta: ['']
    });

    this.mS.get().subscribe(
      (movil) => {
        this.moviles = movil;
        this.actualizar();
      }
    )
  }

  actualizar(){
   this.dataSource.data = this.moviles;
   this.dataSource.sort = this.sort;
  }

  actualizarMG(id : number){
    this.datosService.movgru.forEach( (dato) => { dato.mogrMoviId = id;
      if(dato.mogrBorrado){
        this.mgService.delete(dato.mogrId).subscribe();
      }else if(dato.mogrId < 0){
        this.mgService.post(dato).subscribe();
      }else (dato.mogrId > 0 )
        this.mgService.put(dato).subscribe();
      }
   );
    this.actualizar();
    this.mostrarFormulario = false;
  }

  actualizarMS(id : number){
    this.datosService.movser.forEach( (dato) => { dato.moseServId = id;
      if(dato.moseBorrado){
        this.msService.delete(dato.moseId).subscribe();
      }else if(dato.moseId < 0){
        this.msService.post(dato).subscribe();
      }else (dato.moseId > 0 )
        this.msService.put(dato).subscribe();
      }
   );
    this.actualizar();
    this.mostrarForm = false;
  }

  agregar() {
    this.formulario.reset();
    this.movilSelected = new Movil();
    this.mostrarFormulario = true;
  }

  editar(seleccionado: Movil) {
    this.mostrarFormulario = true;
    this.movilSelected = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  modificar(seleccionado: Movil) {
    this.mostrarForm = true;
    this.movilSelected = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  borrar(fila: Movil) {
        this.mS.delete(fila.moviId)
          .subscribe(() => {
            this.moviles = this.moviles.filter((movil) => {
              if (movil.moviId != fila.moviId) {
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

    Object.assign(this.movilSelected, this.formulario.value);

    if (this.movilSelected.moviId) {
      this.mS.put(this.movilSelected)
        .subscribe((movil) => {
          this.actualizarMG(movil.moviId);
          this.actualizarMS(movil.moviId);
        });

    } else {
      this.mS.post(this.movilSelected)
        .subscribe((movil) => {
          this.moviles.push(movil);
          this.mostrarFormulario = false;
          this.actualizarMG(movil.moviId);
          this.actualizarMS(movil.moviId);
        });

    }

  }

  cancelar() {
    this.mostrarFormulario = false;
  }


}
