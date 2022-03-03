import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ConstantesCadenas, ConstantesCombos, dtOptions, MensajeGenerales } from '@rentas/shared/constantes';
import { InfPrinAccionistasModel } from '@path/juridico/models/SeccionInformativa/infPrinAccionistasModel';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { RenderizarPaginacion, SessionStorage } from '@rentas/shared/utils';
import { PrincipalesSociosService } from '@path/juridico/services/principales-socios.service';
import { AbrirModalService, ComboService, ModalConfirmarService } from '@rentas/shared/core';
import { ListaParametro } from '@rentas/shared/types';
import { ConstantesSocios } from '@path/juridico/utils/constantesSocios';
import { SociosRegistroComponent } from '../socios-registro/socios-registro.component';
import { SociosImportarComponent } from '../socios-importar/socios-importar.component';

@Component({
  selector: 'app-ipamain',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  public listaSocios: InfPrinAccionistasModel[];
  private listaPaises: ListaParametro[];
  private preDeclaracion: PreDeclaracionModel;
  public registerForm: FormGroup;
  public dtOptions: DataTables.Settings = dtOptions;
  public dtTrigger: Subject<any> = new Subject();
  private socios: ListaParametro[];
  private doc: ListaParametro[];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(
    private formBuilder: FormBuilder,
    private comboService: ComboService,
    private modalMensejaService: ModalConfirmarService,
    private abrirModalService: AbrirModalService,
    private apiDate: DatePipe,
    private principalesSociosService: PrincipalesSociosService) {
    super();
  }

  public ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.listaSocios = this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas;
    const empresasSAC = ["26", "38", "39"];
    const userData = SessionStorage.getUserData();

    this.registerForm = this.formBuilder.group({
      options: [this.principalesSociosService.valorPreguntaSocios ? '1' : (this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas.length != 0 ? '1' : '0')]
    });

    this.listaPaises = this.comboService.obtenerComboPorNumero(ConstantesCombos.PAISES);
    this.socios = this.comboService.obtenerComboPorNumero(ConstantesCombos.SOCIOS);
    this.doc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);

    if (empresasSAC.includes(userData.map.ddpData.ddp_tpoemp)) {
      this.f.options.setValue('1');
      this.f.options.disable();
    }

    this.dtTrigger.next();
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
    if (this.f.options.value === '1') {
      this.principalesSociosService.respondioPregunta(true);
    } else {
      this.f.options.markAsTouched();
      if (this.listaSocios.length !== 0) {
        this.tieneListaSocios();
      } else {
        this.principalesSociosService.respondioPregunta(false);
      }
    }
  }

  private tieneListaSocios(): void {
    this.modalMensejaService.msgConfirmar(MensajeGenerales.mensajeSocios).subscribe(($e) => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.listaSocios = [];
        this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas = this.listaSocios;
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
        this.principalesSociosService.respondioPregunta(false);
        this.rerender();
      } else if ($e === ConstantesCadenas.RESPUESTA_NO) {
        this.f.options.setValue('1');
      }
    });
  }

  public obtenerPais(pais): string {
    if (pais) {
      const listaPaises = this.listaPaises.filter(x => x.val === String(pais));
      return listaPaises.length !== 0 ? listaPaises[0].desc : '';
    }
  }

  public obtenerSocio(value): string {
    const socios = this.socios.filter(x => x.val === String(value));
    return socios.length !== 0 ? socios[0].desc : '';
  }

  public obtenerDoc(value): string {
    const doc = this.doc.filter(x => x.val === String(value));
    return doc.length !== 0 ? doc[0].desc : '';
  }

  public obtenerFecha(value): string {
    if (value) {
      return this.apiDate.transform(value.split('\'T\'')[0], 'dd/MM/yyyy');
    }
  }

  public importar(): void {
    const modalRef = this.abrirModalService.abrirModal(SociosImportarComponent);
    modalRef.componentInstance.tuplasExcel
      .pipe(map(data => data as Array<InfPrinAccionistasModel>))
      .subscribe(tuplas => {
        this.actualizarPredeclaracionPrincipalesSocios(tuplas, null);
      });
  }

  public agregarOActualizar(socio?: InfPrinAccionistasModel, index?: number): void {
    const modalRef = this.abrirModalService.abrirModal(SociosRegistroComponent);
    modalRef.componentInstance.listaSociosInput = this.listaSocios;
    modalRef.componentInstance.indice = index;
    modalRef.componentInstance.socio = socio;
    modalRef.componentInstance.listaSociosOutput.subscribe($e => {
      this.actualizarPredeclaracionPrincipalesSocios($e, null);
    });
  }

  public eliminar(index: number): void {
    const existeSocio = this.listaSocios.some(m => m.codTipDocSocio === ConstantesSocios.CONSOLIDADO);
    const mensaje = existeSocio && index != 100 ? MensajeGenerales.mensajeEliminarSocio : MensajeGenerales.mensajeEliminar;
    this.modalMensejaService.msgConfirmar(mensaje).subscribe($e => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        if (existeSocio) {
          this.listaSocios.splice(100, 1);
        }
        this.actualizarPredeclaracionPrincipalesSocios(null, index);
      }
    });
  }

  private actualizarPredeclaracionPrincipalesSocios(data: InfPrinAccionistasModel[], index: number): void {
    if (data !== null) { this.listaSocios = data; }
    if (index !== null) { this.listaSocios.splice(index, 1); }
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas502 = this.listaSocios.filter(x => x.codTipDocSocio !== ConstantesSocios.CONSOLIDADO).length;
    this.preDeclaracion.declaracion.seccInformativa.prinAccionistas.lisPrinAccionistas = this.listaSocios;
    this.rerender();
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
}
