import { ExcedeDeudaComponent } from './../components/utils/excede-deuda/excede-deuda.component';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '@path/natural/services';
import { Injectable } from '@angular/core';
import { TributoPagado } from '../models/tributo-pagado';
import { FuncionesGenerales } from '@rentas/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ExcedeDeudaService {

   private funcionesGenerales: FuncionesGenerales;

  constructor(
    private preDeclaracionService: PreDeclaracionService,
    private modalService: NgbModal,
  ) { 
    this.funcionesGenerales = FuncionesGenerales.getInstance();
  }

  public getDeudaMontoTributo(codTrubuto: string): { deuda: number; pago: number } {
    let deuda = 0;
    let pago = 0;
    switch (codTrubuto) {
      case TributoPagado.COD_RENTA_CAPITAL:
        const { mtoCas164, mtoCas166 } = this.preDeclaracionService.obtenerResumenPrimera();
        deuda = Number(mtoCas164); pago = Number(mtoCas166); break;
      case TributoPagado.COD_RENTA_2DA_CATEG:
        const { mtoCas365, mtoCas366 } = this.preDeclaracionService.obtenerResumenSegunda();
        deuda = Number(mtoCas365); pago = Number(mtoCas366); break;
      case TributoPagado.COD_RENTA_TRABAJO:
        const { mtoCas146, mtoCas168 } = this.preDeclaracionService.obtenerResumenTrabajo();
        deuda = Number(mtoCas146); pago = Number(mtoCas168); break;
      default: throw Error('no se encontro tributo');
    }
    return { deuda, pago };
  }

  public isExcede(tributos: TributoPagado[]): boolean {
    return tributos
      .some( trib => {
        const {deuda, pago} = this.getDeudaMontoTributo(trib.codTributo);
        return Number(pago) > 0 && Number(deuda) < Number(trib.montoPagado) + Number(pago);
      });
  }

  public callModal(listTrub: TributoPagado[]): Observable<string> {
    const modalRef = this.modalService.open(ExcedeDeudaComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.tributos = listTrub;
    return modalRef.componentInstance.respuesta;
  }

}
