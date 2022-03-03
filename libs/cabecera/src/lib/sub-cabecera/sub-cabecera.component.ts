import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constantes } from '../utils/constantes';
import { UserData } from '@rentas/shared/types';
import { SessionStorage } from '@rentas/shared/utils';


@Component({
  selector: 'rentas-sub-cabecera',
  templateUrl: './sub-cabecera.component.html',
  styleUrls: ['./sub-cabecera.component.css']
})
export class SubCabeceraComponent implements OnInit {

  @Input() mostrarBotones = true;
  @Input() paso: number;
  @Output() eventoDescargar: EventEmitter<boolean> = new EventEmitter();
  @Output() eventoResetear: EventEmitter<boolean> = new EventEmitter();
  @Output() eventoReportePreliminar: EventEmitter<boolean> = new EventEmitter();
  @Output() eventoGuardar: EventEmitter<boolean> = new EventEmitter();
  @Output() eventoImprimir: EventEmitter<boolean> = new EventEmitter();
  @Output() eventoEnviar: EventEmitter<boolean> = new EventEmitter();
  paso1 = false;
  paso2 = false;
  paso3 = false;
  mostrarBotonDescargar = false;
  mostrarBotonResetear = false;
  mostrarBotonReportePreliminar = false;
  mostrarBotonEnviar = false;
  mostrarBotonImprimir = false;
  mostrarBotonGuardar = false;
  mouseOver = false;
  fecha: Date;
  textoPaso: string;
  userData: UserData;
  no20 = true;
  numDni = '';
  public codFormulario: string;

  constructor() { }

  ngOnInit() {
    setInterval(() => {
      this.fecha = new Date();
    }, 1);
    if (this.paso != null && this.paso != undefined) {
      this.paso1 = this.paso == 1;
      this.paso2 = this.paso == 2;
      this.paso3 = this.paso == 3;
    }

    this.codFormulario = SessionStorage.getCodFormulario();
    //debugger;

    switch (this.paso) {
      case 1:
        this.textoPaso = Constantes.TEXTO_PASO_1;
        
        if (this.mostrarBotones) {
          if(this.codFormulario == '0709'){
            this.mostrarBotonDescargar = true;
          }          
          this.mostrarBotonResetear = true;
          this.mostrarBotonReportePreliminar = true;
          this.mostrarBotonEnviar = false;
          this.mostrarBotonImprimir = false;
          this.mostrarBotonGuardar = false;
        }
        break;
      case 2:
        this.textoPaso = Constantes.TEXTO_PASO_2;
        this.mostrarBotonDescargar = false;
        this.mostrarBotonResetear = false;
        this.mostrarBotonReportePreliminar = false;
        this.mostrarBotonEnviar = false;
        this.mostrarBotonImprimir = false;
        this.mostrarBotonGuardar = false;
        break;
      case 3:
        this.textoPaso = Constantes.TEXTO_PASO_3;
        this.mostrarBotonDescargar = false;
        this.mostrarBotonResetear = false;
        this.mostrarBotonReportePreliminar = false;
        this.mostrarBotonEnviar = true;
        this.mostrarBotonImprimir = true;
        this.mostrarBotonGuardar = true;
        break;
    }
  }

  ejecutarMetodoDescargar() {
    this.eventoDescargar.emit(true);
  }

  ejecutarMetodoResetear() {
    this.eventoResetear.emit(true);
  }

  ejecutarMetodoReportePreliminar() {
    this.eventoReportePreliminar.emit(true);
  }

  ejecutarMetodoGuardar() {
    this.eventoGuardar.emit(true);
  }

  ejecutarMetodoImprimir() {
    this.eventoImprimir.emit(true);
  }

  ejecutarMetodoEnviar() {
    this.eventoEnviar.emit(true);
  }
}
