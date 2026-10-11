# LiderBCI

App personal para llevar el registro de las compras hechas con la tarjeta de crédito durante un periodo de facturación: anota cada compra con su fecha, comercio y monto, y muestra arriba el total acumulado.

Es un registro personal. No es la app oficial de la tarjeta ni está conectada al banco.

## Qué hace

- **Total acumulado**: al inicio, la suma de todas las compras del periodo, con la cantidad de compras y el rango de fechas.
- **Registrar compra**: fecha (por defecto hoy), comercio y monto en pesos. "Guardar y agregar otra" deja la hoja abierta para anotar varias seguidas. Los comercios ya usados se sugieren al escribir.
- **Listado numerado**: cada compra lleva su número según el orden cronológico (la N.º 1 es la más antigua). Se puede ver con las más recientes o las más antiguas primero.
- **Editar o eliminar**: toca una compra para corregirla o borrarla.
- **Limpiar registros**: borra todas las compras para empezar el siguiente periodo de facturación. Pide confirmación, permite copiar el listado antes de borrar y ofrece "Deshacer" por unos segundos.
- **Widget en la pantalla de inicio**: muestra el total acumulado y las tres últimas compras, sin abrir la app.
- **Respaldo**: copia todas las compras como texto y restáuralas desde ahí (los datos viven solo en el dispositivo).

## Widget en la pantalla de inicio

Muestra el total acumulado del periodo y las tres últimas compras. Una app web no puede crear widgets en iPhone, así que el widget se hace con **Scriptable**, una app gratuita que dibuja widgets a partir de un script. Es el mismo sistema de los widgets de FAN y Master.

**1. Conectar el repositorio privado**

El widget no puede leer los datos de la app, que viven dentro de ella. Por eso LiderBCI publica el total y las últimas compras en un repositorio **privado** de GitHub, y el script los lee desde ahí. Sirve el mismo buzón de FAN y Master (`fan-avisos`):

1. Abre FAN y entra a **Buzón y atajo**. Toca **Automatización en Atajos** para desplegarla y, en el paso 5, toca **Copiar autorización**. En Master el mismo botón está en **Buzón y atajo → Crear la automatización desde cero**.
2. Abre LiderBCI y toca **Widget en la pantalla de inicio**.
3. Revisa el repositorio (`tu-usuario/fan-avisos`) y pega la autorización en **Token de acceso**. Se puede pegar tal cual, con la palabra `Bearer` delante.
4. Toca **Probar y conectar**.

Sin FAN ni Master, basta un repositorio privado cualquiera y un token *fine-grained* con acceso solo a ese repositorio y el permiso **Issues: Read and write**. La misma hoja trae los pasos.

**2. Instalar el widget**

1. Instala **Scriptable** desde el App Store.
2. En LiderBCI, en **Widget en la pantalla de inicio**, toca **Copiar el script del widget**. El script va completo, con el repositorio y el token.
3. Abre Scriptable, toca **+** y pega el script. Nómbralo **LiderBCI** y ejecútalo con **▶**: debe mostrar el total acumulado.
4. En la pantalla de inicio, mantén presionado un espacio vacío, toca **Editar → Agregar widget**, busca **Scriptable** y elige el tamaño mediano.
5. Mantén presionado el widget nuevo, toca **Editar widget** y en **Script** elige **LiderBCI**.

Cómo funciona:

- Al copiar el script, el widget queda activado. Desde entonces, cada vez que anotas, corriges o borras una compra, LiderBCI publica el total, la cantidad de compras y las tres últimas en un hito (*milestone*) del repositorio privado, llamado «LiderBCI · widget».
- Las compras de LiderBCI se anotan a mano, así que el widget muestra lo último que publicó la app. No hay nada que sumar desde los correos del banco, como hacen FAN y Master.
- Si no había conexión al anotar una compra, el envío queda pendiente y se hace al abrir la app de nuevo.
- Al limpiar los registros para un nuevo periodo, el widget vuelve a $0.
- iOS decide cada cuánto actualiza el widget, normalmente cada varios minutos. No es instantáneo.
- Al tocar el widget se abre Scriptable, no LiderBCI: iOS no permite abrir una app web instalada desde un widget.
- También sirve en tamaño pequeño y en la pantalla bloqueada (rectangular).
- El widget convive con los de FAN y Master: usan el mismo repositorio, pero cada uno tiene su propio script y su propio hito.
- **Desactivar el widget**, en la misma hoja, deja de publicar y borra lo publicado. **Desconectar el repositorio** además olvida el token en este dispositivo.
- El widget funciona con la app publicada en GitHub Pages. Dentro de Claude, la página no puede llamar a GitHub y la opción no aparece.

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
| `widget/liderbci-widget.js` | Script del widget para la app Scriptable. LiderBCI lo entrega completo con el botón de copiar; `index.html` lleva una copia idéntica entre las marcas `WIDGET:START` y `WIDGET:END`, que hay que renovar si el script cambia |
| `icons/icon-full.svg` | Icono original a pantalla completa (fuente de los PNG) |
| `icons/icon.svg` | Icono con esquinas redondeadas (favicon) |
| `icons/apple-touch-icon.png` | Icono de 180 px para la pantalla de inicio del iPhone |
| `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-1024.png` | Iconos del manifiesto y archivo de alta resolución |

## Datos

Las compras se guardan en `localStorage` del navegador bajo la clave `liderbci-compras`. Cada registro tiene fecha (`date`), comercio (`store`), monto en pesos (`amount`) y el momento en que se anotó (`ts`). La lista de comercios sugeridos se guarda aparte (`liderbci-comercios`) y se conserva al limpiar los registros.

Los datos del widget quedan en `liderbci-preferencias`: el repositorio privado, el token, si el widget está activado y el momento del último envío. El token se guarda solo en el dispositivo y no entra en los respaldos. Este repositorio solo contiene el código de la app; lo que el widget muestra se publica en el repositorio privado.

## Icono

El icono es un diseño propio inspirado en los colores de la tarjeta (azul y amarillo, más cuatro colores de acento). No reproduce los logotipos de las marcas, que pertenecen a sus dueños.
