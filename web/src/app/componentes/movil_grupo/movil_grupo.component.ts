import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Grupo } from 'src/app/modelo/grupo';
import { GrupoServicio } from 'src/app/modelo/grupo_servicio';
import { MovilGrupo } from 'src/app/modelo/movil_grupo';
import { MovilServicio } from 'src/app/modelo/movil_servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { GrupoService } from 'src/app/servicios/grupo.service';
import { GrupoServicioService } from 'src/app/servicios/grupo_servicio.service';
import { MovilGService } from 'src/app/servicios/movil-grilla.service';
import { MovilGrupoService } from 'src/app/servicios/movil_grupo.service';
import { MovilServicioService } from 'src/app/servicios/movil_servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { DatosService } from 'src/app/shared/datos/datos.service';



@Component({
  selector: 'app-movil-grupo',
  templateUrl: './movil_grupo.component.html',
  styleUrls: ['./movil_grupo.component.css']
})
export class MovilGrupoComponent implements OnInit {

  @Input() moviId: number = 0;
  @Input() mostrarTabla: boolean = false;
  @Input() mostrarForm: boolean = false;
  movilgrupos: MovilGrupo[] = [];
  seleccionado = new MovilGrupo();

  columnas: string[] = ['mogrId', 'grupNombre', 'mogrMoviId', 'mogrGrupId', 'acciones'];
  dataSource = new MatTableDataSource<MovilGrupo>();


  form = new FormGroup({});
  mostrarFormulario = false;
  mostrarGrilla = false;

  grupos: Grupo[] = [];
  gruposervcio = new GrupoServicio();
  gruposservicios : GrupoServicio[] = [];
  movilservicio =new MovilServicio();
  movilesservicios : MovilServicio[] = [];
  servicios : Servicio[] = [];


  //idAux: number = -1;
  

  constructor(private movilGrupoService: MovilGrupoService,
    private grupoService: GrupoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datosService: DatosService,
    public ms : MovilGService,
    public movilServicioService : MovilServicioService,
    public grupoServicioService: GrupoServicioService,
    public servicioService : ServicioService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: ['', Validators.required],
      mogrBorrado: [''],
      mogrFechaAlta: [''],
      grupNombre: [''],
    });

    this.movilGrupoService.get(`mogrMoviId=${this.moviId}`).subscribe(
      (movilgrupo) => {
        this.movilgrupos = movilgrupo;
        this.actualizarTabla();
      }
    );

    this.movilServicioService.get(`moseMoviId=${this.moviId}`).subscribe(
      (movilservicio) => {
        this.movilesservicios = movilservicio;
        this.actualizarTabla();
      }
    );

    this.grupoService.get().subscribe(
      (grupo) => {
        this.grupos = grupo;
      }
    )

    this.grupoServicioService.get().subscribe(
      (grupserv) => {
        this.gruposservicios=grupserv
      }
    )

    this.servicioService.get().subscribe(
      (movilservicio) => {
        this.servicios = movilservicio;
      }
    );


  }

  actualizarTabla() {
    this.dataSource.data = this.movilgrupos;
  }

  actualizar(){
    this.dataSource.data = this.ms.movgru.filter(borrado => borrado.mogrBorrado==false);
  }

  agregar() {
    this.mostrarGrilla = true;
    this.mostrarTabla = true;
    this.seleccionado = new MovilGrupo();
    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  }

  delete(fila: MovilGrupo) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        this.movilGrupoService.delete(fila.mogrId)
        .subscribe(() => {
          this.movilgrupos = this.movilgrupos.filter((movilgrupo) => {
            if (movilgrupo.mogrId != fila.mogrId) {
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

  editar(seleccionado: MovilGrupo) {
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

    this.seleccionado.grupNombre = this.grupos.find(grupo => grupo.grupId == this.seleccionado.mogrGrupId)!.grupNombre;

    if(this.seleccionado.mogrId){
      this.movilGrupoService.put(this.seleccionado).subscribe((movilgrupo)=>{
        this.mostrarFormulario = false;
      });

    }else{
      this.movilGrupoService.post(this.seleccionado)
        .subscribe((movilgrupo) => {
          this.movilgrupos.push(movilgrupo);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });

      // arreglo con los servicios del grupo
      let aux = this.gruposservicios.filter(grupo => grupo.grusGrupId == this.seleccionado.mogrGrupId)!;

      // id del primer servicio del grupo
      let idservicio = this.gruposservicios.find(grupo => grupo.grusGrupId == this.seleccionado.mogrGrupId)!.grusServId;

      // longitud del arreglo
      let length = aux.length
      
      //recorro la logitud del arreglo e inserto movil servicio con la id del servicio del primer grupo y al final borro este servicio del arreglo
      //así guardo la id del siguiente servicio en el arreglo en la variable idgservicio
      for(let i = 0 ; i <= length; i++ ){
        
          // seteo los valores para los campos
          this.movilservicio.moseServId = idservicio;
          this.movilservicio.moseMoviId = this.seleccionado.mogrMoviId
          this.movilservicio.moseKM = this.servicios.find(serv => serv.servId == this.movilservicio.moseServId)!.servKM;
          this.movilservicio.mosePeriodo = this.servicios.find(serv => serv.servId == this.movilservicio.moseServId)!.servPeriodo;
          this.movilservicio.moseFecha = this.servicios.find(serv => serv.servId == this.movilservicio.moseServId)!.servFecha;

          //inserto el movil servicio
          this.movilServicioService.post(this.movilservicio).subscribe((movilservicio) => {this.movilesservicios.push(movilservicio);
          this.mostrarFormulario = false;});
          
          //borro el actual servicio del arreglo
          aux.shift();
       

        //guardo el siguiente id para la siguiente pasada
        idservicio = aux.find(grupo => grupo.grusGrupId == this.seleccionado.mogrGrupId)!.grusServId;

      }
      
    }
   
  }
  cancelar() {
    this.mostrarFormulario = false;
    this.mostrarGrilla = false;
    this.mostrarTabla = false;
  }


}