import Papa from 'papaparse';

// La URL de Google Sheets CSV para Convocatorias (gid=0)
export const GOOGLE_SHEETS_CONVOCATORIAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=0&single=true&output=csv";

// La URL de Google Sheets CSV para Ofertas de Empleo (gid=2001)
export const GOOGLE_SHEETS_OFERTAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=2001&single=true&output=csv";

// La URL de Google Sheets CSV para Agencias de Empleo (gid=1489659684)
export const GOOGLE_SHEETS_AGENCIAS_EMPLEO_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1489659684&single=true&output=csv";

// La URL de Google Sheets CSV para Noticias
export const GOOGLE_SHEETS_NOTICIAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=859625685&single=true&output=csv";

// La URL de Google Sheets CSV para Métricas de Impacto
export const GOOGLE_SHEETS_METRICAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=881055830&single=true&output=csv";

// La URL de Google Sheets CSV para Intranet (Formatos - Lectura)
export const GOOGLE_SHEETS_INTRANET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=183119704&single=true&output=csv";

// API REST de Google Apps Script para Intranet (Multi-Usuario y Cargas)
export const GOOGLE_APPS_SCRIPT_INTRANET_URL = "https://script.google.com/macros/s/AKfycbyhwUnj41JhtS07NHdVwZmvMhDpRFULVtI3mBAFEqegA97CMj1DYFzps_YsIk0r9y7n9w/exec";

// La URL de Google Sheets CSV para el Carrusel/Banner Principal
export const GOOGLE_SHEETS_BANNER_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1671239233&single=true&output=csv";

// La URL de Google Sheets CSV para los Testimonios ("Cada encuentro deja una huella")
export const GOOGLE_SHEETS_TESTIMONIOS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1002&single=true&output=csv";

// La URL de Google Sheets CSV para la Galería de Fotos
export const GOOGLE_SHEETS_GALERIA_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=2002&single=true&output=csv";

// NUEVAS CONSTANTES DE HOJAS INDIVIDUALES DE LA FASE 8 (CMS)
export const GOOGLE_SHEETS_EQUIPO_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10001&single=true&output=csv";
export const GOOGLE_SHEETS_PROGRAMAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=164572338&single=true&output=csv";
export const GOOGLE_SHEETS_ALIADOS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10003&single=true&output=csv";
export const GOOGLE_SHEETS_FAQ_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10004&single=true&output=csv";
export const GOOGLE_SHEETS_METAS_DONACION_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10005&single=true&output=csv";

/**
 * Convierte un enlace estándar de visualización de Google Drive en un enlace directo de imagen.
 * @param {string} url - Enlace original
 * @returns {string} - Enlace directo para <img> o css background
 */
