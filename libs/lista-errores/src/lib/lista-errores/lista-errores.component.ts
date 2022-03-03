import { Component, OnInit } from '@angular/core';
import { ChatErrorService } from '@rentas/shared/core';
import { Router } from '@angular/router';

@Component({
  selector: 'rentas-lista-errores',
  templateUrl: './lista-errores.component.html',
  styleUrls: ['./lista-errores.component.css']
})
export class ListaErroresComponent implements OnInit {

  listaErrores : any;
  showErrorList = true;
  showErrorListComponent = false;
  cantidadErrores = 0;
  listaError :any;
  showErrorListFn : any;
//20100066603 
  constructor(
    private errorChat : ChatErrorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.errorChat.enviarMensajeObservable.subscribe( data => {
      this.cantidadErrores = data.mensaje.length;
      this.showErrorListComponent = data.showErrorListComponent;
      this.listaErrores = data.mensaje
    });
    // this.showErrorListComponent = this.showErrorListFn;
  }

  redirectTab(redirectParentTabId: string, redirectTabId: string, itemUrl: string) {
    this.router.navigate([itemUrl]);

    setTimeout(() => {
      document.getElementById(redirectParentTabId).click();
      if (redirectTabId.indexOf('.') == -1) {
        setTimeout(() => {
          document.getElementById(redirectTabId).click();
        }, 500);
      } else {
        const tabLevel2 = redirectTabId.split('.')[0];
        const tabLevel3 = redirectTabId.split('.')[1];
        setTimeout(() => {
          document.getElementById(tabLevel2).click();
          setTimeout(() => {
            document.getElementById(tabLevel3).click();
          }, 500);
        }, 500);
      }
    }, 500);

  }

  openErrorList(){
    this.showErrorList = !this.showErrorList;
  }

  closeErrorList(){
    this.showErrorList = false;
  }

  private esperar(fn: () => void, time: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fn();
        resolve();
      }, time);
    });
  }

}
