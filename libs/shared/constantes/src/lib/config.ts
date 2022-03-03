export const dtOptions = {
  responsive: true,
  pagingType: 'full_numbers',
  aoColumnDefs: [{ bSortable: false, aTargets: [0, 1] }],
  order: [[0, 'none'], [1, 'none']],
  retrieve: true,
  language: {
    lengthMenu: 'Mostrar _MENU_ registros por página',
    zeroRecords: 'No hay registros disponibles',
    info: 'Mostrando _PAGE_ de _PAGES_',
    infoEmpty: 'No hay registros disponibles',
    infoFiltered: '(filtrando de _MAX_ registros totales)',
    search: 'Buscar:',
    paginate: {
      first: 'Primero',
      last: 'Último',
      next: 'Siguiente',
      previous: 'Anterior'
    },
  }
};

export const dtOptionsCas144 = {
  responsive: true,
  pagingType: 'full_numbers',
  ordering: true,
  aoColumnDefs: [{ bSortable: false, aTargets: [0, 1, 2, 3, 4] }],
  order: [],
  retrieve: true,
  language: {
    lengthMenu: 'Mostrar _MENU_ registros por página',
    zeroRecords: 'No hay registros disponibles',
    info: 'Mostrando _PAGE_ de _PAGES_',
    infoEmpty: 'No hay registros disponibles',
    infoFiltered: '(filtrando de _MAX_ registros totales)',
    search: 'Buscar:',
    paginate: {
      first: 'Primero',
      last: 'Último',
      next: 'Siguiente',
      previous: 'Anterior'
    },
  }
};

export const dtOptionsCas108 = {
  responsive: true,
  retrieve: true,
  paging: false,
  ordering: false,
  order: [],
  info: false,
  searching: false,
  language: {
    zeroRecords: 'No hay registros disponibles',
  }
};

export const dtOptionsConsultas = {
  responsive: false,
  searching: false,
  scrollX: true,
  pagingType: 'full_numbers',
  aoColumnDefs: [{ bSortable: false, aTargets: [3, 5, 6, 7, 8] }],
  ordering: true,
  order: [],
  lengthMenu: [[10, 20, 30, 50], [10, 20, 30, 50]],
  retrieve: true,
  language: {
    lengthMenu: 'Mostrar _MENU_ registros',
    zeroRecords: 'No hay registros disponibles',
    info: 'Mostrando _END_ de _END_ de un total de _TOTAL_ registros',
    infoEmpty: '',
    infoFiltered: '(filtrando de _MAX_ registros totales)',
    paginate: {
      first: 'Primero',
      last: 'Último',
      next: 'Siguiente',
      previous: 'Anterior'
    },
  }
};

export const dtOptionsCas297 = {
  responsive: true,
  searching: false,
  pagingType: 'full_numbers',
  ordering: false,
  lengthMenu: [[10, 20, 30, 50], [10, 20, 30, 50]],
  order: [],
  retrieve: false,
  language: {
    zeroRecords: 'No hay registros disponibles',
    lengthMenu: '',
    info: 'Mostrando _START_ de _END_ de un total de _TOTAL_ registros',
    infoEmpty: 'Mostrando _END_ de _END_ de un total de _TOTAL_ registros',
    infoFiltered: '(filtrando de _MAX_ registros totales)',
    paginate: {
      first: 'Primero',
      last: 'Último',
      next: 'Siguiente',
      previous: 'Anterior'
    },
  }
};

export const dtOptionsPN = {
  pagingType: 'full_numbers', // REPLICA /shared/config.ts
  retrieve: true, // REPLICA /shared/config.ts
  destroy: true,
  paging: true,
  info: true,
  responsive: true, // REPLICA /shared/config.ts
  ordering: true,
  aoColumnDefs: [{ bSortable: false, aTargets: [0, 1, 2, 3, 4] }],
  order: [],
  //aoColumnDefs: [{ bSortable: false, aTargets: [0, 1] }], // REPLICA /shared/config.ts 
  //order: [[0, 'none'], [1, 'none']], // REPLICA /shared/config.ts
  // dom: 'Bfrtip',  11/11/19
  buttons: [],
  initComplete: (settings, json) => {
    // quitar la class a los botones dt-button
    document.querySelectorAll('div.dt-buttons > button.buttons-excel')
      .forEach(elemento => elemento.classList.remove('dt-button'));
    // cambiar nombre de botones de exel a exportar
    document
      .querySelectorAll('div.dt-buttons > button.buttons-excel > span')
      .forEach(e => e.innerHTML = 'Exportar');
  },
  // REPLICA /shared/config.ts
  language: {
    lengthMenu: 'Mostrar _MENU_ registros por página',
    zeroRecords: 'No hay registros disponibles',
    info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_  registros', // Mostrando _PAGE_ de _PAGES_
    infoEmpty: 'No hay registros disponibles',
    infoFiltered: '(filtrando de _MAX_ registros totales)',
    search: 'Buscar:',
    paginate: {
      first: 'Primero',
      last: 'Último',
      next: 'Siguiente',
      previous: 'Anterior'
    },
  }
};

export const dtOptionsPNComprobantesValidos = {
  pagingType: 'full_numbers', // REPLICA /shared/config.ts
  retrieve: true, // REPLICA /shared/config.ts
  destroy: true,
  paging: true,
  info: true,
  responsive: true, // REPLICA /shared/config.ts 
  aoColumnDefs: [{ bSortable: false, aTargets: [0, 1, 2, 3] }], // REPLICA /shared/config.ts 
  order: [], // REPLICA /shared/config.ts
  // dom: 'Bfrtip',  11/11/19
  buttons: [],
  initComplete: (settings, json) => {
    // quitar la class a los botones dt-button
    document.querySelectorAll('div.dt-buttons > button.buttons-excel')
      .forEach(elemento => elemento.classList.remove('dt-button'));
    // cambiar nombre de botones de exel a exportar
    document
      .querySelectorAll('div.dt-buttons > button.buttons-excel > span')
      .forEach(e => e.innerHTML = 'Exportar');
  },
  // REPLICA /shared/config.ts
  language: {
    lengthMenu: 'Mostrar _MENU_ registros por página',
    zeroRecords: 'No hay registros disponibles',
    info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_  registros', // Mostrando _PAGE_ de _PAGES_
    infoEmpty: 'No hay registros disponibles',
    infoFiltered: '(filtrando de _MAX_ registros totales)',
    search: 'Buscar:',
    paginate: {
      first: 'Primero',
      last: 'Último',
      next: 'Siguiente',
      previous: 'Anterior'
    },
  }
};

export const dtOptionsCas514Check = {
  responsive: true,
  pagingType: 'full_numbers',
  ordering: true,
  aoColumnDefs: [{ bSortable: false, aTargets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }],
  order: [],
  retrieve: true,
  language: {
    lengthMenu: 'Mostrar _MENU_ registros por página',
    zeroRecords: 'No hay registros disponibles',
    info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_  registros',
    infoEmpty: 'No hay registros disponibles',
    infoFiltered: '(filtrando de _MAX_ registros totales)',
    search: 'Buscar:',
    paginate: {
      first: 'Primero',
      last: 'Último',
      next: 'Siguiente',
      previous: 'Anterior'
    },
  }
};

export const I18N_VALUES = {
  es: {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
  }
};
