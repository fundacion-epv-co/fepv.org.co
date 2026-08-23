import Papa from 'papaparse';

// ============================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ============================================
// Todas las URLs de Google Sheets se cargan desde .env.local
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

export const GOOGLE_SHEETS_CONVOCATORIAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=0&single=true&output=csv";
export const GOOGLE_SHEETS_OFERTAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=2001&single=true&output=csv";
export const GOOGLE_SHEETS_AGENCIAS_EMPLEO_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1489659684&single=true&output=csv";
export const GOOGLE_SHEETS_NOTICIAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=859625685&single=true&output=csv";
export const GOOGLE_SHEETS_METRICAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=881055830&single=true&output=csv";
export const GOOGLE_SHEETS_INTRANET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=183119704&single=true&output=csv";
export const GOOGLE_SHEETS_BANNER_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1671239233&single=true&output=csv";
export const GOOGLE_SHEETS_TESTIMONIOS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1002&single=true&output=csv";
export const GOOGLE_SHEETS_GALERIA_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=2002&single=true&output=csv";
export const GOOGLE_SHEETS_EQUIPO_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10001&single=true&output=csv";
export const GOOGLE_SHEETS_PROGRAMAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=164572338&single=true&output=csv";
export const GOOGLE_SHEETS_ALIADOS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1489659684&single=true&output=csv";
export const GOOGLE_SHEETS_FAQ_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10004&single=true&output=csv";
export const GOOGLE_SHEETS_METAS_DONACION_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10005&single=true&output=csv";
export const GOOGLE_SHEETS_IMAGENES_PROGRAMAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=10006&single=true&output=csv";
export const GOOGLE_SHEETS_IMAGENES_POBLACIONES_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1634033147&single=true&output=csv";
export const GOOGLE_SHEETS_CONFIG_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=3001&single=true&output=csv";
export const GOOGLE_SHEETS_LINEAS_ESTRATEGICAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1531730366&single=true&output=csv";
export const GOOGLE_SHEETS_ENFOQUES_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1393253018&single=true&output=csv";
export const GOOGLE_SHEETS_HITOS_HISTORIA_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1822539549&single=true&output=csv";
export const GOOGLE_SHEETS_TRANSPARENCIA_FONDOS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=682787246&single=true&output=csv";
export const GOOGLE_SHEETS_PARTICIPACION_DETALLES_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=140429865&single=true&output=csv";

// IMPORTANTE: URL de la API de Intranet
export const GOOGLE_APPS_SCRIPT_INTRANET_URL = "https://script.google.com/macros/s/AKfycbyQ9_z9z97d7i6d3cb9dOZO26w2M3_zSyCJucLVWwxy5qiPBZVM6HjzSKuBLrZdYsLj6w/exec";

// Configuración de revalidación
export const DATA_REVALIDATE_TIME = 300;

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
 * Valida que los datos del CSV tengan estructura mínima esperada
 * @param {Array} data - Datos del CSV
 * @param {Array} requiredFields - Campos requeridos (opcional)
 * @returns {boolean}
 */
export function validateCSVStructure(data, requiredFields = []) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Si se especifican campos requeridos, validar que al menos el primer registro tenga alguno
  if (requiredFields.length > 0) {
    const firstRow = data[0];
    const hasAtLeastOneField = requiredFields.some(field => firstRow.hasOwnProperty(field));
    if (!hasAtLeastOneField) {
      if (DEBUG) {
        console.warn(`CSV validation: No se encontraron campos esperados. Esperados: ${requiredFields.join(', ')}`);
      }
      return false;
    }
  }

  return true;
}

/**
 * Fetch and parse a Google Sheets CSV con validación y revalidation estratégico
 * @param {string} url - The CSV URL
 * @param {Array} requiredFields - Campos requeridos para validar estructura
 * @returns {Promise<Array>} - Array of objects representing the rows
 */
export async function fetchGoogleSheetData(url, requiredFields = []) {
  // Validar si la URL está configurada
  if (!url || url.includes("PENDIENTE")) {
    console.warn(`⚠️ URL de Google Sheets no configurada: ${url}`);
    return [];
  }

  try {
    const response = await fetch(url, { 
      // Usar revalidation estratégico en lugar de no-store
      // next: { revalidate: DATA_REVALIDATE_TIME } // Para ISR
      cache: 'no-store' // Por ahora mantenemos no-store para desarrollo
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim().length === 0) {
      throw new Error("CSV vacío desde Google Sheets");
    }
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Validar estructura
          if (!validateCSVStructure(results.data, requiredFields)) {
            if (DEBUG) {
              console.warn(`⚠️ Estructura CSV inválida o vacía. URL: ${url}`);
            }
          }

          resolve(results.data || []);
        },
        error: (error) => {
          console.error(`❌ Error parsing CSV: ${error.message}`);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`❌ Error fetching Google Sheet CSV (${url}):`, error.message);
    reportConnectionError(url, error.message);
    return [];
  }
}

export async function reportConnectionError(failedUrl, errorMessage) {
  try {
    const config = await fetchGlobalConfig();
    const intranetUrl = config['accesointranet'];
    if (intranetUrl && !intranetUrl.includes("PENDIENTE")) {
      fetch(intranetUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "reportConnectionError",
          url: failedUrl,
          message: errorMessage
        })
      }).catch(() => {}); // Ignoramos errores secundarios al reportar
    }
  } catch (e) {
    // Silencioso
  }
}

/**
 * Enviar peticiones POST a la API de Intranet (Google Apps Script)
 * Incluye mejor manejo de errores
 * @param {string} action - Acción a realizar (login, getUsers, addUser, uploadDocument)
 * @param {object} payload - Datos adicionales
 * @returns {Promise<object>} - Respuesta del servidor o error
 */
export async function postToIntranetAPI(action, payload) {
  try {
    // 1. Obtener la URL dinámicamente desde ConfiguracionGlobal
    const config = await fetchGlobalConfig();
    const intranetUrl = config['accesointranet'];

    if (!intranetUrl || intranetUrl.includes("PENDIENTE")) {
      throw new Error("Intranet no configurada. Falta la clave 'accesointranet' en ConfiguracionGlobal.");
    }

    // 2. Realizar la petición a la URL obtenida
    const response = await fetch(intranetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8" // Evitar preflight CORS
      },
      body: JSON.stringify({
        action,
        ...payload
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status} desde Google Apps Script`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`❌ Error en postToIntranetAPI (${action}):`, error.message);
    return {
      success: false,
      message: `Error de conexión: ${error.message}`
    };
  }
}

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

      const rawSlug = row.slug?.trim() || "";
      const slug = rawSlug ? rawSlug.toLowerCase().replace(/\s+/g, '-') : `prog-${Math.random()}`;

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

export async function fetchLineasEstrategicas() { return fetchGoogleSheetData(GOOGLE_SHEETS_LINEAS_ESTRATEGICAS_CSV, ['id', 'titulo']); }
export async function fetchEnfoques() { return fetchGoogleSheetData(GOOGLE_SHEETS_ENFOQUES_CSV, ['id', 'titulo']); }
export async function fetchHitosHistoria() { return fetchGoogleSheetData(GOOGLE_SHEETS_HITOS_HISTORIA_CSV, ['ano', 'titulo']); }
export async function fetchTransparenciaFondos() { return fetchGoogleSheetData(GOOGLE_SHEETS_TRANSPARENCIA_FONDOS_CSV, ['categoria', 'porcentaje']); }
export async function fetchParticipacionDetalles() { return fetchGoogleSheetData(GOOGLE_SHEETS_PARTICIPACION_DETALLES_CSV, ['tipo', 'titulo']); }
