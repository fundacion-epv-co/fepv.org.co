import Papa from 'papaparse';

// La URL de Google Sheets CSV que proporcionó el usuario para Convocatorias
export const GOOGLE_SHEETS_CONVOCATORIAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?output=csv";

// La URL de Google Sheets CSV para Noticias
export const GOOGLE_SHEETS_NOTICIAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTnMac_hmLRlOwjtyZL7Ji4q1mDw5g_wO_vQ-UKdgvAu2OYQOX9vr1jzP1_Se1AdtZcCOoym7RM5tI9/pub?gid=1545003802&single=true&output=csv";

// La URL de Google Sheets CSV para Métricas de Impacto
export const GOOGLE_SHEETS_METRICAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=881055830&single=true&output=csv";

// La URL de Google Sheets CSV para Intranet (Formatos - Lectura)
export const GOOGLE_SHEETS_INTRANET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=183119704&single=true&output=csv";

// API REST de Google Apps Script para Intranet (Multi-Usuario y Cargas)
export const GOOGLE_APPS_SCRIPT_INTRANET_URL = "https://script.google.com/macros/s/AKfycbyhwUnj41JhtS07NHdVwZmvMhDpRFULVtI3mBAFEqegA97CMj1DYFzps_YsIk0r9y7n9w/exec";

// La URL de Google Sheets CSV para el Carrusel/Banner Principal
export const GOOGLE_SHEETS_BANNER_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?gid=1671239233&single=true&output=csv";

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
    // Detectar patrón /file/d/ID/view
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
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
