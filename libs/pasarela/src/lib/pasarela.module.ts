import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasarelaComponent } from './components/pasarela/pasarela.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CabeceraModule } from '@rentas/cabecera';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalMensajeVisaComponent } from './components/modal-mensaje-visa/modal-mensaje-visa.component';
import { ModalConfirmarPagoComponent } from './components/modal-confirmar-pago/modal-confirmar-pago.component';
import { PasarelaRoutingModule } from './pasarela-routing.module';

@NgModule({
  imports: [
    PasarelaRoutingModule,
    FormsModule,
    CommonModule,
    CabeceraModule,
    NgxSpinnerModule,
    NgbModule
  ],
  declarations: [
    PasarelaComponent,
    ModalMensajeVisaComponent,
    ModalConfirmarPagoComponent
  ],
  entryComponents: [
    ModalMensajeVisaComponent,
    ModalConfirmarPagoComponent
  ]
})
export class PasarelaModule {}
