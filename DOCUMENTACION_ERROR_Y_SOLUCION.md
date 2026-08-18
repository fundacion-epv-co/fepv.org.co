# Diagnóstico del error: páginas vacías e imágenes sin cargar

## Resumen ejecutivo

El proyecto fue desarrollado para cargar contenido dinámico desde Google Sheets y imágenes desde Google Drive. La aplicación no está fallando por un error de React o de Next.js en sí, sino porque la configuración de datos y archivos no está completa.

El problema principal es que el sitio está esperando URLs reales de Google Sheets y de imágenes, pero en la configuración actual no existen valores válidos. Cuando las variables quedan vacías o con valores placeholder, las páginas se comportan como si no hubiera contenido y muestran secciones vacías.

---

## Qué se hizo en el proyecto

Se construyó una arquitectura basada en:

- Google Sheets como fuente de contenido dinámico
- Google Drive para imágenes
- Next.js App Router para páginas institucionales
- CSV parsing con Papa Parse
- Variables de entorno centralizadas en `lib/api.js`

En el archivo `lib/api.js` se definieron constantes como:

- `NEXT_PUBLIC_GOOGLE_SHEETS_CONVOCATORIAS_CSV`
- `NEXT_PUBLIC_GOOGLE_SHEETS_NOTICIAS_CSV`
- `NEXT_PUBLIC_GOOGLE_SHEETS_BANNER_CSV`
- `NEXT_PUBLIC_GOOGLE_SHEETS_TESTIMONIOS_CSV`
- `NEXT_PUBLIC_GOOGLE_SHEETS_GALERIA_CSV`
- `NEXT_PUBLIC_GOOGLE_SHEETS_EQUIPO_CSV`
- `NEXT_PUBLIC_GOOGLE_SHEETS_PROGRAMAS_CSV`
- `NEXT_PUBLIC_GOOGLE_SHEETS_CONFIG_CSV`

También se implementó una función para transformar imágenes de Google Drive en URLs directas de imagen:

- `getDirectDriveImageUrl(url)`

Y se hace parseo de CSV con:

- `fetchGoogleSheetData(url)`

Esto permite que las páginas carguen datos si la URL del CSV está bien configurada.

---

## El error real

El error principal es: la aplicación no tiene las URLs de origen reales cargadas.

En `lib/api.js` se usa esta lógica:

```js
export const GOOGLE_SHEETS_NOTICIAS_CSV = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_NOTICIAS_CSV || "PENDIENTE_DE_URL_NOTICIAS";
```

Esto significa:

- si la variable de entorno no existe,
- o si no está definida en `.env.local`,
- entonces el valor queda como `PENDIENTE_DE_URL_NOTICIAS`.

Cuando eso ocurre, el código interpreta que:

- la hoja no está configurada,
- no hay datos que mostrar,
- debe mostrar una sección vacía o en construcción.

Lo mismo ocurre con imágenes: si no se pasa una URL válida, `getDirectDriveImageUrl()` devuelve cadena vacía o una URL que no carga.

---

## Cómo se ve el problema en las páginas

### Páginas con contenido dinámico
Ejemplos:

- `app/noticias/page.js`
- `app/page.js`
- `app/galeria/page.js`
- `app/nosotros/page.js`
- `app/programas/page.js`
- `app/intranet/page.js`

Estas páginas hacen fetch a Google Sheets. Si la URL está pendiente, el flujo es:

1. Detecta que no hay configuración
2. Devuelve un arreglo vacío
3. La UI renderiza “sin datos”, “en construcción” o vacío

### Imágenes
Las imágenes se leen con URLs de Drive o de Sheets. Si el enlace no es una URL pública válida, se rompe la carga o queda en blanco.

---

## Por qué las páginas quedan vacías

Hay dos condiciones que provocan esto:

### 1. Faltan variables de entorno
El proyecto tiene plantilla en `.env.example`, pero no hay un archivo `.env.local` real con valores concretos.

El archivo `/.env.example` muestra exactamente el formato que debe usarse, por ejemplo:

