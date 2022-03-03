import { Component, HostListener, OnInit } from '@angular/core';
import { UserData } from '@rentas/shared/types';
import { ConstantesStores } from '@rentas/shared/constantes';
import { CerrarSesionService } from '@rentas/shared/core';
import { environment } from '@rentas/shared/environments';
import { SessionStorage } from '@rentas/shared/utils';

@Component({
  selector: 'rentas-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  fecha: Date;
  nombreContribuyente: string;
  numDni = '';
  numRuc: string;
  nombreUsuario: string;
  mouseOver = false;
  estadoDomicilio: string;
  no20 = true;
  userData: UserData;

  constructor(
    private cerrarSesionService : CerrarSesionService
  ) { }

  ngOnInit(): void {
    setInterval(() => this.fecha = new Date(), 1);
    this.userData = SessionStorage.getUserData();
    if (this.userData) {
      this.nombreContribuyente = this.userData.nombreCompleto;
      this.estadoDomicilio = this.obtenerEstadoDomicilio(this.userData.map.ddpData.ddp_flag22);

      this.numRuc = this.userData.numRUC;

      if ((this.userData.map.ddpData.ddp_flag22 == '10') && (this.userData.map.ddpData.ddp_estado == '20')) {
        this.no20 = false;
        this.numDni = this.numRuc.substring(2, this.numRuc.length - 1);
      }

      this.nombreUsuario = this.userData.usuarioSOL;
    }
  }

  obtenerEstadoDomicilio(codigo: string): string {
    const estadosRuc = {
      'C': 'RESULTADO DE UN AVISO DE RETORNO-DESCRIPCION ',
      '-': '',
      '00': 'HABIDO',
      '01': 'NO HALLADO SE MUDO DE DOMICILIO',
      '02': 'NO HALLADO FALLECIO',
      '03': 'NO HALLADO NO EXISTE DOMICILIO',
      '04': 'NO HALLADO CERRADO',
      '05': 'NO HALLADO NRO.PUERTA NO EXISTE',
      '06': 'NO HALLADO DESTINATARIO DESCONOCIDO',
      '07': 'NO HALLADO RECHAZADO',
      '08': 'NO HALLADO OTROS MOTIVOS',
      '09': 'PENDIENTE',
      '10': 'NO APLICABLE',
      '11': 'POR VERIFICAR',
      '12': 'NO HABIDO',
      '20': 'NO HALLADO',
      '21': 'NO EXISTE LA DIRECCION DECLARADA',
      '22': 'DOMICILIO CERRADO',
      '23': 'NEGATIVA RECEPCION X PERSONA CAPAZ',
      '24': 'AUSENCIA DE PERSONA CAPAZ',
      '25': 'NO APLICABLE X TRAMITE DE REVERSION',
      '40': 'DEVUELTO',
    };
    return estadosRuc[codigo] ? estadosRuc[codigo] : '';
  }

  ejecutarMetodoSalir() {
    this.cerrarSesionService.logaut().subscribe(() => {
      sessionStorage.removeItem(ConstantesStores.STORE_TOKEN);
      sessionStorage.removeItem(ConstantesStores.STORE_CURRENTDATA);
      sessionStorage.removeItem(ConstantesStores.STORE_USERDATA);
      localStorage.removeItem(ConstantesStores.STORE_CASILLAS);
      sessionStorage.removeItem(ConstantesStores.STORE_FORMULARIO);
      sessionStorage.removeItem(ConstantesStores.STORE_PREDECLARACION);
      window.location.assign('http://www.sunat.gob.pe');
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public async doSomething($event) {
    if (environment.production) {
      await this.cerrarSesionService.logautEvent();
      return 'quiere salir';
    }
  }

}
