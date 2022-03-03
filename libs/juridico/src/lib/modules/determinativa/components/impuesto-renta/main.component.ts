import { Component, OnInit } from '@angular/core';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { Detalle108Component } from '../detalle108/detalle108.component';
import { ConstantesCasillas, MensajeGenerales } from '@rentas/shared/constantes';
import { SessionStorage } from '@rentas/shared/utils';
import { ModalConfirmarService, AbrirModalService } from '@rentas/shared/core';
import { FormulasService } from '@path/juridico/services/formulas.service';

@Component({
  selector: 'app-impuesto-renta',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class ImpRentaMainComponent implements OnInit {


  public anioejercicio: string;

  public formato_porcentaje = ConstantesCasillas.FORMATO_PORCENTAJE;
  public formato_numerico = ConstantesCasillas.FORMATO_NUMERICO;

  constructor(
    private abrirModalService: AbrirModalService,
    private preDeclaracionService: PreDeclaracionService,
    private modalMensejaService: ModalConfirmarService,
    public fs: FormulasService) { }

  public ngOnInit(): void {
    this.anioejercicio = this.preDeclaracionService.obtenerNumeroEjercicio();
  }

  public abrirCasilla108(): void {
    const modalRef = this.abrirModalService.abrirModal(Detalle108Component, { size: 'lg' });
    modalRef.componentInstance.datosCasilla.subscribe(($e) => {
      this.fs.lista108.lisCasilla108 = $e;
      this.fs.calcular108();
      if ($e.length !== 0) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeCasilla108, 'Mensaje');
        this.fs.impuestoRtaEmpresa.mtoCas880 = null;
      } else if ($e.length === 0 && this.fs.impuestoRtaEmpresa.mtoCas107 > 0) {
        this.fs.impuestoRtaEmpresa.mtoCas880 = 0;
      }
      this.fs.calcularRentaNetaImponible();
    });
  }

  public guardarOpcion(): void {
    SessionStorage.setPreDeclaracion(this.fs.preDeclaracion);
  }
}
