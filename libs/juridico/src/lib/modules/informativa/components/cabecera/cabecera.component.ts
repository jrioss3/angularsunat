import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InformacionGeneralComponent } from '../informacion-general/informacion-general.component';
import { InicializadorService } from '@path/juridico/services/inicializadorService.service';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { ModalReportePreliminarComponent } from '@path/juridico/report-center/tipo-reporte-preliminar/tipo-reporte-preliminar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { throwError } from 'rxjs';
import { IdentificacionComponent } from '../identificacion/identificacion.component';
import { ValidacionesService } from '@path/juridico/services/validaciones.service';
import { catchError } from 'rxjs/operators';
import { EjercicioAnteriorService } from '@path/juridico/services/ejercicio-anterior.service';
import { ConstantesCadenas, MensajeGenerales, Rutas } from '@rentas/shared/constantes';
import { Formulario } from '@rentas/shared/types';
import { SessionStorage } from '@rentas/shared/utils';
import { AbrirModalService, ChatErrorService, ErroresService, ModalConfirmarService, PredeclaracionService } from '@rentas/shared/core';
import { HabilitarCasillas2021Service } from '@path/juridico/services/habilitar-casillas-2021.service';

@Component({
  selector: 'app-cabecerasecinf',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css'],
})
export class CabeceraSecInformativaComponent implements OnInit {

  public anioRenta = '';
  public mostrarBtnAnterior = false;
  private siguientePadre = 'tabComplementaria';
  private anteriorPadre = 'tabIdentificacion';
  private siguienteHijo = 'tabPrincipalesSocios';
  private anteriorHijo = 'tabInformacionGeneral';
  private preDeclaracion: PreDeclaracionModel;
  public formulario: Formulario;
  private reinicio = false;
  private esUltimoTabHijo = false;
  public ayuda: string = null;
  @ViewChild('tabPadre', { static: false }) tabPadre;
  @ViewChild('tabHijo', { static: false }) tabHijo;
  @ViewChild(InformacionGeneralComponent, { static: false }) component1: InformacionGeneralComponent;
  @ViewChild(IdentificacionComponent, { static: false }) component2: IdentificacionComponent;

  constructor(
    private router: Router,
    private inicializadorService: InicializadorService,
    private abrirModalService: AbrirModalService,
    private modalMensejaService: ModalConfirmarService,
    public habilitarItan: HabilitarCasillas2021Service,
    private preDeclaracionService: PreDeclaracionService,
    private spinner: NgxSpinnerService,
    private validacionesService: ValidacionesService,
    private erroresService: ErroresService,
    private ejercicioAnteriorService: EjercicioAnteriorService,
    private chatErrorService: ChatErrorService,
    private pdservice: PredeclaracionService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.inicializadorService.inicializarInformativa();
    this.inicializadorService.inicializarDeterminativa();
    this.formulario = SessionStorage.getFormulario();

    this.ayuda = this.formulario.ayudas.find(a => a.codAyuda === '001').uri;

    this.pdservice.runAutoSave();

    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    this.anioRenta = this.preDeclaracionService.obtenerNumeroEjercicio();
    this.spinner.hide();

    this.revisarErroresSesion();
  }

  private revisarErroresSesion(): void {
    let arregloErrores = [];
    arregloErrores = arregloErrores.concat(this.validacionesService.errorsArrayObjInfo);
    arregloErrores = arregloErrores.concat(this.validacionesService.errorsArrayObjDet);
    const arregloErroresBackend = SessionStorage.getErroresBackend();

    if (arregloErroresBackend != null && arregloErroresBackend !== undefined) {
      arregloErrores = arregloErrores.concat(arregloErroresBackend)
    }
    if (arregloErrores.length !== 0 && arregloErrores != null && (arregloErrores !== []) !== undefined) {
      this.chatErrorService.enviarMensaje(arregloErrores, true);
    } else {
      this.chatErrorService.enviarMensaje(arregloErrores, false);
    }
  }

  public beforeChange($event): void {
    if (this.tabInformacion()) {
      const resultado = this.component1.validar();
      if (!resultado && !this.reinicio) {
        $event.preventDefault();
      } else {
        this.mostrarBtnAnterior = $event.nextId === 'tabComplementaria';
        this.anteriorHijo = 'tabInformacionGeneral';
        this.siguienteHijo = 'tabPrincipalesSocios';
        this.esUltimoTabHijo = false;
      }
    } else {
      this.mostrarBtnAnterior = $event.nextId === 'tabComplementaria';
      this.anteriorHijo = 'tabInformacionGeneral';
      this.siguienteHijo = 'tabPrincipalesSocios';
      this.esUltimoTabHijo = false;
    }
    if ($event.nextId === 'tabComplementaria') {
      const resultadoIden = this.component2.validar();
      if (!this.validacionesService.validarTipoRegimen() || !resultadoIden) {
        this.mostrarBtnAnterior = false;
        $event.preventDefault();
      }
    }
    this.reinicio = false;
  }

