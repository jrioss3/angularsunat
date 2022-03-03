import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ConstantesBienes, ConstantesCadenas, ConstantesCombos, dtOptions, MensajeGenerales } from '@rentas/shared/constantes';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { InfAlquileresModel } from '@path/juridico/models/SeccionInformativa/infAlquileresModel';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { RenderizarPaginacion, SessionStorage } from '@rentas/shared/utils';
import { AbrirModalService, CasillaService, ComboService, ModalConfirmarService } from '@rentas/shared/core';
import { ListaParametro } from '@rentas/shared/types';
import { AlquileresRegistroComponent } from '../alquileres-registro/alquileres-registro.component';

@Component({
  selector: 'app-iamain',
  templateUrl: './alquileres.component.html',
  styleUrls: ['./alquileres.component.css']
})
export class AlquileresComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  public registerForm: FormGroup;
  public listaAlquileres: InfAlquileresModel[];
  private preDeclaracion: PreDeclaracionModel;
  public dtOptions: DataTables.Settings = dtOptions;
  public dtTrigger: Subject<any> = new Subject();
  private doc: ListaParametro[];
  private bienMuebles: ListaParametro[];
  private bienInmuebles: ListaParametro[];
  public casilla829 = this.casillaService.obtenerCasilla('829');

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(
    private abrirModalService: AbrirModalService,
    private comboService: ComboService,
    private modalMensejaService: ModalConfirmarService,
    private casillaService: CasillaService,
    private formBuilder: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.listaAlquileres = this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres;
    const cas829 = this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas829;
    this.registerForm = this.formBuilder.group({
      options2: [String(cas829)]
    });
    this.dtTrigger.next();
    this.doc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.bienMuebles = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_MUEBLES);
    this.bienInmuebles = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_INMUEBLES);
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
    if (this.f.options2.value === '1') {
      this.actualizarPredeclaracion();
    } else {
      this.f.options2.markAsTouched();
      if (this.listaAlquileres.length !== 0) {
        this.tieneListaAlquileres();
      } else {
        this.actualizarPredeclaracion();
      }
    }
  }

  private tieneListaAlquileres(): void {
    this.modalMensejaService.msgConfirmar(MensajeGenerales.mensajeAlquileres).subscribe(($e) => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.listaAlquileres = [];
        this.actualizarPredeclaracion();
        this.rerender();
      } else if ($e === ConstantesCadenas.RESPUESTA_NO) {
        this.f.options2.setValue('1');
      }
    });
  }

  private actualizarPredeclaracion(): void {
    this.preDeclaracion.declaracion.seccInformativa.alquileres.lisAlquileres = this.listaAlquileres;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas829 = Number(this.f.options2.value);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public agregarOActualizar(alquiler?: InfAlquileresModel): void {
    const modalRef = this.abrirModalService.abrirModal(AlquileresRegistroComponent, { size: 'lg', windowClass: 'custom-class' });
    modalRef.componentInstance.listaAlquileresInput = this.listaAlquileres;
    modalRef.componentInstance.alquiler = alquiler;
    modalRef.componentInstance.listaAlquileresOutput.subscribe(($e) => {
      this.actualizarPredeclaracionAlquileres($e, null);
      this.rerender();
    });
  }

  public eliminar(index: number): void {
    this.modalMensejaService.msgConfirmar(MensajeGenerales.mensajeEliminar).subscribe(($e) => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.actualizarPredeclaracionAlquileres(null, index);
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionAlquileres(data: any, index: any): void {
    if (data !== null) { this.listaAlquileres = data; }
    if (index !== null) { this.listaAlquileres.splice(index, 1); }
    this.actualizarPredeclaracion();
  }

  public obtenerBien(value: string): string {
    if (value === ConstantesBienes.BIEN_MUEBLE) {
      return 'BIEN MUEBLE';
    } else if (value === ConstantesBienes.BIEN_INMUEBLE) {
      return 'BIEN INMUEBLE (PREDIOS)';
    } else if (value === ConstantesBienes.BIEN_INMUEBLE_DISTINTOS_DE_PREDIOS) {
      return 'BIEN INMUEBLE DISTINTOS DE PREDIOS';
    } else {
      return '';
    }
  }

  public obtenerDescBien(value: string, tipo: string): string {
    if (value && tipo) {
      if (tipo === ConstantesBienes.BIEN_MUEBLE) {
        const bienMuebles = this.bienMuebles.filter(x => x.val === value);
        return bienMuebles[0] ? bienMuebles[0].desc : '';
      } else if (tipo === ConstantesBienes.BIEN_INMUEBLE_DISTINTOS_DE_PREDIOS) {
        const bienInmuebles = this.bienInmuebles.filter(x => x.val === value);
        return bienInmuebles[0] ? bienInmuebles[0].desc : '';
      }
    } else {
      return '';
    }
  }

  public obtenerDoc(value: string): string {
    const doc = this.doc.filter(x => x.val === value);
    return doc.length !== 0 ? doc[0].desc : '';
  }
}
