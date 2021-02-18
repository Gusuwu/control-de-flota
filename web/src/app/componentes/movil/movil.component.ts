import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';


@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit, AfterViewInit {

  constructor(public mS : MovilService, public formBuilder : FormBuilder) { }

  moviles : Movil [] = [];
  columnas: string[] = ['moviId', 'moviModoFecha','moviModoOdometro', 'acciones'];
  dataSource = new MatTableDataSource<Movil>();
  
  formulario = new FormGroup({});
  mostrarFormulario = false;

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
        .subscribe((servicio) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.mS.post(this.movilSelected)
        .subscribe((movil) => {
          this.moviles.push(movil);
          this.mostrarFormulario = false;
          this.actualizar();
        });

    }

  }

  cancelar() {
    this.mostrarFormulario = false;
  }


}
