"use client";

import { useState, useEffect } from "react";
import { fetchGoogleSheetData, GOOGLE_SHEETS_INTRANET_CSV } from "../../lib/api";

export default function Intranet() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [documentos, setDocumentos] = useState([]);

  // Simulamos que ya está conectado a una base si la URL está pendiente
  const isPending = GOOGLE_SHEETS_INTRANET_CSV === "PENDIENTE_DE_URL_INTRANET";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isPending) {
      // Modo desarrollo / sin conectar
      if (password === "adminfepv") { // Contraseña provisional mientras conectan
        setIsAuthenticated(true);
        setDocumentos([]);
      } else {
        setError("Contraseña incorrecta (Usa 'adminfepv' por ahora)");
      }
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchGoogleSheetData(GOOGLE_SHEETS_INTRANET_CSV);
      
      // Verificamos la contraseña en la primera fila, columna "clave_acceso"
      const claveReal = data.length > 0 ? data[0].clave_acceso : null;

      if (!claveReal) {
        setError("Error: La base de datos no tiene una contraseña configurada.");
        setIsLoading(false);
        return;
      }

      if (password === claveReal.toString()) {
        setIsAuthenticated(true);
        // Filtramos las filas que sí tienen un título para no mostrar celdas vacías
        const docsValidos = data.filter(item => item.titulo && item.titulo.trim() !== "");
        setDocumentos(docsValidos);
      } else {
        setError("Contraseña incorrecta.");
      }
    } catch (err) {
      setError("No se pudo conectar con la base de datos.");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setDocumentos([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 flex flex-col items-center">
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
        
        {!isAuthenticated ? (
          /* PANTALLA DE LOGIN */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100 mt-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-fepv-light/50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🔒
              </div>
              <h1 className="font-display font-bold text-2xl text-fepv-darkblue">Acceso Intranet</h1>
              <p className="text-sm text-fepv-gray/70 mt-2">
                Portal exclusivo para miembros y colaboradores de FEPV.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-fepv-darkblue mb-2 uppercase tracking-wider">
                  Contraseña Maestra
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green bg-gray-50 focus:bg-white text-sm"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs text-center border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-fepv-darkblue hover:bg-blue-900 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "INGRESAR AL PORTAL"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* PANTALLA DE INTRANET (AUTENTICADO) */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Intranet */}
            <div className="bg-fepv-darkblue rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-fepv-green mb-1 block">Espacio Privado</span>
                <h1 className="font-display font-bold text-3xl">Formatos Institucionales</h1>
                <p className="text-sm text-white/70 mt-2 max-w-lg">
                  Descarga las plantillas, formularios y documentos internos necesarios para la gestión operativa y técnica de la fundación.
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-red-500 hover:text-white transition-colors text-sm font-semibold flex items-center gap-2 border border-white/20 hover:border-red-500 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Cerrar Sesión
              </button>
            </div>

            {/* Listado de Documentos */}
            {isPending ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-2xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🚧</span>
                  <div>
                    <h3 className="font-bold text-yellow-800">Conexión Pendiente</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Debes proveer el enlace del Google Sheet de la Intranet para poder visualizar los formatos.
                    </p>
                  </div>
                </div>
              </div>
            ) : documentos.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <span className="text-5xl block mb-4">🗂️</span>
                <h3 className="font-display font-bold text-xl text-fepv-darkblue">No hay formatos cargados</h3>
                <p className="text-sm text-fepv-gray/70 mt-2">Aún no se han añadido documentos en la base de datos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentos.map((doc, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-fepv-light/50 text-fepv-green px-2.5 py-1 rounded">
                        {doc.tipo || "Documento"}
                      </span>
                      <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">📄</span>
                    </div>
                    
                    <h3 className="font-display font-bold text-base text-fepv-darkblue mb-4 flex-grow">
                      {doc.titulo || "Documento sin título"}
                    </h3>
                    
                    <a 
                      href={doc.enlace_drive} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-gray-50 hover:bg-fepv-vividgreen hover:text-white text-fepv-darkblue font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200 hover:border-fepv-vividgreen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Descargar Formato
                    </a>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
