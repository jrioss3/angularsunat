import { Component, OnInit, Inject } from '@angular/core';
import { ConstanciaService } from '../core/constancia.service';
import { TributoDevolucion, DevolucionSolicitud, DevolucionTributoRespuesta } from '@rentas/shared/types';
import { SessionStorage } from '@rentas/shared/utils';
import { DevolucionService } from '@rentas/shared/core';
import { ConstantesDevolucion, ConstantesTributos } from '@rentas/shared/constantes';

@Component({
  selector: 'rentas-link-devolucion',
  templateUrl: './link-devolucion.component.html',
  styleUrls: ['./link-devolucion.component.css']
})
export class LinkDevolucionComponent implements OnInit {

  tieneDevolucion = false;
  listaTributos: Array<TributoDevolucion> = [];

  constructor(
    private constanciaService: ConstanciaService,
    private devolucionService: DevolucionService,
    @Inject(ConstantesDevolucion.URI_DEVOLUCION) private uri: string) {
    this.tieneDevolucion = this.constanciaService.tieneDevolucion();
    this.listaTributos = this.constanciaService.getTributoDevolucion();
  }

  ngOnInit(): void { }

  mapTributoDevolucionRespuesta(e: TributoDevolucion): DevolucionTributoRespuesta {
    const devolucionRespuesta: DevolucionTributoRespuesta = {
      codTributo: e.codTributo,
      descTributo: e.descripcionTributo,
      mtoTributo: e.mtoTributo
    }
    return devolucionRespuesta;
  }

  clickEnLinkDevolucion(item: TributoDevolucion): void {
    const numOrden = this.constanciaService.getConstanciaRespuesta().constancias[0].numeroOrden;
    const presentacion = this.constanciaService.getConstanciaRespuesta().resultado.numeroOperacionSunat;
    const razonSocial = SessionStorage.getrazonSocial();
    const nombres = SessionStorage.getUserData().nombres;
    const numeroTelefono = '0';
    const codFormulario = SessionStorage.getCodFormulario();
    const montoDevolucion = this.listaTributos
      .reduce((carry, e) => carry + e.mtoTributo, 0);
    const periodo = SessionStorage.getPerTri();
    const usuSol = SessionStorage.getUsuarioSOL();
    const fechaActual = new Date();
    const listTributo: DevolucionTributoRespuesta[] = this.listaTributos
      .map(this.mapTributoDevolucionRespuesta);
    const token = SessionStorage.getToken();

    const solicitud: DevolucionSolicitud = {
      numOrden,
      razonSocial,
      nombres,
      numeroTelefono,
      codFormulario,
      montoDevolucion,
      periodo,
      usuSol,
      fechaActual,
      listTributo
    }

    if (item.codTributo === ConstantesTributos.ITAN.codigo) {
      const uri = 'https://e-renta.sunat.gob.pe/v1/recaudacion/declaracionespago/renta/devolucion/t/generar/presentacion/' + presentacion + '?tiposolicitud=02&tributo=' + item.codTributo + '&token=' + token;
      window.open(uri);
    } else {
      this.devolucionService.linkDevolucion(this.uri, solicitud)
        .subscribe(respuesta => {
          window.open(
            'https://www.sunat.gob.pe' +
            respuesta.listaTributoUri
              .filter(e => e.tributo.codTributo === item.codTributo)
              .shift().data
          );
        });
    }
  }

}
