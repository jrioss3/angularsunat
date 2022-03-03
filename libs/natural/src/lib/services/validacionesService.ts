import { Injectable } from '@angular/core';
import { ErrorListComponent } from '../components/error-list/error-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionModel } from '../models/preDeclaracionModel';
import { ConstantesExcepciones } from '@path/natural/utils';
import { Casilla519 } from '@path/natural/models';
import { UtilsComponent } from '@path/natural/components';
import { ConstantesExcepcionesObj } from '../utils/constantesExcepcionesObj';
import { ChatErrorService, ErroresService, ValidacionService } from '@rentas/shared/core';
import { SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { ConstantesDocumentos, Rutas } from '@rentas/shared/constantes';


@Injectable({
  providedIn: 'root',
})
export class ValidacionesService {

  errorsArray = [];
  errorsArrayObj = [];
  erroresInformativa;
  erroresDeterminativa;
  preDeclaracion: PreDeclaracionModel;
  valorUIT: number;
  erroresPrimera;
  erroresSegunda;
  erroresTrabajo;
  private funcionesGenerales: FuncionesGenerales;

  constructor(
    private modalService: NgbModal,
    private errorChat: ChatErrorService,
    private erroresService: ErroresService
  ) {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
  }

  bttnvalidarAction() {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.erroresPrimera = false;
    this.erroresSegunda = false;
    this.erroresTrabajo = false;
    this.erroresInformativa = false;

    this.errorsArray = [];
    this.errorsArrayObj = [];

    // Validaciones solo de Primera Categoría
    if (this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523 === 1) {
      this.excepcion_PrimCat_1();
      this.excepcion_PrimCat_2();
      this.excepxion_PrimCat_3();
    }
    // Validaciones solo de Segunda Categoría
    if (this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524 === 1) {
      this.excepcion_SegCat_1();
      this.exception_SegCat_2();
      this.exception_SegCat_3();
      this.exception_SegCat_4();
    }
    // Validaciones de Renta de Trabajo
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525) === 1) {
      this.exception_RenTra_1();
      this.exception_RenTra_3();
      this.exception_RenTra_4();
      this.exception_RenTra_5();
      this.exception_RenTra_6();
      this.exception_RenTra_7();
      this.exception_RenTra_8();
      this.exception_RenTra_10();
    }
    this.exception_RenTra_9();

    // -------Validaciones seccion informativa------
    this.actualizar();
    this.excepcion_TipoDeclaracion();
    this.excepcion_condominos();
    this.excepcion_alquilerpagado();
    SessionStorage.setErroresDet(this.errorsArrayObj);
    if (this.errorsArrayObj.length) {
      this.showErrorsArray();
    } else {
      const noHayErrores = [''];
      // this.serviceChat.enviarMensaje(noHayErrores, false);
      this.errorChat.enviarMensaje(noHayErrores, false);
    }
  }

  showErrorsArray() {

    // this.serviceChat.enviarMensaje(this.errorsArrayObj, true);
    this.errorChat.enviarMensaje(this.errorsArrayObj, true);
    // this.callModalErrorList(this.errorsArray);

    this.erroresService.mostrarModalError(this.errorsArrayObj);
    this.errorChat.enviarMensaje(this.errorsArrayObj, true);
  }

  actualizar() {
    if (!this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559) {
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559 = 0;
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }

    if (!this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602) {
      this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602 = 0;
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
    }
  }

  excepcion_TipoDeclaracion() {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas601) === 1) {
      if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas235) === 0) {
        this.errorsArray.push(ConstantesExcepciones.CUS02_VALIDAR_01);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS02_VALIDAR_01);
        this.erroresInformativa = true;
      }
      if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas236) === 0) {
        this.errorsArray.push(ConstantesExcepciones.CUS02_VALIDAR_02);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS02_VALIDAR_02);
        this.erroresInformativa = true;
      }
    }
  }

  excepcion_condominos() {
    if (this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523 === 1) {
      if (this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559 === null) {
        this.errorsArray.push(ConstantesExcepciones.CUS03_EX19);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS03_VALIDAR);
        this.erroresInformativa = true;
      }

      if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559) === 1 &&
        this.preDeclaracion.declaracion.seccInformativa.condominos.lisCondomino.length === 0) {
        this.errorsArray.push(ConstantesExcepciones.CUS03_EX18);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS03_VALIDAR_2);
        this.erroresInformativa = true;
      }
    }
  }

  excepcion_alquilerpagado() {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523) === 1
      || Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524) === 1
      || Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525) === 1) {
      if (this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602 === null) {
        this.errorsArray.push(ConstantesExcepciones.CUS04_VALIDAR);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS04_VALIDAR);
        this.erroresInformativa = true;
      }

      if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602) === 1 &&
        this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres.length === 0) {
        this.errorsArray.push(ConstantesExcepciones.CUS04_VALIDAR_2);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS04_VALIDAR_2);
        this.erroresInformativa = true;
      }
    }
  }

  excepcion_PrimCat_1() {
    if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166) >
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas164)) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX02);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_PRIMERA_1);
      this.erroresPrimera = true;
    }
  }

  excepcion_PrimCat_2() {
    if (((this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160) === 0
      || this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas160 === undefined)
      && Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas159) !== 0) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX03);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_PRIMERA_2);
      this.erroresPrimera = true;
    }
  }

  excepxion_PrimCat_3() {
    if (this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas166 === null) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX01);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_PRIMERA_3);
      this.erroresPrimera = true;
    }
  }

  excepcion_SegCat_1() {
    if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366) >
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas365)) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX05);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_SEGUNDA_1);
      this.erroresSegunda = true;
    }
  }

  exception_SegCat_2() {
    if ((Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361) === 0 ||
      this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas361 === undefined) &&
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas360) !== 0) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX06);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_SEGUNDA_2);
      this.erroresSegunda = true;
    }
  }

  exception_SegCat_3() {
    if ((this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.impRetenidoRentas.lisCas359.length !== 0 ||
      this.preDeclaracion.declaracion.determinacionDeuda.rentaSegunda.pagoDirectoIR.lisCas358.length !== 0)
      &&
      (this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla350.lisCas350.length === 0 &&
        this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla355.lisCas355.length === 0 &&
        this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.casilla385.lisCas385.length === 0)
    ) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX07);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_SEGUNDA_3);
      this.erroresSegunda = true;
    }
  }

  exception_SegCat_4() {
    if (this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas366 === null) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX04);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_SEGUNDA_4);
      this.erroresSegunda = true;
    }
  }

  exception_RenTra_1() {
    if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168) >
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas146)) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX09);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_1);
      this.erroresTrabajo = true;
    }
  }

  exception_RenTra_3() {
    if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas519)
      > (0.10 * (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas512) +
        Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116)))) {
      //
      let lista519: Casilla519[];
      lista519 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla519.lisCas519;
      let sumaDonacion1 = 0; // Suma de las Donaciones (A)
      let sumaDonacion2 = 0; // Suma de las Donaciones (B + C + D)

      sumaDonacion1 = lista519.filter(x => x.codTipDona === 'A').reduce((total, x) => total + Number(x.mtoDonacion), 0);
      sumaDonacion2 = lista519.filter(x => x.codTipDona !== 'A').reduce((total, x) => total + Number(x.mtoDonacion), 0);

      if (sumaDonacion1 > (0.10 *
        (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas512) +
          Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116)))) {
        this.erroresTrabajo = true;
        this.errorsArray.push(ConstantesExcepciones.CUS17_EX11);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_3);
        // this.callModal(ConstantesExcepciones.CUS17_EX_TRABAJO_3);
      }

      if (sumaDonacion2 > (0.10 *
        (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas512) +
          Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116)))) {
        this.erroresTrabajo = true;
        this.errorsArray.push(ConstantesExcepciones.CUS17_EX12);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_4);
        // this.callModal(ConstantesExcepciones.CUS17_EX_TRABAJO_4);
      }
    }
  }

  exception_RenTra_4() {
    if ((Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140) === 0 ||
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas140 === undefined) &&
      (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas141) !== 0)) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX13);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_5);
      // this.callModal(ConstantesExcepciones.CUS17_EX_TRABAJO_5);
      this.erroresTrabajo = true;
    }
  }

  exception_RenTra_5() {
    // AJUSTAR
    if ((
      (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas131) !== 0 &&
        this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas131 != null &&
        this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas131 !== undefined) ||
      (this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas128 > 0)) &&
      (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas111) === 0)) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX14);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_6);
      this.erroresTrabajo = true;
    }
  }

  exception_RenTra_6() {
    if ((this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.pagoDirectoIR.lisCas127.length !== 0 ||
      this.preDeclaracion.declaracion.determinacionDeuda.rentaTrabajo.impRetenidoRentas.lisCas130.length !== 0)
      &&
      (this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla107.lisCas107.length === 0 &&
        this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla108.lisCas108.length === 0)) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX15);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_7);
      this.erroresTrabajo = true;
    }
  }

  exception_RenTra_7() {
    const dividendo = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas120);
    const divisor = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas512) +
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116) +
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas511) +
      Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas514);
    const cociente = dividendo / divisor;
    const tasaMedia = Number(Math.round(cociente * Math.pow(10, 4)) / Math.pow(10, 4));
    const comparable = Math.round(Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116)
      * tasaMedia);
    if (Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas122) > comparable) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX16 + comparable);
      ConstantesExcepcionesObj.CUS17_EX_TRABAJO_8.mensaje = ConstantesExcepcionesObj.CUS17_EX_TRABAJO_8.mensaje.replace('COMPARABLE', comparable);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_8);
      this.erroresTrabajo = true;
    }
  }

  exception_RenTra_8() {
    // e)	Si se identifica más de una atribución recibida por Sociedad Conyugal
    const listaConyugal = this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos;
    const listAtriRecibidas = listaConyugal.filter(x => x.indTipoAtrib === '2');
    if (listaConyugal) {
      if (listAtriRecibidas.length > 1) {
        this.errorsArray.push(ConstantesExcepciones.CUS17_EX17);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_9);
        this.erroresTrabajo = true;
      }
    }
  }

  exception_RenTra_9() {
    if (
      this.validarRentas()
    ) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX18);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_10);
      this.erroresTrabajo = true;
    } else {
      if (
        !this.preDeclaracion.declaracion.seccInformativa.casillaInformativa &&
        !this.preDeclaracion.declaracion.seccInformativa.condominos &&
        !this.preDeclaracion.declaracion.seccInformativa.alquileres &&
        !this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos &&
        !this.preDeclaracion.declaracion.seccInformativa.dividendPercibidos &&
        !this.preDeclaracion.declaracion.seccInformativa.exoneradaInafecta &&
        !this.preDeclaracion.declaracion.seccInformativa.fuenteExtranjera &&
        !this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera &&
        !this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda &&
        !this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo
      ) {
        this.errorsArray.push(ConstantesExcepciones.CUS17_EX18);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_10);
        this.erroresTrabajo = true;
      }
    }
  }

  exception_RenTra_10() {
    if (this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas168 === null) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX08);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS17_EX_TRABAJO_12);
      this.erroresTrabajo = true;
    }
  }

  callModalErrorList(errorList: string[]) {
    if (errorList && errorList.length > 0) {
      const modal = {
        titulo: 'Errores',
        errorList: (errorList)
      };
      const modalRef = this.modalService.open(ErrorListComponent, this.funcionesGenerales.getModalOptions({}));
      modalRef.componentInstance.modal = modal;
    }
  }

  callModal(excepcionName: string) {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  public isActivo523(): boolean {
    return Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas523) === 1;
  }

  public isActivo524(): boolean {
    return Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas524) === 1;
  }

  public isActivo525(): boolean {
    return Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas525) === 1;
  }

  validarRentas(): boolean {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    return this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas515 == null &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas367 == null &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas368 == null &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas356 == null &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas388 == null &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla107.lisCas107.length === 0 &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla108.lisCas108.length === 0 &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla111.lisCas111.length === 0 &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla116.lisCas116.length === 0 &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla519.lisCas519.length === 0 &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla522.lisCas522.length === 0 &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas167 == null &&
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas125 == null &&
      this.listasCasilla514();
  }

  listasCasilla514(): boolean {
    let alquiler514: any;
    let medicos514: any;
    let aportaciones514: any;
    let hoteles514: any;
    const lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    lista514.forEach(x => {
      switch (x.indTipoGasto) {
        case '01': alquiler514 = x.casilla514Detalle.lisCas514; break;
        case '03': medicos514 = x.casilla514Detalle.lisCas514; break;
        case '04': aportaciones514 = x.casilla514Detalle.lisCas514; break;
        case '05': hoteles514 = x.casilla514Detalle.lisCas514; break;
      }
    });
    return alquiler514.length === 0 && medicos514.length === 0 && aportaciones514.length === 0 && hoteles514.length === 0;
  }

  public validarInformativa() {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.errorsArray = [];
    this.errorsArrayObj = [];
    this.excepcion1();
    this.excepcion2();
    this.excepcion3();
    this.excepcion4();
    this.excepcion5();
    SessionStorage.setErroresInfo(this.errorsArray);
    const erroresBack = SessionStorage.getErroresBackend();
   
    if (this.errorsArray.length != 0 /* || erroresBack.length != 0 */) {
      // this.errorsArray.push([...erroresBack.map(e => e.descripcion)]);
      this.callModalErrorList(this.errorsArray);
      this.errorsArrayObj = this.errorsArrayObj.concat(erroresBack);
      this.errorChat.enviarMensaje(this.errorsArrayObj, true);
      return false;
    } else {
      return true;
    }
  }

  public validarTipoRenta(): boolean {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    const {
      mtoCas523, mtoCas524,
      mtoCas525, mtoCas601,
      mtoCas235, mtoCas236, mtoCas700
    } = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa;
    const erroresDoc = sessionStorage.getItem('SUNAT.errorPadronConyugue');
    //debugger;  
    var expreg = /^[a-zA-Z0-9 ]*$/; 

    if ((!mtoCas523 || Number(mtoCas523) === 0) &&
      (!mtoCas524 || Number(mtoCas524) === 0) &&
      (!mtoCas525 || Number(mtoCas525) === 0)) {
      this.callModalErrorList(['Debe seleccionar al menos un tipo de renta a declarar.']);
      return false;
    } if (mtoCas601 && Number(mtoCas601) !== 0) {
      if (!mtoCas236) {
        this.callModalErrorList([ConstantesExcepciones.CUS02_EX04]);
        return false;
      }/* else if (!mtoCas700){
        if(mtoCas235 === 'F' || mtoCas235 === '04' ||  mtoCas235 === 'A' 
          ||mtoCas235 === '07'){
            this.callModalErrorList([ConstantesExcepciones.CUS02_EX06]);
            return false;
        }
      }*/else if (erroresDoc === '1') {
        this.callModalErrorList([ConstantesExcepciones.CUS02_EX01]);
        return false;
      } else if (erroresDoc === '2') {
        this.callModalErrorList([ConstantesExcepciones.CUS02_EX02]);
        return false;
      } else if (erroresDoc === '3') {
        this.callModalErrorList([ConstantesExcepciones.CUS02_EX03]);
        return false;
      } else if(!expreg.test(mtoCas700)){
        this.errorsArray.push(ConstantesExcepciones.CUS02_EX05);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS02_VALIDAR_08);
      } else {
        return true;
      }
    }
  }

  public validarCondominos(): boolean {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559) === 1 &&
      this.preDeclaracion.declaracion.seccInformativa.condominos.lisCondomino.length === 0) {
      this.callModalErrorList([ConstantesExcepciones.CUS03_EX18]);
      return false;
    } else {
      return true;
    }
  }

  private excepcion1() {
    //debugger;
    const {
      mtoCas523, mtoCas524,
      mtoCas525, mtoCas601,
      mtoCas235, mtoCas236,mtoCas700
    } = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa;
    const erroresDoc = sessionStorage.getItem('SUNAT.errorPadronConyugue');
    var expreg = /^[a-zA-Z0-9 ]*$/;

    if ((!mtoCas523 || Number(mtoCas523) === 0) &&
      (!mtoCas524 || Number(mtoCas524) === 0) &&
      (!mtoCas525 || Number(mtoCas525) === 0)) {
      this.errorsArray.push('Debe seleccionar al menos un tipo de renta a declarar.');
      this.errorsArrayObj.push({
        url: Rutas.NATURAL + '/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabTipoDeclaracion',
        mensaje: 'Debe seleccionar al menos un tipo de renta a declarar.',
      });
    } if (mtoCas601 && Number(mtoCas601) !== 0) {
      //console.log(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas700)
      if (!mtoCas236) {
        this.errorsArray.push(ConstantesExcepciones.CUS02_EX04);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS02_VALIDAR_07);
      } else if (erroresDoc === '1') {
        this.errorsArray.push(ConstantesExcepciones.CUS02_EX01);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS02_VALIDAR_03);
      } else if (erroresDoc === '2') {
        this.errorsArray.push(ConstantesExcepciones.CUS02_EX02);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS02_VALIDAR_04);
      } else if (erroresDoc === '3') {
        this.errorsArray.push(ConstantesExcepciones.CUS02_EX03);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS02_VALIDAR_06);
      }else if(!expreg.test(mtoCas700)){
        this.errorsArray.push(ConstantesExcepciones.CUS02_EX05);
        this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS02_VALIDAR_08);
      }
    }
  }

  private excepcion2() {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559) === 1 &&
      this.preDeclaracion.declaracion.seccInformativa.condominos.lisCondomino.length === 0) {
      this.errorsArray.push('RUBRO CONDOMINIOS - Usted deberá registrar al menos un condómino.');
      this.errorsArrayObj.push({
        url: Rutas.NATURAL + '/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabCondominios',
        mensaje:
          'RUBRO CONDOMINIOS - Usted deberá registrar al menos un condómino.',
      });
    }
  }

  private excepcion3() {
    if (Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602) === 1 &&
      this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres.length === 0) {
      this.errorsArray.push('RUBRO ALQUILERES PAGADOS - Usted deberá registrar al menos un arrendador.');
      this.errorsArrayObj.push({
        url: Rutas.NATURAL + '/seccion-informativa',
        redirectParentTabId: 'tabInformativa',
        redirectTabId: 'tabAlquileresPagados',
        mensaje:
          'RUBRO ALQUILERES PAGADOS - Usted deberá registrar al menos un arrendador.',
      });
    }
  }

  private excepcion4() {
    const atribucionRecibida = this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos.filter(
      (x) => x.indTipoAtrib === '2'
    );
    if (atribucionRecibida.length > 1) {
      this.errorsArray.push(ConstantesExcepciones.CUS17_EX17);
      this.errorsArrayObj.push(ConstantesExcepcionesObj.CUS34_VALIDAR_1);
    }
  }

  private excepcion5() {
    const { mtoCas523, mtoCas524, mtoCas525 } = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa;
    const mtoCas100 = this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas100;
    const mtoCas350 = this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas350;
    const { mtoCas107, mtoCas108 } = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo;
    const suma = Number(mtoCas107) + Number(mtoCas108);

    // Renta Primera
    if (Number(mtoCas523) === 1) {
      if (Number(mtoCas350) > 0 && Number(mtoCas524) === 0) {
        this.errorsArray.push(
          'Se ha detectado que también tiene información correspondiente' +
          ' a Renta de Segunda Categoría. Verifique si se encuentra obligado a declarar antes de continuar.'
        );
        this.errorsArrayObj.push({
          url: Rutas.NATURAL + '/seccion-informativa',
          redirectParentTabId: 'tabInformativa',
          redirectTabId: 'tabTipoDeclaracion',
          mensaje:
            'Se ha detectado que también tiene información' +
            ' correspondiente a Renta de Segunda Categoría. Verifique si se encuentra obligado a declarar' +
            ' antes de continuar.',
        });
      }
      if (suma > 0 && Number(mtoCas525) === 0) {
        this.errorsArray.push(
          'Se ha detectado que también tiene información' +
          ' correspondiente a Renta de Trabajo y/o Fuente Extranjera. Verifique si se encuentra' +
          ' obligado a declarar antes de continuar.'
        );
        this.errorsArrayObj.push({
          url: Rutas.NATURAL + '/seccion-informativa',
          redirectParentTabId: 'tabInformativa',
          redirectTabId: 'tabTipoDeclaracion',
          mensaje:
            'Se ha detectado que también tiene información correspondiente' +
            ' a Renta de Trabajo y/o Fuente Extranjera. Verifique si se encuentra obligado a declarar' +
            ' antes de continuar.',
        });
      }
    }
    if (Number(mtoCas524) === 1) {
      if (Number(mtoCas100) > 0 && Number(mtoCas523) === 0) {
        this.errorsArray.push(
          'Se ha detectado que también tiene información correspondiente a Renta' +
          ' de Primera Categoría. Verifique si se encuentra obligado a declarar antes de continuar.'
        );
        this.errorsArrayObj.push({
          url: Rutas.NATURAL + '/seccion-informativa',
          redirectParentTabId: 'tabInformativa',
          redirectTabId: 'tabTipoDeclaracion',
          mensaje:
            'Se ha detectado que también tiene información correspondiente a Renta de Primera' +
            ' Categoría. Verifique si se encuentra obligado a declarar antes de continuar.',
        });
      }
      if (suma > 0 && Number(mtoCas525) === 0) {
        this.errorsArray.push(
          'Se ha detectado que también tiene información correspondiente a Renta de Trabajo' +
          ' y/o Fuente Extranjera. Verifique si se encuentra obligado a declarar antes de continuar.'
        );
        this.errorsArrayObj.push({
          url: Rutas.NATURAL + '/seccion-informativa',
          redirectParentTabId: 'tabInformativa',
          redirectTabId: 'tabTipoDeclaracion',
          mensaje:
            'Se ha detectado que también tiene información correspondiente a Renta de Trabajo' +
            ' y/o Fuente Extranjera. Verifique si se encuentra obligado a declarar antes de continuar.',
        });
      }
    }
    if (Number(mtoCas525) === 1) {
      if (Number(mtoCas100) > 0 && Number(mtoCas523) === 0) {
        this.errorsArray.push(
          'Se ha detectado que también tiene información correspondiente a Renta de Primera' +
          ' Categoría. Verifique si se encuentra obligado a declarar antes de continuar.'
        );
        this.errorsArrayObj.push({
          url: Rutas.NATURAL + '/seccion-informativa',
          redirectParentTabId: 'tabInformativa',
          redirectTabId: 'tabTipoDeclaracion',
          mensaje:
            'Se ha detectado que también tiene información correspondiente a Renta de Primera' +
            ' Categoría. Verifique si se encuentra obligado a declarar antes de continuar.',
        });
      }
      if (Number(mtoCas350) > 0 && Number(mtoCas524) === 0) {
        this.errorsArray.push(
          'Se ha detectado que también tiene información correspondiente a Renta de Segunda' +
          ' Categoría. Verifique si se encuentra obligado a declarar antes de continuar.'
        );
        this.errorsArrayObj.push({
          url: Rutas.NATURAL + '/seccion-informativa',
          redirectParentTabId: 'tabInformativa',
          redirectTabId: 'tabTipoDeclaracion',
          mensaje:
            'Se ha detectado que también tiene información correspondiente a Renta de Segunda' +
            ' Categoría. Verifique si se encuentra obligado a declarar antes de continuar.',
        });
      }
    }
  }
}