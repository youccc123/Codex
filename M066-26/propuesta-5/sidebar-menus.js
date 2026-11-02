// Submenús de navegación de la referencia. Las opciones son visuales del mockup.
(() => {
  const nav = document.querySelector('.sidebar nav') || document.querySelector('body > aside nav');
  const exterior = !document.querySelector('.sidebar');
  const asset = exterior ? '../assets/' : 'assets/';
  const groups = [
    ['Cash Management', ['Pagos', 'Cobros']],
    ['Consultar', ['Operaciones Realizadas', 'Cheques Emitidos', 'Facturas', 'Localizaciones', 'Resumen Semestral', 'Estado Crediticio', 'Habilitación de Cheques', 'Cheque Devuelto/Rechazado', 'Descuentos de Documentos', 'Cash Management', 'Transferencias', 'Archivos de Movimientos']],
    ['Líneas aprobadas', ['Adelanto de Tarjetas', 'Anticipo de Salario', 'Préstamo Ágil']],
    ['Billeteras', ['Zimple - Giros', 'Zimple - Cargar', 'Zimple - Transferencias', 'Tigo - Giro', 'Tigo - Carga', 'Tigo Mayorista - Carga de Dinero', 'Tigo Mayorista - Retiro de Dinero']],
    ['Operaciones con QR', ['Cobros QR', "QR'S Generados"]],
    ['Operaciones SIP', ['Transferencias', 'Devolver transferencias', 'Solicitudes de devoluciones', 'Solicitar devolución de transferencia', 'Solicitudes de Pago Recibidas', 'Solicitud de Pago']],
    ['Configuraciones', ['Configuración Tarjeta Credito', 'Configuración Tarjeta Debito', 'Alarma', 'Mi Alias', 'Tarjetas', 'Cuentas', 'Datos Personales', 'Domicilio']]
  ];
  groups.forEach(([label, options], index) => {
    let toggle = Array.from(nav.children).find(el => el.tagName === 'BUTTON' && el.textContent.trim() === label);
    if (!toggle && label === 'Cash Management') {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.innerHTML = `<span><img src="${asset}payments.svg" alt=""></span> Cash Management <b><img src="${asset}arrow.svg" alt=""></b>`;
      document.getElementById('paymentsMenu').after(toggle);
    }
    if (!toggle) return;
    const menu = document.createElement('div');
    menu.id = `additionalMenu${index}`;
    menu.className = 'additional-menu';
    menu.hidden = true;
    toggle.classList.add('additional-toggle');
    toggle.setAttribute('aria-controls', menu.id);
    toggle.setAttribute('aria-expanded', 'false');
    options.forEach(label => {
      const option = document.createElement('button');
      option.type = 'button';
      option.textContent = label;
      menu.append(option);
    });
    toggle.after(menu);
    toggle.onclick = () => {
      menu.hidden = !menu.hidden;
      toggle.setAttribute('aria-expanded', String(!menu.hidden));
    };
  });
})();
