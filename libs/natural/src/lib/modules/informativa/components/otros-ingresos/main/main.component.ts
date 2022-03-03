import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RentasExoneradasComponent } from '../rentas-exoneradas/rentas-exoneradas.component';
import { RentasInafectasComponent } from '../rentas-inafectas/rentas-inafectas.component';
import { Sfec998MainComponent } from '../cas998/main/main.component';
import { C999MainComponent } from '../cas999/main/main.component';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { InfExoneradoInafModel } from '@path/natural/models/SeccionInformativa/InfOtrosIngresosModel';
import { ParametriaFormulario, PreDeclaracionService } from '@path/natural/services';
import { ListaParametrosModel } from '@path/natural/models';
import { SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';
import { CasillaService } from '@rentas/shared/core';

@Component({
  selector: 'app-sogmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SogMainComponent implements OnInit {

  private preDeclaracion: PreDeclaracionModel;
  private funcionesGenerales: FuncionesGenerales;
  public divRentasExoneradas: string;
  public divRentasInafectas: string;
  public casilla560 = this.casillaService.obtenerCasilla('560');
  public casilla561 = this.casillaService.obtenerCasilla('561');
  public casilla200 = this.casillaService.obtenerCasilla('200'); montoCasilla200: number;
  public casilla201 = this.casillaService.obtenerCasilla('201'); montoCasilla201: number;
  public casilla203 = this.casillaService.obtenerCasilla('203'); montoCasilla203: number;
  public casilla998 = this.casillaService.obtenerCasilla('998'); montoCasilla998: number;
  public casilla999 = this.casillaService.obtenerCasilla('999'); montoCasilla999: number;
  public casilla518 = this.casillaService.obtenerCasilla('518'); montoCasilla518: number;
  public listInafecta: InfExoneradoInafModel[];
  public listaOpcionesSiNo: ListaParametrosModel[] = [];

  constructor(
    private modalService: NgbModal,
    private preDeclaracionService: PreDeclaracionService,
    private casillaService: CasillaService,
    private cus05Service: ParametriaFormulario
) { }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listInafecta = this.preDeclaracion.declaracion.seccInformativa.exoneradaInafecta.lisExonInaf;
    this.listaOpcionesSiNo = this.cus05Service.obtenerOpcionesSiNo();
    this.divRentasExoneradas = String(this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas560));
    this.montoCasilla200 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas200);
    this.divRentasInafectas = String(this.funcionesGenerales
      .opcionalCero(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas561));
    this.montoCasilla201 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas201);
    this.montoCasilla203 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas203);
    this.montoCasilla998 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas998);
    this.montoCasilla999 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas999);
    this.montoCasilla518 = this.funcionesGenerales
      .opcionalNull(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas518);
  }

  public changeRadioExonerada(value: string): void {
    if (value === '1') {
      this.divRentasExoneradas = String(value);
    } else if (value === '0') {
      if (this.montoCasilla200 > 0) {
        this.callModal('Usted deberá eliminar los montos de rentas exoneradas registrados.');
        setTimeout(() => this.divRentasExoneradas = '1', 100);
        value = '1';
      } else {
        this.divRentasExoneradas = String(value);
      }
    }
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas560 = Number(value);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public changeRadioInafecta(value: string): void {
    if (value === '1') {
      this.divRentasInafectas = String(value);
    } else if (value === '0') {
      if (this.montoCasilla201 > 0) {
        this.callModal('Usted deberá eliminar los montos de rentas inafectas registrados.');
        setTimeout(() => this.divRentasInafectas = '1', 100);
        value = '1';
      } else {
        this.divRentasInafectas = String(value);
      }
    }

    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas561 = Number(value);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public RegistrarExo(event): void {
    event.srcElement.blur();
    event.preventDefault();
    if (this.divRentasExoneradas === '1') {
      setTimeout(() => {
        const modalRef = this.modalService.open(RentasExoneradasComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
        modalRef.componentInstance.inputFilasAsistente = this.casilla200?.filasAsistente || [] ;
        modalRef.componentInstance.datosCasilla.subscribe(($e) => {
          this.listInafecta = $e.listExonerada;
          this.montoCasilla200 = Number($e.sumaCasilla200);
          this.totalEjercicio();
        });
      }, 300);
    }
  }

  public RegistrarInafec(event): void {
    event.srcElement.blur();
    event.preventDefault();
    if (this.divRentasInafectas === '1') {
      setTimeout(() => {
        const modalRef = this.modalService.open(RentasInafectasComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
        modalRef.componentInstance.inputFilasAsistente = this.casilla201?.filasAsistente || [] ;
        modalRef.componentInstance.datosCasilla.subscribe(($e) => {
          this.listInafecta = $e.listInafecta;
          this.montoCasilla201 = Number($e.sumaCasilla201);
          this.totalEjercicio();
        });
      }, 300);
    }
  }

  public abrirCasilla998(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(Sfec998MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla998 = $resultado;
        this.totalEjercicio();
      });
    }, 300);
  }

  public abrirCasilla999(event): void {
    event.srcElement.blur();
    event.preventDefault();
    setTimeout(() => {
      const modalRef = this.modalService.open(C999MainComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
      modalRef.componentInstance.montoReturn.subscribe(($resultado) => {
        this.montoCasilla999 = $resultado;
        this.totalEjercicio();
      });
    }, 300);
  }

  public totalEjercicio(): void {
    this.montoCasilla518 =
      Number(this.montoCasilla200) + Number(this.montoCasilla201) +
      Number(this.montoCasilla203) + Number(this.montoCasilla998) +
      Number(this.montoCasilla999);
    this.guardarPredeclaracion();
  }

  private guardarPredeclaracion(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas200 = this.montoCasilla200;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas201 = this.montoCasilla201;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas203 = this.montoCasilla203;
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas518 = this.montoCasilla518;
    this.preDeclaracion.declaracion.seccInformativa.exoneradaInafecta.lisExonInaf = this.listInafecta;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: '',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }
}
