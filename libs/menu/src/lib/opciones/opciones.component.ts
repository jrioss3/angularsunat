import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from '@rentas/shared/constantes';

@Component({
  selector: 'rentas-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.css'],
})
export class OpcionesComponent implements OnInit {
  constructor(private router: Router) { }

  pathNatural = `/${Rutas.NATURAL}`;
  pathjuridico = `/${Rutas.JURIDICO}`;
  pathConsultas = `/${Rutas.CONSULTAS}`;
  valorAnterior = '';

  nodes = [
    {
      id: 1,
      name: ' Presentación y pago',
      classes: ['nivel1'],
      children: [
        {
          id: 2,
          name: ' Renta Anual',
          classes: ['nivel2'],
          children: [
            { id: 3, name: '709 Renta Anual PERSONAS', classes: ['nivel3'] },

            { id: 4, name: '710 Renta Anual EMPRESAS', classes: ['nivel3'] },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'Consultas',
      classes: ['nivel1'],
      children: [
        {
          id: 6,
          name: 'Consultas de Presentación y Pago',
          classes: ['nivel2'],
          children: [
            {
              id: 7,
              name: 'Consulta de Declaraciones y Pagos de Renta Anual 2019 - XXXX',
              classes: ['nivel3'],
            },
            {
              id: 8,
              name: 'Consulta de Declaraciones y Pagos - Nueva Plataforma',
              classes: ['nivel3'],
            },
          ],
        },
      ],
    },
  ];
  options = {};

  ngOnInit(): void {
    const anioActual = String(new Date().getFullYear());
    this.nodes.find(x => x.id === 5).children.find(x => x.children).children.find(x => x.id === 7).name = this.nodes.find(x => x.id === 5).children.find(x => x.children).children.find(x => x.id === 7).name.replace('XXXX', anioActual);
  }

  onTreeLoad(node) {
    node.treeModel.expandAll();
  }

  public onEvent(node) {
    if (node.data.id === 3) {
      this.router.navigate([this.pathNatural]);
    } else if (node.data.id === 4) {
      this.router.navigate([this.pathjuridico]);
    } else if (node.data.id === 7) {
      this.router.navigate([this.pathConsultas]);
    } else if (node.data.id === 8) {
      window.open('https://e-menu.sunat.gob.pe/cl-ti-itmenu2/MenuInternetPlataforma.htm?pestana=*&agrupacion=*&exe=55.2.1.1.1', '_blank');
    } else {
      const someNode = node.treeModel.getNodeById(node.data.id);
      if (node.isExpanded) {
        someNode.collapse();
      } else {
        someNode.expand();
      }
    }
  }
}
