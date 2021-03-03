import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DatosService } from 'src/app/shared/datos/datos.service';
import { MovilGrupoService } from 'src/app/servicios/movil_grupo.service';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { MovilG } from 'src/app/modelo/movil-grilla';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';


@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilGComponent implements OnInit, AfterViewInit {

  constructor(public mS : MovilGService, public formBuilder : FormBuilder, public mgService : MovilGrupoService, public msService: MovilServicioService) { }

  moviles : MovilG [] = [];
  columnas: string[] = ['moviId', 'moviModoFecha','moviModoOdometro', 'acciones'];
  dataSource = new MatTableDataSource<MovilG>();
  
  formulario = new FormGroup({});
  mostrarEditar = false;
  mostrarManten = false;
  mostrarGrilla = false;
  mostrarAgregar = false;

  @ViewChild(MatSort) sort! : MatSort;

  movilSelected = new MovilG();

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
      moviFechaAlta: [''],
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
    this.mS.movgru.forEach( (dato) => { dato.mogrMoviId = id;
      if(dato.mogrBorrado){
        this.mgService.delete(dato.mogrId).subscribe();
      }else if(dato.mogrId < 0){
        this.mgService.post(dato).subscribe();
      }else (dato.mogrId > 0 )
        this.mgService.put(dato).subscribe();
      }
   );
    this.actualizar();
    this.mostrarEditar = false;
  }

  agregar() {
    this.formulario.reset();
    this.movilSelected = new MovilG();
    this.mostrarGrilla = true;
    this.mostrarAgregar = true;
  }

  editar(seleccionado: MovilG) {
    this.mostrarEditar = true;
    this.mostrarGrilla = true;
    this.movilSelected = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  modificar(seleccionado: MovilG) {
    this.mostrarManten = true;
    this.mostrarGrilla = true;
    this.movilSelected = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  borrar(fila: MovilG) {
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

    this.mostrarGrilla = false;
  }

  cancelar() {
    this.mostrarEditar = false;
    this.mostrarManten = false;
    this.mostrarAgregar = false;
    this.mostrarGrilla = false;
    this.actualizar();
  }


}
