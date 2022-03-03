import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { Casilla514Cabecera, LCas514Detalle } from '@path/natural/models/SeccionDeterminativa/DetRentaTrabajoModel';
import { Sfec514MainAlquileresComponent } from '../main-alquileres/main/main.component';
import { Sfec514MainAportacionesComponent } from '../main-aportaciones/main/main.component';
import { Sfec514MainHotelesComponent } from '../main-hoteles/main/main.component';
import { Sfec514MainArtesaniasComponent } from '../main-artesanias/main/main.component';
import { Sfec514MainMedicosComponent } from '../main-medicos/main/main.component';
import { ValidarDeduccionesGastos } from '../utils/vaidar-deducciones-gasto';
import { CalcularMontoMaximoDeducir } from '../utils/calcular-monto-maximo-deducir';
import { SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { ConstantesCombos,dtOptionsPN } from '@rentas/shared/constantes';
import { CasillaService } from '@rentas/shared/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import {ListaParametrosModel} from '@path/natural/models';
import {ParametriaFormulario } from '@path/natural/services';
import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { ConstantesExcepciones,ConstantesMensajesInformativos} from '@path/natural/utils';
import { ComboService } from '@rentas/shared/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class Sfec514MainComponent implements OnInit {

  public dtOptions: DataTables.Settings = dtOptionsPN;
  private preDeclaracion: PreDeclaracionModel;
  private lista514: Casilla514Cabecera[];
  public alquilerTotal: number;
  public medicototal: number;
  public aportacionTotal: number;
  public hotelTotal: number;
  public artesaniaTotal: number;
  public total514: number;
  private listaAlquiler: LCas514Detalle[];
  private funcionesGenerales: FuncionesGenerales;
  private descripcion: ListaParametrosModel[];
  private porcentajeDeduccion: number;
  

  @Input() inputFilasAsistente: any;
  @Output() montoReturn = new EventEmitter<number>();

  TipoGastoAlquiler = '01';
  TipoGastoMedicos = '03';
  TipoGastoAportaciones = '04';
  TipoGastoHoteles = '05';
  TipoGastoArtesanias = '06';
  anioEjercicio: number;
  // tslint:disable-next-line: ban-types
  cerrarModal: Function = () => {
    this.close();
  }

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private cus27Service: ParametriaFormulario,
    private comboService: ComboService,
    private casillaService: CasillaService,
    private mostrarMensaje: MostrarMensajeService) {
  }

  ngOnInit(): void {
    this.alquilerTotal = 0;
    this.medicototal = 0;
    this.aportacionTotal = 0;
    this.hotelTotal = 0;
    this.artesaniaTotal = 0;
    this.total514 = 0;
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.anioEjercicio = Number(this.preDeclaracion.declaracion.generales.cabecera.numEjercicio);
    this.getPorcentajeDeduccion();

    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    this.lista514 = ValidarDeduccionesGastos.newInstance(this.lista514).completarRubroGasto();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera = this.lista514;
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.lista514.forEach(x => {
      this.total514 = this.total514 + x.mtoGasto;
      switch (x.indTipoGasto) {
        case this.TipoGastoAlquiler: {
          this.listaAlquiler = x.casilla514Detalle.lisCas514
            .map(e => new CalcularMontoMaximoDeducir(e).getMontoCalculado());
          const index = this.getIndexCasilla514Cabecera(x.indTipoGasto);
          this.setListaAlquileres(index, this.listaAlquiler);

          let mtoGastoAlquileres = x.casilla514Detalle.lisCas514.filter(y => y.indEstFormVirt === '1').reduce((total, alquileres) => total + alquileres.mtoDeduccion, 0);
          mtoGastoAlquileres = Number(mtoGastoAlquileres.toFixed(2));//PMGC-537
          this.alquilerTotal = mtoGastoAlquileres; //x.mtoGasto;

          break;
        }
        case this.TipoGastoMedicos: {
          let mtoGastoMedicos = x.casilla514Detalle.lisCas514.filter(y => y.indEstFormVirt === '1').reduce((total, medicos) => total + medicos.mtoDeduccion, 0);
          mtoGastoMedicos = Number(mtoGastoMedicos.toFixed(2));//PMGC-537
          this.medicototal = mtoGastoMedicos; //x.mtoGasto;
          break;
        }
        case this.TipoGastoAportaciones: {
          let mtoGastoAportaciones = x.casilla514Detalle.lisCas514.filter(y => y.indEstFormVirt === '1').reduce((total, aportaciones) => total + aportaciones.mtoDeduccion, 0);
          mtoGastoAportaciones = Number(mtoGastoAportaciones.toFixed(2));//PMGC-537
          this.aportacionTotal = mtoGastoAportaciones; // x.mtoGasto;
          break;
        }
        case this.TipoGastoHoteles: {
          var listaHotel = x.casilla514Detalle.lisCas514;
          listaHotel.forEach(m => {
          if (m.indEstFormVirt === '1') {          
            m.mtoDeduccion = this.funcionesGenerales.redondearMontos((Number(m.mtoComprob) * (this.porcentajeDeduccion / 100)), 2);
          }});

          let mtoHoteles = listaHotel.filter(x => x.indEstFormVirt === '1').reduce((total, hoteles) => total + Number(hoteles.mtoDeduccion), 0);
          mtoHoteles = Number(mtoHoteles.toFixed(2));//PMGC-537
          this.hotelTotal = mtoHoteles;//x.mtoGasto;
          break;
        }
        case this.TipoGastoArtesanias: {
          var listaArtesanos = x.casilla514Detalle.lisCas514
            .map(e => new CalcularMontoMaximoDeducir(e, this.anioEjercicio).getMontoDeduccionActualizadoArtesania());
          
          // listaArtesanos.forEach(m => {
          // if (m.indEstFormVirt === '1') {          
          //   m.mtoDeduccion = this.funcionesGenerales.redondearMontos((Number(m.mtoComprob) * (this.porcentajeDeduccion / 100)), 2);
          // }});

          let mtoGastoArtesanias = listaArtesanos.filter(y => y.indEstFormVirt === '1').reduce((total, artesanias) => total + artesanias.mtoDeduccion, 0);
          mtoGastoArtesanias = Number(mtoGastoArtesanias.toFixed(2));//PMGC-537
          this.artesaniaTotal = mtoGastoArtesanias; //x.mtoGasto;
          break;
        }
      }
    });
    this.calcularTotal();
  }

  private getPorcentajeDeduccion(): void {
    const listaPorcentajesDeduccion = this.comboService.obtenerComboPorNumero(ConstantesCombos.PORCENTAJE_DEDUCIR);
    this.porcentajeDeduccion = Number(listaPorcentajesDeduccion.find(item => item.desc == this.anioEjercicio.toString()).val);
  }

  public openBienes(): void {
    const modalRefBienes = this.modalService.
      open(Sfec514MainAlquileresComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
    modalRefBienes.componentInstance.cerrarModalPadre = this.cerrarModal;
    modalRefBienes.componentInstance.total.subscribe(($e) => {
      this.alquilerTotal = $e;
      this.calcularTotal();
    });
  }

  public openMedicos(): void {
    const modalRefMedicos = this.modalService.
      open(Sfec514MainMedicosComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
    modalRefMedicos.componentInstance.total.subscribe(($e) => {
      this.medicototal = $e;
      this.calcularTotal();
    });
  }

  public openAportes(): void {
    const modalRefAportes = this.modalService.
      open(Sfec514MainAportacionesComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
    modalRefAportes.componentInstance.total.subscribe(($e) => {
      this.aportacionTotal = $e;
      this.calcularTotal();
    });
  }

  public openHoteles(): void {
    const modalRefHoteles = this.modalService.
    open(Sfec514MainHotelesComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
    modalRefHoteles.componentInstance.total.subscribe(($e) => {
      this.hotelTotal = $e;
      this.calcularTotal();
    });
  }

  public openArtesanias(): void {
    const modalRefArtesanias = this.modalService.
    open(Sfec514MainArtesaniasComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
    modalRefArtesanias.componentInstance.total.subscribe(($e) => {
      this.artesaniaTotal = $e;
      this.calcularTotal();
    });
  }

  private calcularTotal(): void {
    this.total514 = Math.round(this.alquilerTotal + this.hotelTotal + this.medicototal + this.aportacionTotal + this.artesaniaTotal);
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas514 = this.total514;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.montoReturn.emit(this.total514);
  }

  private close(): void {
    this.activeModal.close();
  }

  private setListaAlquileres(index: number, lista: LCas514Detalle[]): void {
    this.preDeclaracion.declaracion
      .seccDeterminativa.rentaTrabajo.casilla514Cabecera
      .lisCas514Cabecera[index]
      .casilla514Detalle.lisCas514 = lista;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private getIndexCasilla514Cabecera(tipo: string): number {
    return this.preDeclaracion.declaracion
      .seccDeterminativa.rentaTrabajo
      .casilla514Cabecera.lisCas514Cabecera
      .findIndex(e => e.indTipoGasto === tipo);
  }

  public existeCodFilaAsistente(codigo: string): boolean {
    const data = this.inputFilasAsistente.find((item) => item.codFila === codigo);
    return data?.codFila ? true : false;
  }

  public getDescripcionFilaAsistente(codigo: string): string {
    return this.casillaService.filtrarFilaAsistentePorCodigoFila(codigo, this.inputFilasAsistente);
  }

  private getComprobanteHoteles(cod: string): string {
    return this.cus27Service.obtenerTipoComprobante_cus32_Hoteles().filter(x => x.val === cod)[0].desc;
  }

  private getComprobanteArtesanias(cod: string): string {
    return this.cus27Service.obtenerTipoComprobante_cus32_Artesanias().filter(x => x.val === cod)[0].desc;
  }


  private getComprobanteMedicos(cod: string): string {
    return this.cus27Service.obtenerTipoComprobante_cus32_Medicos().filter(x => x.val === cod)[0].desc;
  }

  private getComprobanteAlquiler(cod: string): string {
    return this.cus27Service.obtenerTipoComprobante_cus27().filter(x => x.val === cod)[0].desc;
  }

  public exportar(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    const ArrayHoteles = new Array();
    const ArrayServProf = new Array();
    const ArrayAlquileres = new Array();
    const ArrayEssalud = new Array();
    const ArrayArtesanias = new Array();
    this.lista514.forEach(x => {
      switch (x.indTipoGasto) {
        case this.TipoGastoAlquiler: {
          for (let listaAlquiler of x.casilla514Detalle.lisCas514){
            ArrayAlquileres.push({
              'RUC': listaAlquiler.numDocEmisor,
              'DOCUMENTO': this.getComprobanteAlquiler(listaAlquiler.codTipComprob),
              'NUMERO': listaAlquiler.numSerie + "-" +listaAlquiler.numComprob,
              'FECHA': !!!listaAlquiler.fecComprob  ? '' : moment(listaAlquiler.fecComprob.substring(0, 10)).format('DD/MM/YYYY'),
              'MONTO': 'PEN ' +  listaAlquiler.mtoComprob.toFixed(2),
              'MONTO DEDUCIBLE': 'PEN ' + listaAlquiler.mtoDeduccion.toFixed(2)
            });
          }
          break;
        }
        case this.TipoGastoMedicos: {
          for (let listaMedicos of x.casilla514Detalle.lisCas514){
            ArrayServProf.push({
              'RUC': listaMedicos.numDocEmisor,
              'DOCUMENTO': this.getComprobanteMedicos(listaMedicos.codTipComprob),
              'NUMERO': listaMedicos.numSerie + "-" +listaMedicos.numComprob,
              'FECHA': !!!listaMedicos.fecPago  ? '' : moment(listaMedicos.fecPago.substring(0, 10)).format('DD/MM/YYYY'),
              'MONTO': 'PEN ' + listaMedicos.mtoComprob.toFixed(2),
              'MONTO DEDUCIBLE':'PEN ' + listaMedicos.mtoDeduccion.toFixed(2)
            });
          }
          break;
        }
        case this.TipoGastoAportaciones: {
          for (let listaAportaciones of x.casilla514Detalle.lisCas514){
            ArrayEssalud.push({
              'RUC': listaAportaciones.numDocEmisor,
              'DOCUMENTO': 'FV-1676',
              'NUMERO': listaAportaciones.numFor ,
              'FECHA': !!!listaAportaciones.fecPago  ? '' : moment(listaAportaciones.fecPago.substring(0, 10)).format('DD/MM/YYYY'),
              'MONTO': 'PEN ' +  listaAportaciones.mtoComprob.toFixed(2),
              'MONTO DEDUCIBLE':'PEN ' + listaAportaciones.mtoDeduccion.toFixed(2)
            });
          }
          break;
        }
        case this.TipoGastoHoteles: {
          for (let listaHoteles of x.casilla514Detalle.lisCas514){
            ArrayHoteles.push({
              'RUC': listaHoteles.numDocEmisor,
              'DOCUMENTO': this.getComprobanteHoteles(listaHoteles.codTipComprob),
              'NUMERO': listaHoteles.numSerie + "-" +listaHoteles.numComprob,
              'FECHA':!!!listaHoteles.fecComprob  ? '' : moment(listaHoteles.fecComprob.substring(0, 10)).format('DD/MM/YYYY'),
              'MONTO': 'PEN ' + listaHoteles.mtoComprob.toFixed(2),
              'MONTO DEDUCIBLE':'PEN ' +  listaHoteles.mtoDeduccion.toFixed(2)
            });
          }
          break;
        }
        case this.TipoGastoArtesanias:{
          //Descarga artesanias
          for (let listaArtesanias of x.casilla514Detalle.lisCas514){
            ArrayArtesanias.push({
              'RUC': listaArtesanias.numDocEmisor,
              'DOCUMENTO': this.getComprobanteArtesanias(listaArtesanias.codTipComprob),
              'NUMERO': listaArtesanias.numSerie + "-" +listaArtesanias.numComprob,
              'FECHA':!!!listaArtesanias.fecComprob  ? '' : moment(listaArtesanias.fecComprob.substring(0, 10)).format('DD/MM/YYYY'),
              'MONTO': 'PEN ' + listaArtesanias.mtoComprob.toFixed(2),
              'MONTO DEDUCIBLE':'PEN ' + listaArtesanias.mtoDeduccion.toFixed(2)
            });
          }
          break;
        }
      }
    });
    const zip = new JSZip();
    
    ArrayHoteles.length > 0 ? zip.file('FV709_RUC_PERIODO_C514_hoteles.xls', this.funcionesGenerales.convertirExcelBlob(ArrayHoteles)):"";
    ArrayServProf.length > 0 ? zip.file('FV709_RUC_PERIODO_C514_serv_prof.xls', this.funcionesGenerales.convertirExcelBlob(ArrayServProf)):"";
    ArrayAlquileres.length > 0 ? zip.file('FV709_RUC_PERIODO_C514_alquiler.xls', this.funcionesGenerales.convertirExcelBlob(ArrayAlquileres)):"";
    ArrayEssalud.length > 0 ? zip.file('FV709_RUC_PERIODO_C514_essalud.xls', this.funcionesGenerales.convertirExcelBlob(ArrayEssalud)):"";
    ArrayArtesanias.length > 0 ? zip.file('FV709_RUC_PERIODO_C514_artesania.xls', this.funcionesGenerales.convertirExcelBlob(ArrayArtesanias)):"";

    //downloading zip file
    if(ArrayHoteles.length>0 || ArrayServProf.length > 0 ||
       ArrayAlquileres.length > 0 || ArrayEssalud.length > 0 || ArrayArtesanias.length > 0  ){
          zip.generateAsync({ type: 'blob' }).then(function (blob) {
            saveAs(blob, 'FV709_RUC_PERIODO_C514.zip');
          });
       }
       else{
          this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_NO_HAY_REGISTROS_EXPORTAR) 
       }
  }
}
