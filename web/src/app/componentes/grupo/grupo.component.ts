import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Grupo } from 'src/app/modelo/grupo';
import { GrupoService } from 'src/app/servicios/grupo.service';
import { DatosService } from 'src/app/shared/datos/datos.service';
import { GrupoServicioService } from 'src/app/servicios/grupo_servicio.service';
import { GrupoServicioComponent } from '../grupo_servicio/grupo_servicio.component';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit, AfterViewInit{

  constructor(public gS : GrupoService, public formBuilder : FormBuilder, public datosService: DatosService, public gsService: GrupoServicioService, private cdref : ChangeDetectorRef) { }
/*  
  ngAfterViewChecked() {
    let show = this.isShowExpand();
    if (show != this.show) { 
      this.show = show;
      this.cdref.detectChanges();
    }
  }

  isShowExpand()
  {
    return this.mostrarFormulario;
  }
*/
  grupos : Grupo [] = [];
  columnas: string[] = ['grupId', 'grupNombre', 'grupDescripcion', 'acciones'];
  dataSource = new MatTableDataSource<Grupo>();
  
  formulario = new FormGroup({});
  mostrarFormulario = false;
  show = false;
 

  @ViewChild(MatSort) sort! : MatSort;

  grupoSeleccted = new Grupo();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  actualizarGS(id : number){
    this.datosService.gruser.forEach( (dato) => { dato.grusGrupId = id;
      if(dato.grusBorrado){
        this.gsService.delete(dato.grusId).subscribe();
      }else if(dato.grusId < 0){
        this.gsService.post(dato).subscribe();
      }else (dato.grusId > 0 )
        this.gsService.put(dato).subscribe();
      }
   );
    this.actualizar();
    this.mostrarFormulario = false;
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      grupId: [''],
      grupDescripcion: ['', Validators.required],
      grupNombre: ['', Validators.required],
      grupBorrado: [''],
      grupFechaAlta: ['']
    });

    this.gS.get().subscribe(
      (grupos) => {
        this.grupos = grupos;
        this.actualizar();
      }
    )
  }

  mostrarGrupo():Boolean{
    if(this.grupoSeleccted.grupId){
      return this.mostrarFormulario = true;
    }else{
      return this.mostrarFormulario = false;
    }
  }

  actualizar(){
   this.dataSource.data = this.grupos;
   this.dataSource.sort = this.sort;
  }

  agregar() {
    
    this.grupoSeleccted = new Grupo();
    this.mostrarFormulario = true;
    this.formulario.reset();
  }

  editar(seleccionado: Grupo) {
    this.grupoSeleccted = seleccionado;
    this.formulario.setValue(seleccionado);
    this.mostrarFormulario = true;   
  }

  borrar(fila: Grupo) {
        this.gS.delete(fila.grupId)
          .subscribe(() => {
            this.grupos = this.grupos.filter((grupo) => {
              if (grupo.grupId != fila.grupId) {
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

    Object.assign(this.grupoSeleccted, this.formulario.value);

    if (this.grupoSeleccted.grupId) {
      this.gS.put(this.grupoSeleccted)
        .subscribe((grupo) => {
          this.actualizarGS(grupo.grupId);
        });

    } else {
      this.gS.post(this.grupoSeleccted)
        .subscribe((grupo) => {
          this.grupos.push(grupo);
          this.actualizarGS(grupo.grupId);
        });

    }

  }

  cancelar() {
    this.mostrarFormulario = false;
  }


}