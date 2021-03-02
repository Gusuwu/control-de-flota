import { AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';
import { DatosService } from 'src/app/shared/datos/datos.service';
import { MovilGrupoService } from 'src/app/servicios/movil_grupo.service';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { MovilG } from 'src/app/modelo/movil-grilla';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';


@Component({
  selector: 'app-movil-avl',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit, AfterViewInit {

  constructor(public mS : MovilService, public msG: MovilGService, public formBuilder : FormBuilder, public datosService : DatosService, public mgService : MovilGrupoService, public movilgService : MovilGService, public msService: MovilServicioService) { }

  //@Input() moviId : number = 0;

  moviles : Movil [] = [];
  movilesG : MovilG [] = [];
  columnas: string[] = ['movilID', 'patente','descripcion', 'dependencia', 'acciones'];
  dataSource = new MatTableDataSource<Movil>();
  
  formulario = new FormGroup({});
  mostrarFormulario = false;
  mostrarForm = false;

  @ViewChild(MatSort) sort! : MatSort;

  movilSelected = new Movil();

  movil = new MovilG();

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

    this.msG.get().subscribe(
        (movil) => {
          this.movilesG = movil;
          this.actualizar();
        }
      )
  }

  actualizar(){
   this.dataSource.data = this.moviles;
   this.dataSource.sort = this.sort;
  }


  agregar(seleccionado : Movil) {
    this.formulario.reset();
    this.movil.moviId = seleccionado.movilID;
    if (this.movil.moviId) {
        this.msG.post(this.movil)
          .subscribe((movil) => {
            this.movilesG.push(movil);                
          });

    }

     this.mostrarFormulario = true;
    }

  

  cancelar() {
    this.mostrarFormulario = false;
  }


}