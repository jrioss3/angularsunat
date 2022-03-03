import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

export abstract class RenderizarPaginacion {

  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  rerender(): void {
    if (this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        let paginaActual = dtInstance.page.info().page;
        const paginasActuales = dtInstance.page.info().pages;
        dtInstance.destroy();
        this.dtTrigger.next();
        this.dtElement.dtInstance.then((dtInstanceNueva: DataTables.Api) => {
          const paginasAhora = dtInstanceNueva.page.info().pages;
          const pagina = paginaActual + 1;
          let esLaUltimaPagina = false;
          if (paginasActuales === pagina) {
            esLaUltimaPagina = true;
          }
          if (esLaUltimaPagina) {
            if (pagina > paginasAhora) {
              paginaActual = paginaActual - 1;
            }
          }
          for (let index = 0; index < 10; index++) {
            dtInstanceNueva.draw(false).page(paginaActual);
          }
        });
      });
    }
  }
}