export function getDirectDriveImageUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
    let id = "";
    // Detectar patrón /d/ID
    const fileDMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch) {
      id = fileDMatch[1];
    } else {
      // Detectar patrón ?id=ID o &id=ID
      const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch) {
        id = idMatch[1];
      }
    }
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}`;
    }
  }
  return trimmed;
}


/**
 * Fetch and parse a Google Sheets CSV
 * @param {string} url - The CSV URL
 * @returns {Promise<Array>} - Array of objects representing the rows
 */
export async function fetchGoogleSheetData(url) {
  try {
    const response = await fetch(url, { cache: 'no-store' }); // Disable cache for real-time updates
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true, // Usa la primera fila como nombres de las propiedades
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching Google Sheet CSV:", error);
    return [];
  }
}

/**
 * Enviar peticiones POST a la API de Intranet (Google Apps Script)
 * @param {string} action - Acción a realizar (login, getUsers, addUser, uploadDocument)
 * @param {object} payload - Datos adicionales
 * @returns {Promise<object>} - Respuesta del servidor
 */
export async function postToIntranetAPI(action, payload) {
  if (GOOGLE_APPS_SCRIPT_INTRANET_URL === "PENDIENTE_DE_URL_SCRIPT_INTRANET") {
    throw new Error("El sistema aún no está conectado al servidor. Falta la URL de Apps Script.");
  }

  const response = await fetch(GOOGLE_APPS_SCRIPT_INTRANET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8" // Usamos text/plain para evitar el preflight OPTIONS request de CORS
    },
    // Es importante enviar un body stringificado plano
    body: JSON.stringify({
      action,
      ...payload
    })
  });

  const result = await response.json();
  return result;
}

// URL de la pestaña de Configuración Global (el usuario debe cambiar el GID cuando la cree en Sheets)
export const GOOGLE_SHEETS_CONFIG_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=3001&single=true&output=csv";

/**
 * Obtiene las variables de configuración global y las mapea a un objeto clave-valor.
 */
export async function fetchGlobalConfig() {
  try {
    const data = await fetchGoogleSheetData(GOOGLE_SHEETS_CONFIG_CSV);
    const config = {};
    if (data && data.length > 0) {
      data.forEach(row => {
        const key = row.clave || row.key || "";
        const val = row.valor || row.value || "";
        if (key.trim()) {
          config[key.trim()] = val.trim();
        }
      });
    }
    return config;
  } catch (error) {
    console.error("Error al obtener la configuración global:", error);
    return {};
  }
}

// URL de la pestaña de Imágenes de Programas
export const GOOGLE_SHEETS_IMAGENES_PROGRAMAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10006&single=true&output=csv";

/**
 * Obtiene el mapa de imágenes por programa.
 */
export async function fetchProgramImagesMap() {
  try {
    const data = await fetchGoogleSheetData(GOOGLE_SHEETS_IMAGENES_PROGRAMAS_CSV);
    const map = {};
    if (data && data.length > 0) {
      data.forEach(row => {
        const progId = row.programa_id || row.id || "";
        const url = row.enlace_imagen || row.imagen || "";
        if (progId.trim()) {
          map[progId.trim()] = url.trim();
        }
      });
    }
    return map;
  } catch (error) {
    console.error("Error al obtener mapa de imágenes de programas:", error);
    return {};
  }
}

// URL de la pestaña de Imágenes de Poblaciones (gid=1634033147)
export const GOOGLE_SHEETS_IMAGENES_POBLACIONES_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1634033147&single=true&output=csv";

/**
 * Obtiene el mapa de imágenes de poblaciones (gid=1634033147).
 */
export async function fetchPoblacionesImagesMap() {
  try {
    const data = await fetchGoogleSheetData(GOOGLE_SHEETS_IMAGENES_POBLACIONES_CSV);
    const map = {};
    if (data && data.length > 0) {
      data.forEach(row => {
        const id = row.id || row.programa_id || row.poblacion_id || "";
        const url = row.enlace_imagen || row.imagen || row.url || "";
        if (id.trim()) {
          map[id.trim()] = url.trim();
        }
      });
    }
    return map;
  } catch (error) {
    console.error("Error al obtener mapa de imágenes de poblaciones:", error);
    return {};
  }
}

/**
 * Determina si una cadena es una URL de imagen.
 */
export function isImageUrl(str) {
  if (!str || typeof str !== "string") return false;
  const lower = str.toLowerCase().trim();
  return (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("data:image") ||
    lower.includes("drive.google.com") ||
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".svg")
  );
}




export async function getDynamicPrograms() {
  try {
    const [data, imagesMap] = await Promise.all([
      fetchGoogleSheetData("https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=164572338&single=true&output=csv"),
      fetchProgramImagesMap()
    ]);
    
    if (!data || data.length === 0) return [];
    
    return data.map(row => {
      let odsArray = [];
      if (row.ods) {
        odsArray = String(row.ods).split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      }
      
      let compArray = [];
      if (row.componentes) {
        compArray = String(row.componentes).split('|').map(comp => {
          const parts = comp.split(':');
          return {
            title: parts[0]?.trim() || "",
            desc: parts.slice(1).join(':')?.trim() || ""
          };
        }).filter(c => c.title);
      }
      
      let indArray = [];
      if (row.indicadores) {
        indArray = String(row.indicadores).split('|').map(i => i.trim()).filter(i => i);
      }

      let statusColor = "text-gray-500 bg-gray-50 border-gray-200";
      const st = (row.estado || "").toLowerCase();
      if (st.includes("desarrollo")) statusColor = "text-blue-500 bg-blue-50 border-blue-200";
      else if (st.includes("financiación") || st.includes("financiacion")) statusColor = "text-amber-500 bg-amber-50 border-amber-200";
      else if (st.includes("ejecución") || st.includes("ejecucion")) statusColor = "text-green-600 bg-green-50 border-green-200";
      else if (st.includes("próximamente") || st.includes("proximamente")) statusColor = "text-purple-500 bg-purple-50 border-purple-200";

      const slug = row.slug?.trim() || `prog-${Math.random()}`;

      return {
        id: slug,
        code: row.codigo?.trim() || "",
        title: row.titulo?.trim() || "",
        subtitle: row.subtitulo?.trim() || "",
        category: row.categoria?.trim() || "",
        icon: imagesMap[slug] || row.icono?.trim() || row.imagen?.trim() || row.enlace_imagen?.trim() || "📌",
        status: row.estado?.trim() || "Próximamente",
        statusColor,
        location: row.ubicacion?.trim() || "",
        population: row.poblacion?.trim() || "",
        challenge: row.desafio?.trim() || "",
        response: row.respuesta?.trim() || "",
        important: row.importante?.trim() || "",
        components: compArray,
        indicators: indArray,
        allies: row.aliados?.trim() || "",
        ods: odsArray
      };
    }).filter(p => p.title);
  } catch (err) {
    console.error("Error getDynamicPrograms:", err);
    return [];
  }
}
