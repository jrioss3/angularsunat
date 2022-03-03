import { CalculoRentaPrimeraService } from './../../../../services/calculo-renta-primera.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScCas100Component } from './cas100/main/main.component';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { IndicadorRentaService } from '../../../../services/indicador-renta.service';
import { ConstantesSeccionDeterminativa } from '@path/natural/utils';
import { SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { CasillaService } from '@rentas/shared/core';

@Component({
  selector: 'app-sd-primera-cat',
  templateUrl: './sd-primera-cat.component.html',
  styleUrls: ['./sd-primera-cat.component.css'],
})
export class SdPrimeraCatComponent implements OnInit {

  private funcionesGenerales: FuncionesGenerales;
  public casilla100 = this.casillaService.obtenerCasilla('100'); public montoCasilla100: number;
  public casilla557 = this.casillaService.obtenerCasilla('557'); public montoCasilla557: number;
  public casilla558 = this.casillaService.obtenerCasilla('558'); public montoCasilla558: number;
  public casilla102 = this.casillaService.obtenerCasilla('102'); public montoCasilla102: number;
  public casilla501 = this.casillaService.obtenerCasilla('501'); public montoCasilla501: number;
  public casilla502 = this.casillaService.obtenerCasilla('502'); public montoCasilla502: number;
  public casilla515 = this.casillaService.obtenerCasilla('515'); public montoCasilla515: number;
  private preDeclaracion: PreDeclaracionModel;

  constructor(
    private modalService: NgbModal,
    private casillaService: CasillaService,
    private indicadorRentaService: IndicadorRentaService,
    private calculoService: CalculoRentaPrimeraService) {
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();

    this.montoCasilla100 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas100);
    this.montoCasilla557 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas557);
    this.montoCasilla558 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas558);
    this.montoCasilla102 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas102);
    this.montoCasilla501 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas501);
    this.montoCasilla502 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas502);
    this.montoCasilla515 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas515);
  }

  public openAsistenteCasilla100(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(ScCas100Component, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
      modalRef.componentInstance.monto.subscribe(($e) => {
        this.montoCasilla100 = Number($e);
        this.calcularCasilla501();
      });
    }, 300);
  }

  public calcularCasilla102(): void {
    this.montoCasilla102 = Number(this.montoCasilla557) + Number(this.montoCasilla558);
    this.calcularCasilla501();
  }

  private calcularCasilla501(): void {
    this.montoCasilla501 = Number(this.montoCasilla100) + Number(this.montoCasilla102);
    this.calcularCasilla502();
  }

  private calcularCasilla502(): void {
    this.montoCasilla502 = Math.round(Number(this.montoCasilla501) * ConstantesSeccionDeterminativa.VEINTE_PORCIENTO);
    this.calcularCasilla515();
  }

  private calcularCasilla515(): void {
    this.montoCasilla515 = Number(this.montoCasilla501) - Number(this.montoCasilla502);
    this.setearObjetoEnPredeclaracion();
  }

  private setearObjetoEnPredeclaracion(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas100 = this.montoCasilla100;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas557 = this.montoCasilla557;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas558 = this.montoCasilla558;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas102 = this.montoCasilla102;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas501 = this.montoCasilla501;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas502 = this.montoCasilla502;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaPrimera.resumenPrimera.mtoCas515 = this.montoCasilla515;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.indicadorRentaService.obtenerIndicadorRentaModel();
    this.calculoService.calcularCasilla153();
  }
}
