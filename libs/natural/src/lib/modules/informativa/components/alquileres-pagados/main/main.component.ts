import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaMantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgModel } from '@angular/forms';
import { InfAlquileresModel, PreDeclaracionModel, Casilla514Cabecera, LCas514Detalle, ListaParametrosModel } from '@path/natural/models';
import { ValidarDeduccionesGastos } from '@path/natural/modules/informativa/components/utils/validar-cas514-alquiler';
import { ParametriaFormulario, PreDeclaracionService } from '@path/natural/services';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { dtOptionsPN } from '@rentas/shared/constantes';
import { CasillaService } from '@rentas/shared/core';
import { ConstantesCasilla514 } from '@path/natural/utils';

@Component({
  selector: 'app-samain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SaMainComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  public dtOptions: DataTables.Settings = dtOptionsPN;
  public hide: boolean;
  public listaAlquileres: InfAlquileresModel[];
  public preDeclaracion: PreDeclaracionModel;
  private montoCasilla602: number;
  public casilla602 = this.casillaService.obtenerCasilla('602');
  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  public checkAlquileres = '1';
  private lista514: Casilla514Cabecera[];
  public listaOpcionesSiNo: ListaParametrosModel[] = [];
  private readonly TipoGastoAlquiler = '01';
  private readonly mensajeCas514 = 'Usted ha sido informado por terceros como un arrendatario que ha realizado gastos por alquileres.' +
    ' Sin embargo, en la presente opción declara que NO ha pagado dicho concepto.' +
    ' Por favor revise la Casilla 514 del presente Formulario Virtual a fin de continuar con su Declaración Anual.';
  private readonly mensajeRbNo = 'Usted deberá eliminar previamente la información de los alquileres registrados.';
  private readonly mensajeConformidadEliminarRegistro = 'Se eliminó el elemento correctamente.';
  private readonly mensajeEliminar = '¿Desea eliminar el registro?';
  private funcionesGenerales: FuncionesGenerales;

  constructor(
    private modalService: NgbModal,
    private predeclaracionService: PreDeclaracionService,
    private mostrarMensaje: MostrarMensajeService,
    private cus04Service: ParametriaFormulario,
    private casillaService: CasillaService) {
    super();
  }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.listaAlquileres = this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres;
    this.listaOpcionesSiNo = this.cus04Service.obtenerOpcionesSiNo();
    this.funcionesGenerales = FuncionesGenerales.getInstance();

    this.actualizarPreDeclaracionCasilla602();
    if (Number(this.montoCasilla602) === 0) {
      this.hide = true;
      this.checkAlquileres = '0';
    } else {
      this.hide = false;
      this.checkAlquileres = '1';
    }
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public mostrarMensajeInformativo(): boolean {
    const lista514 = this.obtenerLista514();
    return lista514.some(x => x.indArchPers === '1');
  }

  private obtenerLista514(): LCas514Detalle[] {
    const listasCasilla514 = this.preDeclaracion.declaracion.seccDeterminativa
      .rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    const listaAlquiler = listasCasilla514.find(
      (lista: Casilla514Cabecera) =>
        lista.indTipoGasto === ConstantesCasilla514.COD_TIPO_GASTO_ALQUILER
    );
    return listaAlquiler.casilla514Detalle.lisCas514;
  }

  private actualizarPreDeclaracionCasilla602(): void {
    this.montoCasilla602 = this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602 ?
      Number(this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602) : 0;
    this.valorCasilla602Personalizado();
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602 = this.montoCasilla602;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public agregarOActualizar(alquiler?: InfAlquileresModel, index?: number): void {
    const modalRef = this.modalService.open(SaMantenimientoComponent, this.funcionesGenerales.getModalOptions({size: 'lg', windowClass: 'custom-class'}));
    modalRef.componentInstance.inputListaAlquileres = this.listaAlquileres;
    modalRef.componentInstance.inputid = alquiler;
    modalRef.componentInstance.inputidIndex = index;
    modalRef.componentInstance.listaAlquileres.subscribe(($e) => {
      this.actualizarPredeclaracionAlquileres($e, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.mostrarMensaje.mensajeEliminar(this.mensajeEliminar).subscribe(data => {
      if (data === 'si') {
        this.actualizarPredeclaracionAlquileres(null, index);
        this.mostrarMensaje.callModal(this.mensajeConformidadEliminarRegistro);
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionAlquileres(data: InfAlquileresModel[], index: number): void {
    if (data !== null) { this.listaAlquileres = data; }
    if (index !== null) { this.listaAlquileres.splice(index, 1); }
    this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres = this.listaAlquileres;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public changeRadio(valueRadio: string, model?: NgModel): void {
    this.checkAlquileres = valueRadio;
    // model.control.markAsTouched();
    switch (valueRadio) {
      case '1': this.hide = false; break;
      case '0': {
        if (this.listaAlquileres.length > 0) {
          this.mostrarMensaje.callModal(this.mensajeRbNo);
          valueRadio = '1';
          setTimeout(() => this.checkAlquileres = '1', 200);
          this.hide = false;
        } else if (Number(this.preDeclaracion.indProc) === 1) {
          if (this.obtenerDataPersonalizadoCas514Alquileres().length !== 0) {
            this.mostrarMensaje.callModal(this.mensajeCas514);
            this.hide = false;
            valueRadio = '1';
            setTimeout(() => this.checkAlquileres = '1', 200);
          } else {
            this.hide = true;
          }
        } else {
          this.hide = true;
        }
      }
    }
    this.montoCasilla602 = Number(valueRadio);
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.preDeclaracion.declaracion.seccInformativa.casillaInformativa.mtoCas602 = this.montoCasilla602;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private obtenerDataPersonalizadoCas514Alquileres(): LCas514Detalle[] {
    let dataAlquiler514: LCas514Detalle[] = [];
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    const lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    lista514.forEach(x => {
      switch (x.indTipoGasto) {
        case this.TipoGastoAlquiler: dataAlquiler514 = x.casilla514Detalle.lisCas514; break;
      }
    });
    return dataAlquiler514;
  }

  private valorCasilla602Personalizado(): void {
    let dataAlquiler514 = [];
    if (Number(this.preDeclaracion.indProc) === 1) {
      this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
      this.lista514 = ValidarDeduccionesGastos.newInstance(this.lista514).completarRubroGasto();
      this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera = this.lista514;
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
      this.lista514.forEach(x => {
        switch (x.indTipoGasto) {
          case this.TipoGastoAlquiler: dataAlquiler514 = x.casilla514Detalle.lisCas514; break;
        }
      });
      this.montoCasilla602 = dataAlquiler514.length !== 0 ? 1 : this.montoCasilla602;
    }
  }
}
