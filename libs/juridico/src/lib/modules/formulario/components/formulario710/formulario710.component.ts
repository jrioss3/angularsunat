import { ModalReintentoComponent } from './../modal-reintento/modal-reintento.component';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError, zip, EMPTY, of } from 'rxjs';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { OptionSelect } from '@path/juridico/models/optionSelect';
import { AbrirModalService, ChatErrorService, ConsultaDeclaracionesService, ErroresService, InteresMoratorioService, ModalConfirmarService, PagosPreviosService, T01paramService } from '@rentas/shared/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalRucComponent } from '../seteoRUC/modal-ruc.component';
import { environment } from '@rentas/shared/environments';
import { RepresentasLegalesService } from '@path/juridico/services/representantesLegalService.service';
import { InicializadorService } from '@path/juridico/services/inicializadorService.service';
import { EjercicioAnteriorService } from '@path/juridico/services/ejercicio-anterior.service';
import { ConstantesCadenas, ConstantesParametros, ConstantesTributos, MensajeGenerales, Rutas } from '@rentas/shared/constantes';
import { ParametrosFormularioService, TipoCasillaService, CasillaService } from '@rentas/shared/core';
import { UserData } from '@rentas/shared/types';
import { SessionStorage } from '@rentas/shared/utils';
import { ConstantesFormulario } from '@rentas/shared/constantes';
import { PrincipalesSociosService } from '@path/juridico/services/principales-socios.service';
import { Lugares } from '@path/juridico/models/lugaresModel';

@Component({
  selector: 'app-formulario710',
  templateUrl: './formulario710.component.html',
  styleUrls: ['./formulario710.component.css'],
})
export class Formulario710Component implements OnInit, AfterViewInit {
  private preDeclaracionObject: PreDeclaracionModel;
  public listaAnioEjercicio: OptionSelect[];
  private mensajeBienvenida: string[];
  private aux = 0;
  public formularioPPJJ: any;
  public cboEjercicio = '0';

  constructor(
    private casillaService: CasillaService,
    private router: Router,
    private preDeclaracionservice: PreDeclaracionService,
    private errorService: ErroresService,
    private modalConfirmarService: ModalConfirmarService,
    private chatErrorService: ChatErrorService,
    private consultaDeclaraciones: ConsultaDeclaracionesService,
    private inicializadorService: InicializadorService,
    private parametrosFormularioService: ParametrosFormularioService,
    private spinner: NgxSpinnerService,
    private representantesLegales: RepresentasLegalesService,
    private tipoCasillaService: TipoCasillaService,
    private t01Param: T01paramService,
    private abrirModalService: AbrirModalService,
    private ejercicioAnteriorService: EjercicioAnteriorService,
    private pagosPreviosService: PagosPreviosService,
    private interesMoratorioService: InteresMoratorioService,
    private principalesSociosService: PrincipalesSociosService
  ) { }

  ngOnInit(): void {
    this.principalesSociosService.respondioPregunta(false);
    this.principalesSociosService.lugarDeCargaDeData('');
    this.cargarTipoCasilla();
    zip(
      this.parametrosFormularioService.getDatosCabeceraFormulario(),
    ).pipe(
      map(([cabecera]) => ({ cabecera })),
      catchError((error) => throwError(error))
    ).subscribe((data) => {
      if (data) {
        this.getFormularioCabecera(data.cabecera);
        this.validarIngreso();
      }
    });
  }

  public ngAfterViewInit(): void {
    if (environment.activar_modal) {
      setTimeout(() => this.openModal(), 100);
    }
  }

  private openModal(): void {
    this.abrirModalService.abrirModal(ModalRucComponent);
  }

  private cargarTipoCasilla(): void {
    this.tipoCasillaService.cargarTiposCasilla().subscribe((listTipoCasilla) => {
      SessionStorage.setTipoCasillas(listTipoCasilla);
    });
  }

  private getFormularioCabecera(dataCabeceraFormulario): void {
    this.formularioPPJJ = dataCabeceraFormulario.find((x) => x.codFormulario == ConstantesParametros.COD_FORMULARIO_PPJJ);
  }

  private validarIngreso(): void {
    this.listaAnioEjercicio = this.parametrosFormularioService.obtenerListaOpciones(this.formularioPPJJ);
  }

