# QA — Inicio de propuesta 4

final result: passed

## Evidencia
- Referencia: captura adjunta del usuario y https://dev.sudameris.com.py/sudamerisweb/home.
- Implementación: http://127.0.0.1:8765/propuesta-4/.
- Capturas de referencia e implementación: emitidas juntas en la conversación durante «Comparar resultado y probar acceso a transferencias»; no se guardaron archivos de captura.
- Comparación final: 1327 × 964 píxeles, viewport CSS 1327 × 964, densidad efectiva 1:1. Estado inicial, tema claro, tres cuentas visibles. Override de viewport restaurado después de verificar.
- La marca azul de la anotación no forma parte del producto y se omite.

## Revisión visual
- Tipografía: DIN Round original, pesos regular y bold locales; jerarquía y tamaños equivalentes.
- Espaciado: menú lateral, encabezado, tres tarjetas y columna de promociones alineados con la referencia.
- Colores: fondos claros, bordes grises, acciones rojas y etiquetas de cuenta grises.
- Recursos: logo, iconos e ilustraciones originales exportados desde la página; sin imágenes generadas ni dependencias de red al abrir el inicio.
- Contenido: monedas, saldos, etiquetas y promociones de la referencia reproducidos.
- Las capturas completas permiten leer las tarjetas, textos e iconos; no se necesitó una captura de detalle independiente.

## Iteraciones
1. Primera comparación: diferencias de viewport, columna lateral algo más ancha y desplazamiento vertical. Se igualó el viewport, se corrigieron las proporciones, el espaciado superior y la altura del contenedor; se eliminó el indicador rojo oculto en el icono original.
2. Comparación posterior: tarjetas y promociones alineadas, sin recortes ni hallazgos P0/P1/P2 pendientes.

## Validación funcional
- Inicio visible por defecto.
- Transferir desde la cuenta PYG abre el flujo con esa moneda y número de cuenta.
- Selección de destino USD y carga de 100 muestra «¿Quiere mejorar la cotización?» con foco aún en el importe.
- Menú Transferencias vuelve a la selección de origen.
- Logo vuelve al inicio.
- Consola: sin errores registrados.
- Filtros, pestañas y visibilidad de saldo implementados; no probados exhaustivamente.
- Los accesos fuera del flujo principal (promociones, movimientos, otros productos) son presentación del mockup.

## Pulido opcional
- P3: pequeñas diferencias en posición del logo e icono de perfil; no afectan la navegación ni la composición.
- No se realizó una comparación mobile: la referencia y el cambio solicitado son para web.

## Actualización — inicio de transferencias
- Referencia: https://dev.sudameris.com.py/sudamerisweb/secure/transfer y captura adjunta del usuario.
- Implementación: propuesta 4, menú Transferencias, sin cuenta seleccionada.
- Evidencia: ambas capturas emitidas en una misma comparación en «Verificar alineación final del inicio de transferencias». Capturas en conversación, sin archivos locales.
- Viewport y píxeles: 1327 × 964, densidad efectiva 1:1. Se restauró el viewport al terminar.
- Primera comparación: tarjetas 22 px por debajo de la referencia y tipo de cuenta con peso excesivo. Corregidos márgenes de título, pestañas y buscador, y peso regular de etiqueta.
- Segunda comparación: alineación de buscador, tres tarjetas y columna vacía acorde a referencia. Logo y pequeños desplazamientos de iconos se mantienen como P3 previamente registrado.
- Tipografía: DIN Round original; colores: grises, blanco y rojo de referencia; ritmo: tarjetas 108 px con 16 px de separación; imágenes: iconos originales; contenido: cuentas USD/PYG/EUR y saldos de referencia.
- Textos e iconos legibles en comparación completa; no fue necesario un recorte adicional.
- Probado: entrada desde menú; búsqueda EUR deja solo una cuenta; limpiar restaura la lista; seleccionar PYG abre destinatarios con 4018190000; destino USD y monto 100 muestran opción de mejora durante escritura; regresar al menú restaura las tres cuentas. Consola sin errores.
- El panel de límites permanece oculto hasta elegir origen, como en la referencia. El borde azul de anotación no se reproduce.
- final result: passed

