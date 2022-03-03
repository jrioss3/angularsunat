import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { Inft8999DonacionModel } from '@path/juridico/models/SeccionInformativa/inft8999DonacionModel';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ConstantesCadenas, ConstantesCombos, dtOptions, MensajeGenerales } from '@rentas/shared/constantes';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { RenderizarPaginacion, SessionStorage } from '@rentas/shared/utils';
import { ListaParametro } from '@rentas/shared/types';
import { CasillaService, ComboService, ModalConfirmarService, AbrirModalService } from '@rentas/shared/core';
import { DonacionesRegistroComponent } from '../donaciones-registro/donaciones-registro.component';

@Component({
  selector: 'app-idmain',
  templateUrl: './donaciones.component.html',
  styleUrls: ['./donaciones.component.css'],
})
export class DonacionesComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  private preDeclaracion: PreDeclaracionModel;
  public registerForm: FormGroup;
  public listaDonaciones: Inft8999DonacionModel[];
  public dtOptions: DataTables.Settings = dtOptions;
  public montoDonaciones: number;
  public dtTrigger: Subject<any> = new Subject();
  private doc: ListaParametro[];
  private tipo: ListaParametro[];
  public casilla819 = this.casillaService.obtenerCasilla('819');
  private modalidad: ListaParametro[];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(
    private casillaService: CasillaService,
    private abrirModalService: AbrirModalService,
    private modalMensejaService: ModalConfirmarService,
    private comboService: ComboService,
    private formBuilder: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.ejecutarInicializacion();
  }

  public ejecutarInicializacion(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.listaDonaciones = this.preDeclaracion.declaracion.seccInformativa.t8999donacion.lisT8999donacion;
    const cas819 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas819;
    this.registerForm = this.formBuilder.group({
      rdDonaciones: [String(cas819)]
    });
    this.montoDonaciones = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas227;
    this.doc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.tipo = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DONACION);
    this.modalidad = this.comboService.obtenerComboPorNumero(ConstantesCombos.MODALIDAD_DONACION);
    this.rerender();
  }

  public ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  public get f(): { [key: string]: AbstractControl; } {
    return this.registerForm.controls;
  }

  public seleccionarRespuesta(): void {
    if (this.f.rdDonaciones.value === '1') {
      this.actualizarPredeclaracion();
    } else {
      this.f.rdDonaciones.markAsTouched();
      if (this.listaDonaciones.length !== 0) {
        this.tieneListaDonaciones();
      } else {
        this.actualizarPredeclaracion();
      }
    }
  }

  private tieneListaDonaciones(): void {
    this.modalMensejaService.msgConfirmar(MensajeGenerales.mensajeDonaciones).subscribe(($e) => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.listaDonaciones = [];
        this.actualizarPredeclaracion();
        this.rerender();
      } else if ($e === ConstantesCadenas.RESPUESTA_NO) {
        this.f.rdDonaciones.setValue('1');
      }
    });
  }

  public agregarOActualizar(donacion?: Inft8999DonacionModel, index?: number): void {
    const modalRef = this.abrirModalService.abrirModal(DonacionesRegistroComponent);
    modalRef.componentInstance.listaDonacionesInput = this.listaDonaciones;
    modalRef.componentInstance.donacion = donacion;
    modalRef.componentInstance.indice = index;
    modalRef.componentInstance.listaDonacionesOutput.subscribe(($e) => {
      this.actualizarPredeclaracionDonaciones($e, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.modalMensejaService.msgConfirmar(MensajeGenerales.mensajeEliminar).subscribe(($e) => {
      this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.actualizarPredeclaracionDonaciones(null, index);
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionDonaciones(data: any, index: any): void {
    if (data !== null) { this.listaDonaciones = data; }
    if (index !== null) { this.listaDonaciones.splice(index, 1); }
    this.actualizarPredeclaracion();
  }

  private actualizarPredeclaracion(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas819 = Number(this.f.rdDonaciones.value);
    this.preDeclaracion.declaracion.seccInformativa.t8999donacion.lisT8999donacion = this.listaDonaciones;
    this.montoDonaciones = this.listaDonaciones.reduce((total, donaciones) => total + Number(donaciones.mtoDonacion), 0);
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas227 = this.montoDonaciones;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public obtenerTipo(value: string): string {
    const tipo = this.tipo.filter(x => x.val === value);
    return tipo.length !== 0 ? tipo[0].desc : '';
  }

  public obtenerModalidad(value: string): string {
    const modalidad = this.modalidad.filter(x => x.val === value);
    return modalidad.length !== 0 ? modalidad[0].desc : '';
  }

  public obtenerDoc(value: string): string {
    const doc = this.doc.filter(x => x.val === value);
    return doc.length !== 0 ? doc[0].desc : '';
  }
}
