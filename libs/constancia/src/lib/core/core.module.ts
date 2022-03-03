import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstanciaGuard } from './constancia.guard';
import { ConstanciaService } from './constancia.service';
import { FraccionamientoService } from './fraccionamiento.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajeFraccionamientoComponent } from '../mensaje-fraccionamiento/mensaje-fraccionamiento.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    MensajeFraccionamientoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule
  ],
  providers:[
    ConstanciaGuard,
    HttpClientModule,
    ConstanciaService,
    NgbActiveModal,
    FraccionamientoService
    
    /*{
      provide: FraccionamientoService,
      useFactory :(plataforma:string, http: HttpClient, ngbModal: NgbModal) => {
        switch(plataforma) {
          case Fraccionamiento.PLATAFORMA_VALUE_JURIDICO:
            return new FrancionamientoJuridicoService(http, ngbModal);
          case Fraccionamiento.PLATAFORMA_VALUE_NATURAL:
            return new FrancionamientoNaturalService(http, ngbModal);
        }
      },
      deps: [ Fraccionamiento.PLATAFORMA, HttpClient, NgbModal ]
    }*/
  ],
  entryComponents: [
    MensajeFraccionamientoComponent
  ]
})
export class CoreModule { }
