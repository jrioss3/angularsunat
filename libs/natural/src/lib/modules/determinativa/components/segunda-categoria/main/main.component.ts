import { CalculoRentaSegundaService } from './../../../../../services/calculo-renta-segunda.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { C350MainComponent } from '../cas350/main/main.component';
import { C355MainComponent } from '../cas355/main/main.component';
import { C385MainComponent } from '../cas385/main/main.component';
import { ConstantesSeccionDeterminativa } from '@path/natural/utils/constanteSeccionDeterminativa';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { CasillaService } from '@rentas/shared/core';

@Component({
  selector: 'app-sscmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class SscMainComponent implements OnInit {

  private funcionesGenerales: FuncionesGenerales;
  public casilla350 = this.casillaService.obtenerCasilla('350'); public montoCasilla350: number;
  public casilla385 = this.casillaService.obtenerCasilla('385'); public montoCasilla385: number;
  public casilla355 = this.casillaService.obtenerCasilla('355'); public montoCasilla355: number;
  public casilla353 = this.casillaService.obtenerCasilla('353'); public montoCasilla353: number;
  public casilla354 = this.casillaService.obtenerCasilla('354'); public montoCasilla354: number;
  public casilla356 = this.casillaService.obtenerCasilla('356'); public montoCasilla356: number;
  private preDeclaracion: PreDeclaracionModel;

  constructor(
    private modalService: NgbModal,
    private casillaService: CasillaService,
    private calculoService: CalculoRentaSegundaService) { }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.montoCasilla350 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas350);
    this.montoCasilla385 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas385);
    this.montoCasilla355 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas355);
    this.montoCasilla353 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas353);
    this.montoCasilla354 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas354);
    this.montoCasilla356 = this.funcionesGenerales.
      opcionalNull(this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas356);
  }

  public cas350(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(C350MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla350 = Number($resultado);
        this.calcularCasilla353();
      });
    }, 300);
  }

  public cas355(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(C355MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla355 = Number($resultado);
        this.calcularCasilla356();
      });
    }, 300);
  }

  public cas385(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(C385MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg', windowClass: 'custom-class2' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla385 = Number($resultado);
        this.calcularCasilla356();
      });
    }, 300);
  }

  private calcularCasilla353(): void {
    this.montoCasilla353 = Math.round(Number(this.montoCasilla350) * ConstantesSeccionDeterminativa.VEINTE_PORCIENTO);
    this.calcularCasilla354();
  }

  private calcularCasilla354(): void {
    this.montoCasilla354 = Number(this.montoCasilla350) - Number(this.montoCasilla353);
    this.calcularCasilla356();
  }

  private calcularCasilla356(): void {
    const resultado = Number(this.montoCasilla354) - Number(this.montoCasilla355) + Number(this.montoCasilla385);
    this.montoCasilla356 = resultado < 0 ? 0 : resultado;
    this.guardarPreedeclaracion();
  }

  public guardarPreedeclaracion(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas353 = this.montoCasilla353;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas354 = this.montoCasilla354;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaSegunda.resumenSegunda.mtoCas356 = this.montoCasilla356;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.calculoService.calcularCasilla357();
  }
}
