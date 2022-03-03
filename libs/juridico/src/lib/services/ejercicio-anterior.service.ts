import { PreDeclaracionModel } from './../models/preDeclaracionModel';
import { PreDeclaracionService } from './preDeclaracion.service';
import { Injectable } from '@angular/core';
import { InfCasInformativaModel } from '../models/SeccionInformativa/infCasInformativaModel';
import { InfPrinAccionistasModel } from '../models/SeccionInformativa/infPrinAccionistasModel';
import { InfAlquileresModel } from '../models/SeccionInformativa/infAlquileresModel';
import { ConstantesDocumentos } from '@rentas/shared/constantes';
import { ListaRepresentantes } from '@rentas/shared/types';
import { SessionStorage } from '@rentas/shared/utils';
import { PrincipalesSociosService } from './principales-socios.service';
import { Lugares } from '../models/lugaresModel';
import { ComboService } from '@rentas/shared/core';
import { HabilitarCasillas2021Service } from './habilitar-casillas-2021.service';

@Injectable()
export class EjercicioAnteriorService {

  preDeclaracionObject: PreDeclaracionModel;
  tipoDocRepresentante: string;
  contador: InfCasInformativaModel;
  representante: ListaRepresentantes;
  sociosPeriodoAnt: InfPrinAccionistasModel[];
  sociosFichaRuc: InfPrinAccionistasModel[];
  alquileres: InfAlquileresModel[];

  constructor(
    private preDeclaracionservice: PreDeclaracionService,
    private comboService: ComboService,
    private sociosService: PrincipalesSociosService,
    private habilitarItan: HabilitarCasillas2021Service
  ) { }

  public cargarDataEjercicioAnterior(): void {
    this.preDeclaracionObject = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    if (this.preDeclaracionObject.indEjeAntAct == null) {
      this.preDeclaracionObject.declaracion.generales.cabecera.indRectificatoria === '0' ?
        this.preDeclaracionObject.indEjeAntAct = '0' : this.preDeclaracionObject.indEjeAntAct = '1';
      SessionStorage.setPreDeclaracion(this.preDeclaracionObject);
    }

    // Agregar campos faltantes a la lista de la casilla 297
    if (this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.casilla297.lisCasilla297) {
      this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.casilla297.lisCasilla297
        .map(deuda => {
          deuda.codOrigen === null ? deuda.codOrigen = '0' : deuda.codOrigen = deuda.codOrigen,
            deuda.indActivo === null ? deuda.indActivo = '1' : deuda.indActivo = deuda.indActivo
        });
      SessionStorage.setPreDeclaracion(this.preDeclaracionObject);
    }

    // Habilitar la pregunta de itan
    if (this.habilitarItan.habilitarCasillasITAN() && this.existenMontos131()) {
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas824 = 1;
      SessionStorage.setPreDeclaracion(this.preDeclaracionObject);
    }

    if (this.preDeclaracionObject.indEjeAntAct === '0') {
      this.actualizarPreDeclaracion();
      this.preDeclaracionservice.generarValHash();
      this.preDeclaracionservice.guardarDeclaracion(/* 'DATA' */)
        .subscribe(() => { }
          , () => { });
    }
  }

  private existenMontos131(): boolean {
    return this.preDeclaracionObject.declaracion.seccDeterminativa.credImpuestoRta.casilla131.lisCasilla131.some(x => {
      return x.mtoLiteral > 0;
    });
  }

  private actualizarPreDeclaracion(): void {
    const ejercicioAnterior = SessionStorage.getEjercicioAnterior();
    this.contador = ejercicioAnterior.contador;
    this.representante = SessionStorage.getRepresentantes()[0];
    this.sociosPeriodoAnt = ejercicioAnterior.socios;
    this.sociosFichaRuc = SessionStorage.getSociosFichaRuc();
    this.alquileres = ejercicioAnterior.alquileres;
    this.datosContador();
    this.datosRepresentantes();
    if (this.sociosFichaRuc.length !== 0) {
      this.datosSociosFichaRuc();
    } else {
      this.datosSociosPeriodoAnterior();
    }

    this.datosAlquileres();
    this.preDeclaracionObject.indEjeAntAct = '1';
    SessionStorage.setPreDeclaracion(this.preDeclaracionObject);
  }

  private datosContador(): void {
    if (this.contador != null) {
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas687 = this.contador.mtoCas687;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas208 = this.contador.mtoCas208;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas207 = this.contador.mtoCas207;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas815 = this.contador.mtoCas815;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas814 = this.contador.mtoCas814;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas211 = this.contador.mtoCas211;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas250 = this.contador.mtoCas250;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas251 = this.contador.mtoCas251;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas252 = this.contador.mtoCas252;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas253 = this.contador.mtoCas253;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas254 = this.contador.mtoCas254;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas255 = this.contador.mtoCas255;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas256 = this.contador.mtoCas256;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas257 = this.contador.mtoCas257;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas258 = this.contador.mtoCas258;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas259 = this.contador.mtoCas259;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas260 = this.contador.mtoCas260;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas261 = this.contador.mtoCas261;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas262 = this.contador.mtoCas262;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas263 = this.contador.mtoCas263;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas829 = this.contador.mtoCas829;
    }
  }

  private datosRepresentantes(): void {
    const rucPN20 = this.comboService.obtenerComboPorNumero('R06').find(x => x.val === this.preDeclaracionObject.numRuc);
    const userData = SessionStorage.getUserData().map.ddpData.ddp_tpoemp;
    if (this.representante !== undefined && ((this.preDeclaracionObject.numRuc.substring(0, 2) === '20' && !rucPN20) || (userData === '05' || userData === '06'))) {
      this.tipoDocRepresentante =
        this.representante.rsoDocide != ConstantesDocumentos.PTP && this.representante.rsoDocide != ConstantesDocumentos.CARNET_IDENTIDAD ?
          '0' + this.representante.rsoDocide :
          this.representante.rsoDocide
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas225 = this.tipoDocRepresentante;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas226 = this.representante.rsoNrodoc.trim();
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas817 = this.representante.rsoNombre.substring(0, 15).toUpperCase();
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas818 = this.representante.rsoNombre.substring(15, 30).toUpperCase();
    }
  }

  private datosSociosFichaRuc(): void {
    if (this.sociosFichaRuc.length !== 0) {
      this.sociosService.lugarDeCargaDeData(Lugares.fichaRuc);
      this.preDeclaracionObject.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas = this.sociosFichaRuc;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas502 = this.sociosFichaRuc.length;
    }
  }

  private datosSociosPeriodoAnterior(): void {
    if (this.sociosPeriodoAnt.length !== 0) {
      this.sociosService.lugarDeCargaDeData(Lugares.periodoAnterior);
      this.preDeclaracionObject.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas = this.sociosPeriodoAnt;
      this.preDeclaracionObject.declaracion.seccInformativa.casInformativa.mtoCas502 = this.sociosPeriodoAnt.length;
    }
  }

  private datosAlquileres(): void {
    if (this.alquileres.length !== 0) {
      this.preDeclaracionObject.declaracion.seccInformativa.alquileres.lisAlquileres =
        this.preDeclaracionObject.declaracion.seccInformativa.alquileres.lisAlquileres.concat(this.alquileres);
    }
  }
}
