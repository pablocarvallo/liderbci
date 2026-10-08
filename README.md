# LiderBCI

App personal para llevar el registro de las compras hechas con la tarjeta de crédito durante un periodo de facturación: anota cada compra con su fecha, comercio y monto, y muestra arriba el total acumulado.

Es un registro personal. No es la app oficial de la tarjeta ni está conectada al banco.

## Qué hace

- **Total acumulado**: al inicio, la suma de todas las compras del periodo, con la cantidad de compras y el rango de fechas.
- **Registrar compra**: fecha (por defecto hoy), comercio y monto en pesos. "Guardar y agregar otra" deja la hoja abierta para anotar varias seguidas. Los comercios ya usados se sugieren al escribir.
- **Listado numerado**: cada compra lleva su número según el orden cronológico (la N.º 1 es la más antigua). Se puede ver con las más recientes o las más antiguas primero.
- **Editar o eliminar**: toca una compra para corregirla o borrarla.
- **Limpiar registros**: borra todas las compras para empezar el siguiente periodo de facturación. Pide confirmación, permite copiar el listado antes de borrar y ofrece "Deshacer" por unos segundos.
- **Respaldo**: copia todas las compras como texto y restáuralas desde ahí (los datos viven solo en el dispositivo).

## Instalar en el iPhone

1. En GitHub, ve a **Settings → Pages** y publica la rama `main` desde la raíz (`/`). La app queda en `https://pablocarvallo.github.io/liderbci/`.
2. Abre esa dirección en **Safari** en el iPhone.
3. Toca **Compartir → Añadir a pantalla de inicio**.

Se abre como app independiente, con su icono, y funciona sin conexión.

## Archivos

| Archivo | Uso |
| --- | --- |
| `index.html` | La app completa (HTML, CSS y JavaScript sin dependencias de compilación) |
| `manifest.webmanifest` | Nombre, colores e iconos de la app instalada |
| `sw.js` | Service worker para uso sin conexión |
| `icons/icon-full.svg` | Icono original a pantalla completa (fuente de los PNG) |
| `icons/icon.svg` | Icono con esquinas redondeadas (favicon) |
| `icons/apple-touch-icon.png` | Icono de 180 px para la pantalla de inicio del iPhone |
| `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-1024.png` | Iconos del manifiesto y archivo de alta resolución |

## Datos

Las compras se guardan en `localStorage` del navegador bajo la clave `liderbci-compras`. Cada registro tiene fecha (`date`), comercio (`store`), monto en pesos (`amount`) y el momento en que se anotó (`ts`). La lista de comercios sugeridos se guarda aparte (`liderbci-comercios`) y se conserva al limpiar los registros.

## Icono

El icono es un diseño propio inspirado en los colores de la tarjeta (azul y amarillo, más cuatro colores de acento). No reproduce los logotipos de las marcas, que pertenecen a sus dueños.
