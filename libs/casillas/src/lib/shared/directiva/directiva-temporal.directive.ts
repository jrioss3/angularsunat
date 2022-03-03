import { Directive, Input, ElementRef, Renderer2} from '@angular/core';
import { ConstantesCasillas } from '@rentas/shared/constantes';


@Directive({
  selector: '[rentasDirectivaTemporal]'
})
export class DirectivaTemporalDirective {
  @Input() appCasillaRentaTipo: string;
  @Input() appCasillaMin: number;

  constructor(private elem: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {    
    let claseCss = '';
    switch (this.appCasillaRentaTipo) {
      case ConstantesCasillas.CODIGO_TIPO_CASILLA_CALCULADA:
        claseCss = 'Casilla-generada';
        this.renderer.setAttribute(this.elem.nativeElement, 'readonly', 'readonly');
        break;
      case ConstantesCasillas.CODIGO_TIPO_CASILLA_CON_ASISTENTE:
        claseCss = 'Activar-Asistente';
        this.renderer.setAttribute(this.elem.nativeElement, 'readonly', 'readonly');
        break;
    }
    this.renderer.setAttribute(this.elem.nativeElement, 'class', claseCss + ' form-control texto-derecha');
  }
}
