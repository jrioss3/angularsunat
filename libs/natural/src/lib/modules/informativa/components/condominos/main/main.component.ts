import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ScMantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { ScImportarComponent } from '../importar/importar.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { PreDeclaracionModel, InfCondominoModel, ListaParametrosModel } from '@path/natural/models';
import { PreDeclaracionService, ParametriaFormulario } from '@path/natural/services';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';
import { CasillaService } from '@rentas/shared/core';

@Component({
  selector: 'app-scmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class ScMainComponent extends RenderizarPaginacion implements OnInit, OnDestroy, AfterViewInit {

  public hide = false;
  private preDeclaracion: PreDeclaracionModel;
  private modalMensajeref: NgbModalRef;
  private casilla559: number;
  public casilla559Desc = this.casillaService.obtenerCasilla('559');
  public numEj: string;
  public listaCondominios: InfCondominoModel[];
  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  public checkCondominos = '1';
  public listaOpcionesSiNo: ListaParametrosModel[] = [];
  public util: FuncionesGenerales;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  private readonly mensajeCheck = 'Recuerde que debe registrar el total de condóminos con los cuales' +
    ' comparte la propiedad del bien incluyendo sus datos de participación.';
  private readonly mensajeAlerta = 'Debe eliminar la información de los condóminos registrados.';
  private readonly mensajeEliminar = '¿Desea eliminar el registro?';
  private readonly mensajeConformidadEliminarRegistro = 'Se eliminó el elemento correctamente.';

  constructor(
    private modalService: NgbModal,
    private predeclaracionService: PreDeclaracionService,
    private mostrarMensaje: MostrarMensajeService,
    private casillaService: CasillaService,
    private cus03Service: ParametriaFormulario) {
    super();
    this.util = FuncionesGenerales.getInstance();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.numEj = this.predeclaracionService.obtenerAnioEjercicio();
    this.casilla559 = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559;
    this.listaCondominios = this.preDeclaracion.declaracion.seccInformativa.condominos.lisCondomino;
    this.listaOpcionesSiNo = this.cus03Service.obtenerOpcionesSiNo();
    this.estadoRbCondominos();
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public estadoRbCondominos(): void {
    if (Number(this.casilla559) === 0) {
      this.hide = true;
      this.checkCondominos = '0';
    } else {
      this.hide = false;
      this.checkCondominos = '1';
    }
  }

  public cambioRbCondomino(valueRadio: string, ngModelinput?: NgModel): void {
    this.checkCondominos = String(valueRadio);
    // ngModelinput.control.markAsTouched();
    switch (valueRadio) {
      case '1': { // checked
        this.mostrarMensaje.callModal(this.mensajeCheck);
        this.hide = false;
        this.casilla559 = Number(valueRadio);
        break;
      }
      case '0': { // unchecked
        this.validacionListaCondominos(0);
        break;
      }
    }
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas559 = this.casilla559;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private validacionListaCondominos(valueRadio: number): void {
    if (this.listaCondominios.length > 0) {
      this.casilla559 = 1;
      setTimeout(() => this.checkCondominos = '1', 200);
      this.hide = false;
      this.mostrarMensaje.callModal(this.mensajeAlerta);
    } else {
      this.casilla559 = valueRadio;
      this.hide = true;
    }
  }

  public importar(): void {
    this.modalMensajeref.close();
    const modalRef = this.modalService.open(ScImportarComponent, this.util.getModalOptions({}));
    modalRef.componentInstance.inputListaCondominios = this.listaCondominios;
    modalRef.componentInstance.listaCondominios.subscribe(data => {
      this.actualizarPredeclaracionCondominos(data, null);
      this.rerender();
    });
  }

  public agreagarOActualizar(condominos?: InfCondominoModel, index?: number): void {
    const modalRef = this.modalService.open(ScMantenimientoComponent, this.util.getModalOptions({}));
    modalRef.componentInstance.inputListaCondominios = this.listaCondominios;
    modalRef.componentInstance.inputCondominos = condominos;
    modalRef.componentInstance.inputIndexCondominos = index;
    modalRef.componentInstance.listaCondominios.subscribe(data => {
      this.actualizarPredeclaracionCondominos(data, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.mostrarMensaje.mensajeEliminar(this.mensajeEliminar).subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCondominos(null, index);
        this.mostrarMensaje.callModal(this.mensajeConformidadEliminarRegistro);
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCondominos(data: InfCondominoModel[], index: number): void {
    if (data !== null) { this.listaCondominios = data; }
    if (index !== null) { this.listaCondominios.splice(index, 1); }
    this.preDeclaracion.declaracion.seccInformativa.condominos.lisCondomino = this.listaCondominios;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public abrirMensajeImportar(content) {
    this.modalMensajeref = this.modalService.open(content, this.util.getModalOptions({}));
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
}