  public cambiarEjercicio(anioEjercicio): void {
    this.mensajeBienvenida = [];
    if (this.existe(anioEjercicio)) {
      let userDatos: UserData;
      userDatos = SessionStorage.getUserData();

      this.spinner.show();
      this.cargarPreDeclaracion(userDatos.numRUC, anioEjercicio).subscribe(
        data => {
          this.preDeclaracionObject = data;
          this.esEjercicioVigente(anioEjercicio).pipe(
            tap((bool) =>
              bool
                ? this.showMessageEjercicioNoVigente(userDatos, anioEjercicio)
                : this.showMessageEjercicioVigente(userDatos, anioEjercicio)
            )
          ).subscribe();
        }, () => {
          this.spinner.hide();
        });
    }
  }

  private existe(anioEjercicio): boolean {
    return anioEjercicio != null && anioEjercicio !== '' && anioEjercicio !== '0';
  }

  private esEjercicioVigente(ejercicioSeleccionado): Observable<boolean> {
    const ejercicio = this.formularioPPJJ.ejercicios.find((y) => Number(y.ejercicio) == Number(ejercicioSeleccionado));
    return !ejercicio.esActual ? of(true) : of(false);
  }

  private showMessageEjercicioNoVigente(userDatos, anioEjercicio): void {
    this.spinner.hide();
    if (this.preDeclaracionObject.declaracion.generales.cabecera.indRectificatoria === '0') {
      const mensaje = MensajeGenerales.MSJ_NO_DJ_PREVIA.replace(new RegExp('XXXX', 'g'), anioEjercicio);
      this.modalConfirmarService.msgBotonesSINO(mensaje).subscribe(respuesta => {
        if (respuesta === ConstantesCadenas.RESPUESTA_SI) {
          this.cargarFormulario(userDatos, anioEjercicio);
        } else {
          this.cboEjercicio = '0';
        }
      });
    } else {
      this.spinner.show();
      this.consultaDeclaraciones.obtenerDeclaraciones('710', anioEjercicio).subscribe(
        data => {
          this.spinner.hide();
          const mensaje = MensajeGenerales.MSJ_DJ_PREVIA.replace('XXXX', anioEjercicio).replace('fecha', data[0].fecDeclaracion.split(' ')[0]);
          this.modalConfirmarService.msgBotonesSINO(mensaje).subscribe(respuesta => {
            if (respuesta === ConstantesCadenas.RESPUESTA_SI) {
              this.cargarFormulario(userDatos, anioEjercicio);
            } else {
              this.cboEjercicio = '0';
            }
          });
        }, () => {
          this.spinner.hide();
        });
    }
  }

  private showMessageEjercicioVigente(userDatos, anioEjercicio): void {
    this.spinner.hide();
    const mensaje = MensajeGenerales.MSJ_EJERCICIO_VIGENTE.replace(new RegExp('XXXX', 'g'), anioEjercicio);
    this.modalConfirmarService.msgBotonesSINO(mensaje).subscribe(respuesta => {
      if (respuesta === ConstantesCadenas.RESPUESTA_SI) {
        this.cargarFormulario(userDatos, anioEjercicio);
      } else {
        this.cboEjercicio = '0';
      }
    });
  }

