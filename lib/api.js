import Papa from 'papaparse';

// La URL de Google Sheets CSV que proporcionó el usuario
export const GOOGLE_SHEETS_CONVOCATORIAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub?output=csv";

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
