import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConstantesParametros, dtOptionsConsultas } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage } from '@rentas/shared/utils';
import { Consulta, Presentacion, TipoReporte } from '@rentas/shared/types';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  CasillaService, ConsultaDeclaracionesService, ModalConfirmarService, ParametrosFormularioService,
  ReporteSimpleService, VerConstanciaService
} from '@rentas/shared/core';
import { saveAs } from 'file-saver';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'rentas-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  public dtOptions: DataTables.Settings = dtOptionsConsultas;
  public dtTrigger: Subject<any> = new Subject();
  public registerForm: FormGroup;
  public declaraciones: Consulta[];
  public listaAnioEjercicio = [];
  public listaFormularios = [];
  private formularioPPJJ;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(
    private consultaDeclaraciones: ConsultaDeclaracionesService,
    private modalService: ModalConfirmarService,
    private formBuilder: FormBuilder,
    private casillaService: CasillaService,
    private spinner: NgxSpinnerService,
    private verConstanciaService: VerConstanciaService,
    private reporteSimple: ReporteSimpleService,
    private parametrosFormularioService: ParametrosFormularioService) {
    super();
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      formulario: [''],
      ejercicio: ['0']
    });

    this.listaFormularios = [
      {
        desc: 'Seleccione',
        val: ''
      },
      {
        desc: '0709',
        val: '709'
      },
      {
        desc: '0710',
        val: '710'
      }
    ]
    this.parametrosFormularioService.getDatosCabeceraFormulario().subscribe(data => this.getFormularioCabecera(data));
  }

  private getFormularioCabecera(dataCabeceraFormulario): void {
    this.formularioPPJJ = dataCabeceraFormulario.find((x) => x.codFormulario === ConstantesParametros.COD_FORMULARIO_PPJJ);
    this.listaAnioEjercicio = this.parametrosFormularioService.obtenerListaOpciones(this.formularioPPJJ);
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


  public buscar(): void {
    if (this.f.ejercicio.value === '0' && this.f.formulario.value === '') {
      this.modalService.msgValidaciones('Debe Seleccionar al menos una de las 2 opciones', 'Mensaje');
      return;
    }
    const ejercicio = this.f.ejercicio.value !== '0' ? this.f.ejercicio.value : '';
    this.spinner.show();
    this.consultaDeclaraciones.obtenerDeclaraciones(this.f.formulario.value, ejercicio).subscribe((data) => {
      this.spinner.hide();

      data.sort((z, w) => {

        const formatoZ = this.formatearFecha(z.fecDeclaracion);
        const formatoW = this.formatearFecha(w.fecDeclaracion);

        if (new Date(formatoZ) < new Date(formatoW)) {
          return -1;
        }
        if (new Date(formatoZ) > new Date(formatoW)) {
          return 1;
        }
        return 0;
      });

      this.declaraciones = data, this.rerender();
    }, () => {
      this.spinner.hide();
    });
  }

  private formatearFecha(fecha: string): string {
    const dia = fecha.split('/')[0];
    const mes = fecha.split('/')[1];
    const anioHora = fecha.split('/')[2];

    return mes + '/' + dia + '/' + anioHora;
  }

  public limpiar(): void {
    this.f.ejercicio.setValue('0');
    this.f.formulario.setValue('');
    this.declaraciones = [];
    this.rerender();
  }

  private obtenerCasillas(codFor: string, ejercicio: number, presentacion: Presentacion) {
    if (codFor === '0709') {
      return this.casillaService.obtenerCasillasPN(ejercicio).pipe(map(casillas => ({ presentacion, casillas })));
    } else {
      return this.casillaService.obtenerCasillasPJ(ejercicio).pipe(map(casillas => ({ presentacion, casillas })));
    }
  }

  public abrirDetalle(declaracion: Consulta) {
    this.spinner.show();
    this.consultaDeclaraciones.obtenerDetalle(declaracion.idPresentacion).pipe(
      switchMap(this.obtenerCasillas.bind(this, declaracion.codFor, declaracion.ejercicio))
    ).subscribe((respuesta: { presentacion: Presentacion, casillas: any }) => {

      // los reportes trabajan con esta variables en el local
      SessionStorage.setCasillas(respuesta.casillas);
      SessionStorage.setPreDeclaracion(respuesta.presentacion.preDeclaracion);

      if (declaracion.codFor === '0709') {
        this.reporteSimple.mostrarReporteNatural({
          preDeclaracion: respuesta.presentacion.preDeclaracion,
          tipoReporte: TipoReporte.DEFINITIVO,
          razonSocial: SessionStorage.getUserData().nombreCompleto,
          fechaPresentacion: declaracion.fecDeclaracion,
          numOrden: declaracion.numOrden.toString()
        });
      } else {
        this.reporteSimple.mostrarReporteJuridico({
          preDeclaracion: respuesta.presentacion.preDeclaracion,
          tipoReporte: TipoReporte.DEFINITIVO,
          razonSocial: SessionStorage.getUserData().nombreCompleto,
          fechaPresentacion: declaracion.fecDeclaracion,
          numOrden: declaracion.numOrden.toString()
        });
      }
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    });
  }

  public abrirConstancia(declaracion: Consulta) {
    this.spinner.show();
    this.consultaDeclaraciones.obtenerConstancia(declaracion.idPresentacion).subscribe(
      respuesta => {
        this.verConstanciaService.mostrarTodoConstancias(respuesta)
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
      });
  }

  public descargar(declaracion: Consulta) {
    this.spinner.show();
    this.consultaDeclaraciones.obtenerVisorCompleto(declaracion.idPresentacion).subscribe(respuesta => {
      const blob = new Blob([respuesta.content], { type: "application/zip" });
      saveAs(blob, respuesta.nameFile);
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

}