  private cargarFormulario(userDatos, anioEjercicio): void {
    this.spinner.show();
    zip(
      this.parametrosFormularioService.obtenerDatosFormulario(anioEjercicio),
      this.errorService.obtenerErrores(anioEjercicio, ConstantesFormulario.JURIDICO),
      this.casillaService.obtenerCasillasPJ(anioEjercicio),
      this.representantesLegales.obtenerRepresentantesLegales(userDatos.numRUC),
      this.representantesLegales.obtenerRegimen(userDatos.numRUC, anioEjercicio),
      this.representantesLegales.obtenerDatosEjercicioAnterior(userDatos.numRUC, String(Number(anioEjercicio) - 1)),
      this.t01Param.obtenerParametros('123'),
      this.t01Param.obtenerParametros('101'),
      this.representantesLegales.obtenerSociosFichaRuc(userDatos.numRUC),
      this.interesMoratorioService.obtenerFactorInteresMoratorio(ConstantesTributos.RENTA_PERS_JUR.codigo)
    )
      .pipe(
        map(
          ([
            respFormulario,
            respErrores,
            respCasillas,
            resRepresentantes,
            isRMT,
            respDatosCont,
            respTributos,
            respFormularios,
            respSociosFicha,
            respFactorInteres
          ]) => ({
            respFormulario,
            respErrores,
            respCasillas,
            resRepresentantes,
            isRMT,
            respDatosCont,
            respTributos,
            respFormularios,
            respSociosFicha,
            respFactorInteres
          })
        ),
        catchError((error) => {
          this.spinner.hide();
          return throwError(error);
        })
      )
      .subscribe((respAll) => {
        this.spinner.hide();

        if (this.aux === 1) {
          this.aux = 0;
          return;
        }

        this.parametrosFormularioService.setearSesionFormulario(respAll.respFormulario);
        SessionStorage.setErrores(respAll.respErrores);
        SessionStorage.setAnexo5(respAll.isRMT);
        SessionStorage.setCasillas(respAll.respCasillas);
        SessionStorage.setRepresentantes(respAll.resRepresentantes);
        SessionStorage.setEjercicioAnterior(respAll.respDatosCont);
        SessionStorage.setParametros(respAll.respTributos, respAll.respFormularios);
        SessionStorage.setSociosFichaRuc(respAll.respSociosFicha);
        this.inicializadorService.inicializarInformativa();
        this.inicializadorService.inicializarDeterminativa();
        this.preDeclaracionObject = SessionStorage.getPreDeclaracion();
        SessionStorage.setPreDeclaracion(this.preDeclaracionObject);
        SessionStorage.setFactorInteresMoratorio(respAll.respFactorInteres.factorInteres);

        this.preDeclaracionservice.generarValHash();

        /**
         * si es original mostrar mensaje bienvenida
         */
        if (this.preDeclaracionObject.declaracion.generales.cabecera.indRectificatoria === '0') {
          this.mensajeBienvenida.push(MensajeGenerales.mensajeBienvenidaParte1);
          this.mensajeBienvenida.push(MensajeGenerales.mensajeBienvenidaParte2);
          this.mensajeBienvenida.push(MensajeGenerales.mensajeBienvenidaParte3);
          this.chatErrorService.showErrorsArray(this.mensajeBienvenida, 'S', 'Mensaje')
            .subscribe(() => {
              const mensaje = this.obtenerMensajeCargaSocio();
              if (this.preDeclaracionObject.indEjeAntAct === '0' && mensaje !== '') {
                this.modalConfirmarService.msgValidaciones(mensaje, 'Mensaje');
              }
            });
        }

        this.pagosPreviosService.getTributosPagados().subscribe(SessionStorage.setPagosPrevios);

        this.ejercicioAnteriorService.cargarDataEjercicioAnterior();
        this.router.navigate([Rutas.JURIDICO_INFORMATIVA]);
      });
  }

  private obtenerMensajeCargaSocio(): string {
    return this.principalesSociosService.lugarDeCarga === Lugares.fichaRuc ?
      MensajeGenerales.mensajeCargaFichaRucSocio :
      (this.principalesSociosService.lugarDeCarga === Lugares.periodoAnterior ?
        MensajeGenerales.mensajeCargaPeriodoAnteriorSocio : '')
  }

  private cargarPreDeclaracion(ruc: string, anio: string): Observable<any> {
    return this.preDeclaracionservice.cargarPreDeclaracion(ruc, anio).pipe(
      catchError((error) => {
        return this.handelError(error, ruc, anio);
      }),
      tap((resp) => {
        SessionStorage.setPreDeclaracion(resp);
      })
    );
  }

  private handelError(error: any, ruc, anio): Observable<any> {
    if (error.status === 422 && error.error.errors[0].cod == '42206') {
      this.spinner.hide();
      const lista = error.error.errors as Array<{ cod: string; msg: string }>;
      return this.modalConfirmarService.msgBotonesSINO(lista.shift().msg).pipe(
        switchMap((resp) => {
          this.spinner.show();
          if (resp === ConstantesCadenas.RESPUESTA_SI) {
            return this.preDeclaracionservice.cargarPreDeclaracion(ruc, anio, '1');
          }
          return this.preDeclaracionservice.cargarPreDeclaracion(ruc, anio, '0');
        })
      );
    } else if (error.status === 422 && error.error.errors[0].cod == '42208') {
      this.spinner.hide();
      const lista = error.error.errors as Array<{ cod: string; msg: string }>;
      return this.mensajeReintento(lista.shift().msg).pipe(
        tap(() => (this.aux = 1)),
        map(() => EMPTY)
      );
    }
    return throwError(error);
  }

  private mensajeReintento(mensaje: string): Observable<string> {
    const modalRef = this.abrirModalService.abrirModal(ModalReintentoComponent);
    modalRef.componentInstance.mensaje = mensaje;
    return modalRef.componentInstance.respuesta;
  }

}
