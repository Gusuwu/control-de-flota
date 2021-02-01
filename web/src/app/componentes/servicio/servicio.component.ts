import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Servicio } from 'src/app/modelo/servicio';
import { ServicioService } from 'src/app/servicios/servicio.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit, AfterViewInit {

  constructor(public sS : ServicioService, public formBuilder : FormBuilder) { }

  servicios : Servicio [] = [];
  columnas: string[] = ['servNombre', 'servDescripcion','servPeriodo', 'servKM', 'servFecha', 'acciones'];
  dataSource = new MatTableDataSource<Servicio>();
  
  formulario = new FormGroup({});
  mostrarFormulario = false;

  @ViewChild(MatSort) sort! : MatSort;

  servicioSeleccted = new Servicio();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      servId: [''],
      servDescripcion: ['', Validators.required],
      servNombre: ['', Validators.required],
      servPeriodo: ['', Validators.required],
      servKM: ['', Validators.required],
      servFecha: [''],
      servBorrado: [''],
      servFechaAlta: ['']
    });

    this.sS.get().subscribe(
      (servicios) => {
        this.servicios = servicios;
        this.actualizar();
      }
    )
  }

  actualizar(){
   this.dataSource.data = this.servicios;
   this.dataSource.sort = this.sort;
  }

  agregar() {
    this.formulario.reset();
    this.servicioSeleccted = new Servicio();
    this.mostrarFormulario = true;
  }

  editar(seleccionado: Servicio) {
    this.mostrarFormulario = true;
    this.servicioSeleccted = seleccionado;
    this.formulario.setValue(seleccionado);
  }

  borrar(fila: Servicio) {
        this.sS.delete(fila.servId)
          .subscribe(() => {
            this.servicios = this.servicios.filter((grupo) => {
              if (grupo.servId != fila.servId) {
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

    Object.assign(this.servicioSeleccted, this.formulario.value);

    if (this.servicioSeleccted.servId) {
      this.sS.put(this.servicioSeleccted)
        .subscribe((servicio) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.sS.post(this.servicioSeleccted)
        .subscribe((servicio) => {
          this.servicios.push(servicio);
          this.mostrarFormulario = false;
          this.actualizar();
        });

    }

  }

  cancelar() {
    this.mostrarFormulario = false;
  }


}