  public childBeforeChange($event): void {
    this.mostrarBtnAnterior = true;
    this.esUltimoTabHijo = false;
    if ($event.activeId === 'tabInformacionGeneral') {
      const resultado = this.component1.validar();
      if (!resultado) {
        $event.preventDefault();
      } else {
        this.pestanas($event);
      }
    } else {
      this.pestanas($event);
    }
  }

  public pestanas(evento: any): void {
    switch (evento.nextId) {
      case 'tabInformacionGeneral':
        this.anteriorHijo = 'tabInformacionGeneral';
        this.siguienteHijo = 'tabPrincipalesSocios';
        break;
      case 'tabPrincipalesSocios':
        this.anteriorHijo = 'tabInformacionGeneral';
        this.siguienteHijo = 'tabAlquileresPagados';
        break;
      case 'tabAlquileresPagados':
        this.anteriorHijo = 'tabPrincipalesSocios';
        this.siguienteHijo = 'tabEmpresasConstructoras';
        break;
      case 'tabEmpresasConstructoras':
        this.anteriorHijo = 'tabAlquileresPagados';
        this.siguienteHijo = 'tabItan';
        this.esUltimoTabHijo = !this.habilitarItan.habilitarCasillasITAN();
        break;
      case 'tabItan':
        this.anteriorHijo = 'tabEmpresasConstructoras';
        this.siguienteHijo = 'tabItan';
        this.esUltimoTabHijo = this.habilitarItan.habilitarCasillasITAN();
    }
  }

  public clickAnterior(): void {
    if (this.mostrarBtnAnterior && this.siguienteHijo === 'tabPrincipalesSocios') {
      this.tabPadre.select(this.anteriorPadre);
    } else if (this.tabPadre && this.tabHijo) {
      this.tabHijo.select(this.anteriorHijo);
    }
  }

  public abrirSelTipoRepModal(): void {
    this.abrirModalService.abrirModal(ModalReportePreliminarComponent);
  }

  public clickSiguiente(): void {
    if (this.tabPadre && this.tabHijo && !this.esUltimoTabHijo) {
      this.tabHijo.select(this.siguienteHijo);
    } else if (this.esUltimoTabHijo) {
      this.validacionesService.validarInformativa();
      if (this.validacionesService.errorsArrayObjInfo.length === 0) {
        this.router.navigate([Rutas.JURIDICO_DETERMINATIVA]);
      }
    } else {
      this.tabPadre.select(this.siguientePadre);
    }
  }

  private tabInformacion(): boolean {
    return (
      this.mostrarBtnAnterior &&
      this.anteriorHijo === 'tabInformacionGeneral' &&
      this.siguienteHijo === 'tabPrincipalesSocios'
    );
  }

  public validateTab(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    if (this.tabInformacion()) {
      const resultado = this.component1.validar();
      if (resultado) {
        this.validacionesService.validarInformativa();
        if (this.validacionesService.errorsArrayObjInfo.length === 0) {
          this.router.navigate([Rutas.JURIDICO_DETERMINATIVA]);
        }
      }
    } else {
      this.validacionesService.validarInformativa();
      if (this.validacionesService.errorsArrayObjInfo.length === 0) {
        this.router.navigate([Rutas.JURIDICO_DETERMINATIVA]);
      }
    }
  }

  public resetearPd(): void {
    this.spinner.show();
    this.pdservice
      .validarReestablecer()
      .pipe(
        catchError((error) => {
          this.modalMensejaService.msgValidaciones(error.error.errors[0].msg, 'Mensaje');
          this.spinner.hide();
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.spinner.hide();
        const mensajeModal =
          Number(this.preDeclaracion.declaracion.generales.cabecera.indRectificatoria) === 0
            ? MensajeGenerales.reseterPD_Original
            : MensajeGenerales.resetearPD_Rectificatoria;
        this.modalMensejaService.msgConfirmar(mensajeModal).subscribe((result) => {
          if (result === ConstantesCadenas.RESPUESTA_SI) {
            this.resetearPdEndpoint();
          }
        });
      });
  }

  private resetearPdEndpoint(): void {
    this.spinner.show();
    this.pdservice
      .reestablecerPersonalizado()
      .pipe(
        catchError((error) => {
          this.erroresService.mostarModalError(error);
          this.spinner.hide();
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.reinicio = true;
        SessionStorage.setPreDeclaracion(data)
        this.router.navigate([Rutas.JURIDICO_INFORMATIVA]);
        this.tabPadre.select('tabIdentificacion');
        this.inicializadorService.inicializarInformativa();
        this.inicializadorService.inicializarDeterminativa();
        this.ejercicioAnteriorService.cargarDataEjercicioAnterior();
        this.revisarErroresSesion();
        setTimeout(() => {
          this.component2.ejecutarInicializacion('Reinicio');
        }, 50);
        this.spinner.hide();
      });
  }
}
