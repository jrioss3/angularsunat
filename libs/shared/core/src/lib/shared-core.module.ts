import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalMensajeComponent } from './component/modal-mensaje/modal-mensaje.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptorService } from './service/header-interceptor.service';
import { VerConstanciaComponent } from './component/ver-constancia/ver-constancia.component';
import { VerConstanciaService } from './service/ver-constancia.service';
import { VerTodoConstanciaComponent } from './component/ver-todo-constancia/ver-todo-constancia.component';
import { FormularioComponent } from './component/formulario/formulario.component';
import { BoletaComponent } from './component/boleta/boleta.component';
import { EnviarCorreoComponent } from './component/enviar-correo/enviar-correo.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalErroresComponent } from './component/modal-errores/modal-errores.component';
import { ErroresService } from './service/errores.service';
import { ConstanciaEnviarGuardarService } from './service/constancia-enviar-guardar.service';
import { NgxPrintModule } from 'ngx-print';
import { ReporteJuridicoComponent } from './component/reporte-juridico/reporte-juridico.component';
import { ReporteNaturalComponent } from './component/reporte-natural/reporte-natural.component';
import { ReporteSimpleService } from './service/reporte-simple.service';
import { ParametrosFormularioService } from './service/parametrosFormulario.service';
import { ValidacionService } from './service/validaciones.service';
import { ConsultaPersona } from './service/consulta-persona.service';
import { ReporteIdentificacionComponent } from './component/reporte-identificacion/reporte-identificacion.component';
import { ReporteInformacionComplementariaComponent } from './component/reporte-informacion-complementaria/reporte-informacion-complementaria.component';
import { ReporteDeterminacionDeudaComponent } from './component/reporte-determinacion-deuda/reporte-determinacion-deuda.component';
import { ReporteImpuestoDeterminacionDeudaComponent } from './component/reporte-impuesto-determinacion-deuda/reporte-impuesto-determinacion-deuda.component';
import { ReporteEstadosFinancierosComponent } from './component/reporte-estados-financieros/reporte-estados-financieros.component';
import { ReporteGuardarEnviarService } from './service/reporte-guardar-enviar.service';
import { ReporteEnviarCorreoComponent } from './component/reporte-enviar-correo/reporte-enviar-correo.component';
import { ReporteMarcaAguaComponent } from './component/reporte-marca-agua/reporte-marca-agua.component';
import { ReporteHeaderComponent } from './component/reporte-header/reporte-header.component';
import { ComboService } from './service/combo.service';
import { CasillaService } from './service/casilla.service';
import { TipoCasillaService } from './service/tipo-casilla.service';
import { ReporteCuerpoComponent } from './component/reporte-cuerpo/reporte-cuerpo.component';
import { ReportePrimeraRentaComponent } from './component/reporte-primera-renta/reporte-primera-renta.component';
import { ReporteSegundaRentaComponent } from './component/reporte-segunda-renta/reporte-segunda-renta.component';
import { ReporteTrabajoRentaComponent } from './component/reporte-trabajo-renta/reporte-trabajo-renta.component';
import { ErrorListComponent } from './component/error-list/error-list.component';
import { ModalPresentarPagarFormComponent } from './component/modal-presentar-pagar-form/modal-presentar-pagar-form.component';
import { ModalTienePagoProcesoComponent } from './component/modal-tiene-pago-proceso/modal-tiene-pago-proceso.component';
import { TimerPagoComponent } from './component/timer-pago/timer-pago.component';
import { SharedIuModule } from '@rentas/shared/iu';
import { T01paramService } from './service/t01param.service';
import { ModalConfirmarComponent } from './component/modal-confirmar/modal-confirmar.component';
import { AbrirModalService } from './service/abrir-modal.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule,
    SharedIuModule
  ],
  providers: [
    VerConstanciaService,
    ReporteGuardarEnviarService,
    ErroresService,
    ConstanciaEnviarGuardarService,
    ReporteSimpleService,
    ValidacionService,
    ComboService,
    CasillaService,
    TipoCasillaService,
    ConsultaPersona,
    T01paramService,
    AbrirModalService,
    ParametrosFormularioService,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptorService, multi: true }
  ],
  declarations: [
    ModalMensajeComponent,
    ModalConfirmarComponent,
    VerConstanciaComponent,
    VerTodoConstanciaComponent,
    FormularioComponent,
    BoletaComponent,
    EnviarCorreoComponent,
    ModalErroresComponent,
    ReporteJuridicoComponent,
    ReporteNaturalComponent,
    ReporteIdentificacionComponent,
    ReporteInformacionComplementariaComponent,
    ReporteDeterminacionDeudaComponent,
    ReporteImpuestoDeterminacionDeudaComponent,
    ReporteEstadosFinancierosComponent,
    ReporteEnviarCorreoComponent,
    ReporteMarcaAguaComponent,
    ReporteHeaderComponent,
    ReporteCuerpoComponent,
    ReportePrimeraRentaComponent,
    ReporteSegundaRentaComponent,
    ReporteTrabajoRentaComponent,
    ErrorListComponent,
    ModalPresentarPagarFormComponent,
    ModalTienePagoProcesoComponent,
    TimerPagoComponent,
  ],
  entryComponents: [
    ModalMensajeComponent,
    ModalConfirmarComponent,
    VerConstanciaComponent,
    VerTodoConstanciaComponent,
    EnviarCorreoComponent,
    ModalErroresComponent,
    ReporteJuridicoComponent,
    ReporteNaturalComponent,
    ReporteEnviarCorreoComponent,
    ErrorListComponent,
    ModalPresentarPagarFormComponent,
    ModalTienePagoProcesoComponent
  ]
})
export class SharedCoreModule { }
