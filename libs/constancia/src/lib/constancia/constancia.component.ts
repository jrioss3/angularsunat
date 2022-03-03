import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from '@rentas/shared/constantes';
import { ConstanciaService } from '../core/constancia.service';
import { FraccionamientoService } from '../core/fraccionamiento.service';
import {
  AutoGuardadoService,
  ErroresService,
  ConstanciaEnviarGuardarService,
  ModalConfirmarService
} from '@rentas/shared/core';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { Browser } from '@rentas/shared/utils';
import { TipoFrac } from '@rentas/shared/types';


@Component({
  selector: 'rentas-constancia',
  templateUrl: './constancia.component.html',
  styleUrls: ['./constancia.component.css']
})
export class ConstanciaComponent implements OnInit {

  @ViewChild('imprimirGeneral') iframeImprimirGeneral: ElementRef;

  constructor(
    private constanciaService: ConstanciaService,
    private fraccionamientoService: FraccionamientoService,
    private constEnviarGuardar: ConstanciaEnviarGuardarService,
    private handlerError: ErroresService,
    private spinner: NgxSpinnerService,
    private autoGuardadoService: AutoGuardadoService,
    private router: Router,
    private md: ModalConfirmarService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.constanciaService.setState(navigation);

    const noTieneParametros = !this.constanciaService.checkNavigationEextras();
    if (noTieneParametros) {
      this.router.navigate([Rutas.JURIDICO_DETERMINATIVA]);
      return;
    }

  }

  ngOnInit(): void {
    this.autoGuardadoService.detenerAutoGuardado();
    const estadoFrac = this.constanciaService.getFracionamiento();
    if (estadoFrac.tieneFraccionamiento) {
      const constancia = this.constanciaService.getConstanciaRespuesta();
      this.fraccionamientoService.setConstanciaRespuesta(constancia);
      this.fraccionamientoService.mostrarMensaje();
    } else if (estadoFrac.tipo === TipoFrac.MAYOR_150_UIT){
      this.md.msgValidaciones(estadoFrac.mesaje, 'Mensaje');
    }
  }

  get esNps(): boolean {
    return this.constanciaService.esPagoNps();
  }

  public guardarGeneral(): void {
    this.spinner.show();
    const numeroOperacionSunat = this.constanciaService.getConstanciaRespuesta().resultado.numeroOperacionSunat;
    const numeroDocumento = this.constanciaService.getConstanciaRespuesta().resultado.numeroRUC;
    this.constEnviarGuardar.guardarGeneral(numeroOperacionSunat).subscribe(respuesta => {
      saveAs(respuesta, `${numeroDocumento}.pdf`);
      this.spinner.hide();
    }, error => {
      this.handlerError.mostarModalError(error);
      this.spinner.hide();
    });
  }

  public imprimir(): void {
    this.spinner.show();
    const numeroOperacionSunat = this.constanciaService.getConstanciaRespuesta().resultado.numeroOperacionSunat;
    this.constEnviarGuardar.guardarGeneral(numeroOperacionSunat).subscribe(respuesta => {

      if (this.isFirefox()) {
        this.openImprimirFirefox(respuesta);
      } else {
        this.openImprimirOther(respuesta);
      }
      this.spinner.hide();

    }, error => {
      this.handlerError.mostarModalError(error);
      this.spinner.hide();
    });
  }

  public enviarCorreo(): void {
    const idPresentacion = this.constanciaService.getConstanciaRespuesta().resultado.numeroOperacionSunat;
    const razonSocial = this.constanciaService.getConstanciaRespuesta().resultado.razonSocial;
    this.constEnviarGuardar.enviarCorreoGeneral({ idPresentacion, razonSocial });
  }

  private isFirefox(): boolean {
    return Browser.getDescripcion().toLowerCase().indexOf('firefox') > -1;
  }

  private openImprimirOther(resp: Blob): void {
    this.iframeImprimirGeneral.nativeElement.src = URL.createObjectURL(resp);
    this.iframeImprimirGeneral.nativeElement.onload = () => {
      this.iframeImprimirGeneral.nativeElement.focus();
      this.iframeImprimirGeneral.nativeElement.contentWindow.print();
    };
  }

  private openImprimirFirefox(resp: Blob): void {
    const popUp = window.open('about:blank', 'constancia', 'width=auto,height=auto');
    popUp.document.location.href = URL.createObjectURL(resp);
    setTimeout(() => {
      popUp.print();
    }, 1500);
  }

}
