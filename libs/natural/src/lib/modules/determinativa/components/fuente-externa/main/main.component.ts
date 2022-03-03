import { ComboService, CasillaService, AbrirModalService, ModalConfirmarService } from '@rentas/shared/core';
import { CalculoRentaTrabajoService } from './../../../../../services/calculo-renta-trabajo.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SfeC111MainComponent } from '../cas111/main/main.component';
import { Sfec519MainComponent } from '../cas519/main/main.component';
import { ScCas107Component } from '../cas107/main/main.component';
import { C522MainComponent } from '../cas522/main/main.component';
import { ScCas108Component } from '../cas108/main/main.component';
import { Sfec514MainComponent } from '../cas514/main/main.component';
import { SfeCas116MainComponent } from '../cas116/main/main.component';
import { ConstantesSeccionDeterminativa } from '@path/natural/utils/constanteSeccionDeterminativa';
import { UtilsComponent } from '../../../../../components/utils/utils.component';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { IndicadorRentaService } from '@path/natural/services/indicador-renta.service';
import { ConstantesExcepciones } from '@path/natural/utils';
import { Casilla514Cabecera, LCas514Detalle } from '@path/natural/models';
import { SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { ConstantesCombos } from '@rentas/shared/constantes';
import { CalcularMontoMaximoDeducir } from '../cas514/utils/calcular-monto-maximo-deducir';

@Component({
  selector: 'app-sfmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SfMainComponent implements OnInit {

  private funcionesGenerales: FuncionesGenerales;
  public casilla107 = this.casillaService.obtenerCasilla('107'); public montoCasilla107: number;
  public casilla507 = this.casillaService.obtenerCasilla('507'); public montoCasilla507: number;
  public casilla508 = this.casillaService.obtenerCasilla('508'); public montoCasilla508: number;
  public casilla108 = this.casillaService.obtenerCasilla('108'); public montoCasilla108: number;
  public casilla509 = this.casillaService.obtenerCasilla('509'); public montoCasilla509: number;
  public casilla111 = this.casillaService.obtenerCasilla('111'); public montoCasilla111: number;
  public casilla510 = this.casillaService.obtenerCasilla('510'); public montoCasilla510: number;
  public casilla511 = this.casillaService.obtenerCasilla('511'); public montoCasilla511: number;
  public casilla514 = this.casillaService.obtenerCasilla('514'); public montoCasilla514: number;
  public casilla512 = this.casillaService.obtenerCasilla('512'); public montoCasilla512: number;
  public casilla522 = this.casillaService.obtenerCasilla('522'); public montoCasilla522: number;
  public casilla519 = this.casillaService.obtenerCasilla('519'); public montoCasilla519: number;
  public casilla513 = this.casillaService.obtenerCasilla('513'); public montoCasilla513: number;
  public casilla116 = this.casillaService.obtenerCasilla('116'); public montoCasilla116: number;
  public casilla517 = this.casillaService.obtenerCasilla('517'); public montoCasilla517: number;
  private mtoTotalCasilla514 = 0;
  private valorUIT: number;
  private calculo24UIT: number;
  private listaCasilla514: Casilla514Cabecera[];
  private porcentajeDeduccion: number;

  anioEjercicio: number;

  constructor(
    private abrirModalService: AbrirModalService,
    private casillaService: CasillaService,
    private modalMensejaService: ModalConfirmarService,
    private indiRenta: IndicadorRentaService,
    private comboService: ComboService,
    private calculoService: CalculoRentaTrabajoService,
    private cdRef: ChangeDetectorRef) { }

  preDeclaracion: PreDeclaracionModel;

  ngOnInit(): void {    
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.anioEjercicio = Number(this.preDeclaracion.declaracion.generales.cabecera.numEjercicio);
    this.getPorcentajeDeduccion();        
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.calcularMontosGastosCasilla514();
    this.montoCasilla107 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas107);
    this.montoCasilla507 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas507);
    this.montoCasilla508 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas508);
    this.montoCasilla108 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas108);
    this.montoCasilla509 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas509);
    this.montoCasilla111 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas111);
    this.montoCasilla510 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas510);
    this.montoCasilla511 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas511);
    this.montoCasilla514 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas514);
    this.montoCasilla512 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas512);
    this.montoCasilla522 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas522);
    this.montoCasilla519 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas519);
    this.montoCasilla513 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas513);
    this.montoCasilla116 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116);
    this.montoCasilla517 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas517);
    this.valorUIT = this.comboService.obtenerUitEjercicioActual();
    // CALCULOS PREVIOS
    this.calculo24UIT = this.valorUIT * ConstantesSeccionDeterminativa.CANTIDAD_UIT_VEINTICUATRO;

    this.cdRef.detectChanges();

    

    
  }


  private calcularMontosGastosCasilla514(): void {
    this.listaCasilla514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    let alquiler514: LCas514Detalle[] = [];
    let medicos514: LCas514Detalle[] = [];
    let aportaciones514: LCas514Detalle[] = [];
    let hoteles514: LCas514Detalle[] = [];
    let artesania514: LCas514Detalle[] = [];

    let mtoAlquiler = 0;
    let mtoMedicos = 0;
    let mtoAportaciones = 0;
    let mtoHoteles = 0;
    let mtoArtesanos = 0;

    this.listaCasilla514.forEach(x => {
      switch (x.indTipoGasto) {
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_ALQUILERES: {
          alquiler514 = x.casilla514Detalle.lisCas514;
          break;
        }
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_MEDICO: {
          medicos514 = x.casilla514Detalle.lisCas514;
          break;
        }
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_APORTACIONES: {
          aportaciones514 = x.casilla514Detalle.lisCas514;
          break;
        }
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_HOTELES: {
          hoteles514 = x.casilla514Detalle.lisCas514;
          break;
        }
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_ARTESANIAS: {
          artesania514 = x.casilla514Detalle.lisCas514;
          break;
        }
      }
    });
    mtoAlquiler = [...alquiler514].filter(x => x.indEstFormVirt === '1').reduce((total, alquileres) => total + alquileres.mtoDeduccion, 0);
    mtoAlquiler = Number(mtoAlquiler.toFixed(2));
    // MONTO MEDICOS
    mtoMedicos = medicos514.reduce((total, medicos) => total + medicos.mtoDeduccion, 0);
    mtoMedicos = Number(mtoMedicos.toFixed(2));
    // MONTO APORTACIONES
    mtoAportaciones = aportaciones514.reduce((total, aportaciones) => total + aportaciones.mtoDeduccion, 0);
    mtoAportaciones = Number(mtoAportaciones.toFixed(2));
    // MONTO HOTELES
    hoteles514.forEach(m => {
      if (m.indEstFormVirt === '1') {          
        m.mtoDeduccion = this.funcionesGenerales.redondearMontos((Number(m.mtoComprob) * (this.porcentajeDeduccion / 100)), 2);
      }});

    mtoHoteles = hoteles514.filter(x => x.indEstFormVirt === '1').reduce((total, hoteles) => total + hoteles.mtoDeduccion, 0);
    mtoHoteles = Number(mtoHoteles.toFixed(2));
    // MONTO ARTESANOS
    artesania514.map(e => new CalcularMontoMaximoDeducir(e, this.anioEjercicio).getMontoDeduccionActualizadoArtesania());
    mtoArtesanos = artesania514.filter(x => x.indEstFormVirt === '1').reduce((total, artesanos) => total + artesanos.mtoDeduccion, 0);
    mtoArtesanos = Number(mtoArtesanos.toFixed(2));

    this.mtoTotalCasilla514 = Math.round(mtoAlquiler + mtoMedicos + mtoAportaciones + mtoHoteles + mtoArtesanos);
  }

  private getPorcentajeDeduccion(): void {
    const listaPorcentajesDeduccion = this.comboService.obtenerComboPorNumero(ConstantesCombos.PORCENTAJE_DEDUCIR);
    this.porcentajeDeduccion = Number(listaPorcentajesDeduccion.find(item => item.desc == this.anioEjercicio.toString()).val);
  }

  public abrirModal107(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.abrirModalService.abrirModal(ScCas107Component, { size: 'lg', windowClass: 'custom-class' });
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla107 = $resultado;
        this.calcularCasilla507();
      });
    }, 300);
  }

  public abrirModal108(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.abrirModalService.abrirModal(ScCas108Component, { size: 'lg', windowClass: 'custom-class2' });
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla108 = $resultado;
        this.calcularCasilla509();
      });
    }, 300);
  }

  public abrirModal111(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.abrirModalService.abrirModal(SfeC111MainComponent, { size: 'lg', windowClass: 'custom-class2' });
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla111 = $resultado;
        this.calcularCasilla510();
      });
    }, 300);
  }

  public abrirModal514(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.abrirModalService.abrirModal(Sfec514MainComponent, { size: 'lg' });
      modalRef.componentInstance.inputFilasAsistente = this.casilla514?.filasAsistente || [];
      modalRef.componentInstance.montoReturn.subscribe(($e) => {
        this.mtoTotalCasilla514 = $e;
        this.calcularCasilla514();
        this.calcularCasilla512();
      });
    }, 300);
  }

  public abrirModal522(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.abrirModalService.abrirModal(C522MainComponent, { size: 'lg' });
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla522 = $resultado;
        if (Number(this.montoCasilla522) > Number(this.montoCasilla509)) {
          this.modalMensejaService.msgValidaciones(ConstantesExcepciones.CUS17_EX10, 'Mensaje');
        }
        this.calcularCasilla513();
      });
    }, 300);
  }

  public abrirModal519(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.abrirModalService.abrirModal(Sfec519MainComponent, { size: 'lg', windowClass: 'custom-class' });
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        const calculo = 0.10 * (Number(this.montoCasilla512) + Number(this.montoCasilla116));
        this.montoCasilla519 = Math.round(Math.min($resultado, calculo));
        this.calcularCasilla513();
      });
    }, 300);
  }

  public abrirModal116(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.abrirModalService.abrirModal(SfeCas116MainComponent, { size: 'lg', windowClass: 'custom-class' });
      modalRef.componentInstance.mto116.subscribe(($resultado) => {
        this.montoCasilla116 = $resultado < 0 ? 0 : $resultado;
        this.calcularCasilla517();
      });
    }, 300);
  }

  private calcularCasilla514(): void {
    const monto1 = this.mtoTotalCasilla514;
    const monto2 = this.valorUIT * 3;
    const monto3 = Number(this.montoCasilla510) - Number(this.montoCasilla511);
    this.montoCasilla514 = Math.min(monto1, monto2, monto3);
  }

  private calcularCasilla507(): void {
    const resultado = Number(this.montoCasilla107) * ConstantesSeccionDeterminativa.VEINTE_PORCIENTO;
    this.montoCasilla507 = resultado > this.calculo24UIT ? this.calculo24UIT : Math.round(resultado);
    this.calcularCasilla508();
  }

  private calcularCasilla508(): void {
    this.montoCasilla508 = Number(this.montoCasilla107) - Number(this.montoCasilla507);
    this.calcularCasilla509();
  }

  private calcularCasilla509(): void {
    this.montoCasilla509 = Number(this.montoCasilla508) + Number(this.montoCasilla108);
    this.calcularCasilla510();
  }

  private calcularCasilla510(): void {
    this.montoCasilla510 = Number(this.montoCasilla509) + Number(this.montoCasilla111);
    this.calcularCasilla511();
  }

  private calcularCasilla511(): void {
    const calculadoUit = this.valorUIT * ConstantesSeccionDeterminativa.CANTIDAD_UIT_CASILLA511;
    this.montoCasilla511 = Number(this.montoCasilla510) <= calculadoUit ? Number(this.montoCasilla510) : calculadoUit;
    this.calcularCasilla514();
    this.calcularCasilla512();
  }

  private calcularCasilla512(): void {
    const resultado = Number(this.montoCasilla510) - Number(this.montoCasilla511) - Number(this.montoCasilla514);
    this.montoCasilla512 = resultado < 0 ? 0 : resultado;
    this.calcularCasilla513();
  }

  private calcularCasilla513(): void {
    let resultado = 0;
    if (Number(this.montoCasilla522) > Number(this.montoCasilla509)) {
      if (Number(this.montoCasilla509) === 0) {
        resultado = Number(this.montoCasilla512) - Number(this.montoCasilla519);
      } else if (Number(this.montoCasilla509) > 0) {
        resultado = Number(this.montoCasilla512) - (Number(this.montoCasilla509) + Number(this.montoCasilla519));
      }
    } else {
      resultado = Number(this.montoCasilla512) - (Number(this.montoCasilla522) + Number(this.montoCasilla519));
    }

    this.montoCasilla513 = resultado < 0 ? 0 : resultado;
    this.calcularCasilla517();
  }

  private calcularCasilla517(): void {
    const resultado = Number(this.montoCasilla513) + Number(this.montoCasilla116);
    this.montoCasilla517 = resultado < 0 ? 0 : resultado;
    this.settearTotales();
  }

  // --------------------------------------
  private settearTotales(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas107 = this.montoCasilla107;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas507 = this.montoCasilla507;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas508 = this.montoCasilla508;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas108 = this.montoCasilla108;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas509 = this.montoCasilla509;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas111 = this.montoCasilla111;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas510 = this.montoCasilla510;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas511 = this.montoCasilla511;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas514 = this.montoCasilla514;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas512 = this.montoCasilla512;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas522 = this.montoCasilla522;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas519 = this.montoCasilla519;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas513 = this.montoCasilla513;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas116 = this.montoCasilla116;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas517 = this.montoCasilla517;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.indiRenta.obtenerIndicadorRentaModel();
    this.calculoService.calcularCasilla120();
  }
}
