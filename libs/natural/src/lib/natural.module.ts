import { ExcedeDeudaComponent } from './components/utils/excede-deuda/excede-deuda.component';
import { CalculoRentaTrabajoService } from './services/calculo-renta-trabajo.service';
import { CalculoRentaSegundaService } from './services/calculo-renta-segunda.service';
import { CalculoRentaPrimeraService } from './services/calculo-renta-primera.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NaturalRoutingModule } from './natural-routing.module';
import { NaturalComponent } from './natural.component';
import { ValidationService } from './components/error-message/validation.service';
import { FormularioModule } from './modules/formulario/formulario.module';
import { UtilsComponent } from './components/utils/utils.component';
import { PreDeclaracionService } from './services/preDeclaracion.service';
import { ParametrosFormularioService } from './services/parametrosFormulario.service';
import { InicializadorService } from './services/inicializadorService.service';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { ParametriaFormulario } from './services';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidacionesService } from './services/validacionesService';
import { MesnajeAutorizacionComponent } from './components/mesnaje-autorizacion/mesnaje-autorizacion.component';
import { EjercicioAnterior } from './services/ejercicio-anterior.services';
import { MostrarMensajeService } from './services/mostrarMensaje.service';
import { ModalObtenerPagosComponent } from './components/utils/modal-obtener-pagos/modal-obtener-pagos.component';
import { ModalRedireccionarComponent } from './components/utils/modal-redireccionar/modal-redireccionar.component';
import { PipesModule } from './pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { ConstantesUris, ConstantesDevolucion, ConstantesPagos } from '@rentas/shared/constantes';
import { SharedCoreModule } from '@rentas/shared/core';
import { PlataformaPresentacion } from '@rentas/shared/types';

@NgModule({
  declarations: [
    NaturalComponent,
    UtilsComponent,
    ErrorListComponent,
    MesnajeAutorizacionComponent,
    ModalObtenerPagosComponent,
    ModalRedireccionarComponent,
    ExcedeDeudaComponent,
  ],
  imports: [
    HttpClientModule,
    FormularioModule,
    CommonModule,
    NaturalRoutingModule,
    PipesModule,
    SharedCoreModule
  ],
  entryComponents: [
    UtilsComponent,
    ErrorListComponent,
    MesnajeAutorizacionComponent,
    ModalObtenerPagosComponent,
    ModalRedireccionarComponent,
    ExcedeDeudaComponent
  ],
  exports: [
    NaturalComponent
  ],
  providers: [
    ValidationService,
    PreDeclaracionService,
    ParametrosFormularioService,
    InicializadorService,
    ParametriaFormulario,
    NgbActiveModal,
    ValidacionesService,
    CalculoRentaPrimeraService,
    CalculoRentaSegundaService,
    CalculoRentaTrabajoService,
    EjercicioAnterior,
    MostrarMensajeService,
    { provide: ConstantesDevolucion.URI_DEVOLUCION, useValue: ConstantesUris.URI_LINK_DEVOLUCION_PPNN },
    { provide: ConstantesPagos.PLATAFORMA, useValue: PlataformaPresentacion.NATURAL }
  ],
  bootstrap: [
    NaturalComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class NaturalModule { }