```env
NEXT_PUBLIC_GOOGLE_SHEETS_NOTICIAS_CSV=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?gid=859625685&single=true&output=csv
NEXT_PUBLIC_GOOGLE_SHEETS_BANNER_CSV=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?gid=1671239233&single=true&output=csv
```

Eso es solo una plantilla. `YOUR_SHEET_ID` debe ser reemplazado por el ID real de la hoja.

### 2. Las hojas de Google Sheets no están publicadas correctamente
Las URLs deben ser de tipo CSV público, no la URL de edición de Google Sheets.

Debe usar este formato:

```txt
https://docs.google.com/spreadsheets/d/e/ID/public?output=csv
```

o también:

```txt
https://docs.google.com/spreadsheets/d/e/ID/pub?gid=0&single=true&output=csv
```

Si se usa una URL de edición o privada, no se puede leer en la app.

---

## Cómo solucionar el problema

### Paso 1: crear el archivo `.env.local`
Copiar la estructura de `.env.example` y poner valores reales.

Ejemplo:

```env
NEXT_PUBLIC_GOOGLE_SHEETS_NOTICIAS_CSV=https://docs.google.com/spreadsheets/d/e/ABC123/pub?gid=859625685&single=true&output=csv
NEXT_PUBLIC_GOOGLE_SHEETS_BANNER_CSV=https://docs.google.com/spreadsheets/d/e/ABC123/pub?gid=1671239233&single=true&output=csv
NEXT_PUBLIC_GOOGLE_SHEETS_TESTIMONIOS_CSV=https://docs.google.com/spreadsheets/d/e/ABC123/pub?gid=1002&single=true&output=csv
NEXT_PUBLIC_GOOGLE_SHEETS_GALERIA_CSV=https://docs.google.com/spreadsheets/d/e/ABC123/pub?gid=2002&single=true&output=csv
NEXT_PUBLIC_GOOGLE_SHEETS_CONFIG_CSV=https://docs.google.com/spreadsheets/d/e/ABC123/pub?gid=3001&single=true&output=csv
```

### Paso 2: verificar las URLs de Sheets
En Google Sheets:

1. Abre la hoja
2. Ve a Archivo
3. Publicar en la web
4. Selecciona CSV o publicación web
5. Copia la URL pública

### Paso 3: revisar las columnas esperadas
Cada página espera nombres específicos en la primera fila. Si la hoja no tiene esos nombres, la información llega vacía.

Ejemplo para noticias:

- `id`
- `titulo`
- `fecha`
- `categoria`
- `resumen`
- `autor`
- `contenido`
- `enlace_imagen_drive`

Ejemplo para banner:

- `titulo`
- `subtitulo`
- `texto_boton`
- `url_boton`
- `imagen`

### Paso 4: revisar las imágenes de Drive
Debe haber un enlace público o un ID de archivo válido. Si la imagen viene de Google Drive, `getDirectDriveImageUrl()` intentará convertirla a una URL directa.

Si la imagen no es pública o el ID está mal, la imagen no carga.

### Paso 5: reiniciar la app

```bash
npm run dev
```

Si se cambió `.env.local`, normalmente hay que reiniciar el servidor.

---

## Lo que faltó implementar de forma obligatoria

El proyecto necesita estas cosas para funcionar de verdad:

1. Archivo `.env.local` con URLs reales
2. Publicación web de cada Google Sheet
3. Columnas nombradas según el código
4. Imágenes con enlaces válidos y públicos
5. Verificación del flujo en navegador
6. Reinicio del proyecto después de cambiar configuración

---

## Conclusión

El proyecto estaba bien estructurado, pero el contenido dependía de una conexión externa que nunca fue configurada. Por eso las páginas aparecen vacías y las imágenes no se leen.

El error no fue “de código principal”, sino de configuración y conexión con datos externos.

---

## Recomendación final

Lo correcto es dejar el proyecto en este estado:

- `.env.local` con todas las URLs reales
- Google Sheets publicadas como CSV
- imágenes públicas
- columnas correctamente nombradas

Cuando eso esté configurado, la aplicación carga contenido y deja de mostrar páginas vacías.
