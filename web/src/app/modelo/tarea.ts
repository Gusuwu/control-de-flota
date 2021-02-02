export class Tarea {
    tareId: number = 0;
    tareNombre: string = '';
    tareDescripcion: string = '';
    tareUnidadMedida : string = '';
    tareCantidad : number = 0;
    tareCosto : number = 0;
    tareFechaAlta: Date = new Date();
    tareBorrado: boolean = false;
}