## Actualización — selección de destinatario
- Referencia: captura del usuario y https://dev.sudameris.com.py/sudamerisweb/secure/transfer con origen USD seleccionado.
- Implementación: propuesta 4, estado destination-entry.
- Evidencia: capturas de ambas páginas emitidas juntas en «Revisar ajustes visuales y probar búsqueda de destinatarios», disponibles en la conversación; sin archivos locales de captura.
- Viewport CSS y capturas: 1327 × 964, densidad efectiva 1:1; override restaurado.
- Revisión: tipografía DIN Round, colores y fondos originales, columna 636 px, origen de 108 px y destinos de 140 px; icono de banco original descargado como asset local. Textos de las cuentas propias y encabezados coinciden.
- Primera comparación: peso excesivo del botón Agregar y ojo diferente en origen. Ajustados a peso regular e icono original; ajustada alineación superior 3 px.
- Segunda comparación: sin P0/P1/P2 pendientes. Pequeñas diferencias de espaciado y perfil heredado: P3.
- Las capturas completas muestran texto e iconos legibles, sin necesidad de recorte adicional.
- Pruebas: origen USD excluido de Sus cuentas; búsqueda por número y PYG; selección de cuenta propia PYG muestra número, titular y tipo correctos; monto 100 muestra mejora; Cambiar cuenta de destino restaura listado y buscador. Consola sin errores.
- Alcance: dos destinatarios agendados representativos, incluido el destinatario de prueba previo. No se replica la agenda completa. Agregar nueva cuenta y edición de agenda quedan fuera del flujo implementado.
- final result: passed

## Actualización — estilo del formulario
- Objetivo: extender el lenguaje de las pantallas anteriores al formulario existente, sin convertirlo en LBTR.
- Referencias: capturas previas de selección de cuentas/destinatario y anotación del formulario del usuario. Implementación: propuesta 4, transfer-form-mode.
- Evidencia visual: capturas en conversación «Revisar el formulario con el estilo actualizado» y «Dejar visible el formulario final actualizado», 1327 × 964. Sin archivos locales. Estado PYG a USD, importe cero; también revisada oferta desplegada con importe 100.
- Tipografía: DIN Round; tarjetas: origen 108 px y destino 124 px; separación y bordes coherentes con pantallas previas. Icono de banco original. Panel de límites con títulos regulares y texto 14/16 px. Contenido y valores de límites conservados.
- Corregida falta de espacio entre Concepto y [opcional], verificada después de recargar.
- Prueba funcional: importe 100 muestra enlace de mejora; clic despliega comparación y botón Aplicar. Sin errores de consola.
- No hay P0/P1/P2 visuales detectados en el alcance del ajuste. Captura completa permite leer formulario y límites. P3 heredados de logo/perfil.
- final result: passed


## Formulario entre cuentas propias — 24/09/2026
Se adaptó la propuesta 4 a la última captura: sin pestañas ni límites en cuentas propias, saldo en destino, moneda/monto/cotización en una fila y Programar debajo. Se conservan las tasas demostrativas existentes. Verificación visual en navegador de escritorio: sin solapamientos en el formulario. Verificación funcional: monto 100 muestra el enlace durante la edición; clic despliega la oferta; cambiar a 0 oculta enlace y oferta. Se dejó monto 100 para revisión.

## Confirmación — referencia del usuario
Adaptada la pantalla siguiente: detalle de crédito/débito, total, verificación por email simulada y seis campos. QA visual de escritorio realizada; recorrido SIGUIENTE/CANCELAR comprobado. USD 100 con tasa demostrativa 6.000 presenta Gs. 600.000; tras aplicar oferta 6.050 presenta Gs. 605.000 y etiqueta Cotización mejorada. No se envían correos ni transferencias.

## Resultado
Agregada pantalla según referencia: éxito, resumen, detalles y comprobante. Verificado recorrido local completo con código de seis dígitos; importe y cuentas se conservan. Compartir/favoritos son simulados; descarga genera comprobante de demostración.

## Más detalles
Vista adaptada a referencia con ejecución, soporte, fechas, crédito, débito y total. Verificado recorrido hasta pestaña Más detalles y datos de USD 10 a tasa demostrativa 6.000. Ajustado ancho del número de operación tras revisión visual.
