"use client";

import { useState, useEffect } from "react";
import { fetchGoogleSheetData, GOOGLE_SHEETS_NOTICIAS_CSV } from "../../lib/api";

// Helper para convertir el enlace de Drive normal a un enlace de imagen directa
const getDirectDriveImageUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url; // Si no es un enlace de Drive, lo devuelve igual (ej. un enlace directo)
};

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNoticia, setSelectedNoticia] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (GOOGLE_SHEETS_NOTICIAS_CSV === "PENDIENTE_DE_URL") {
        setNoticias([]);
        setIsLoading(false);
        return;
      }

      const data = await fetchGoogleSheetData(GOOGLE_SHEETS_NOTICIAS_CSV);
      // Mapear los datos del CSV (id, fecha, categoria, titulo, resumen, autor, contenido, enlace_imagen_drive)
      const mapped = data.map((item, index) => ({
        id: item.id || `NOT-${index + 1}`,
        title: item.titulo || 'Sin título',
        date: item.fecha || '',
        category: item.categoria || 'General',
        summary: item.resumen || '',
        author: item.autor || '',
        content: item.contenido || '',
        image: getDirectDriveImageUrl(item.enlace_imagen_drive || item.enlace_foto) || null
      }));
      setNoticias(mapped.reverse()); // Reverse para mostrar las más recientes primero
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="w-full bg-gray-50 pb-20 min-h-screen">
      
      {/* Banner Superior */}
      <section className="bg-fepv-darkblue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-5xl">
            Noticias y Novedades
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Mantente informado sobre nuestros proyectos, intervenciones y el impacto que estamos generando en las comunidades.
          </p>
        </div>
      </section>

      {/* Lista de Noticias */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-fepv-light border-t-fepv-vividgreen rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-fepv-darkblue">Cargando noticias...</p>
          </div>
        ) : GOOGLE_SHEETS_NOTICIAS_CSV === "PENDIENTE_DE_URL" ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 max-w-2xl mx-auto space-y-4">
            <span className="text-5xl block">🚧</span>
            <h3 className="font-display font-bold text-xl text-fepv-darkblue">Sección en Construcción</h3>
            <p className="text-sm text-fepv-gray/70">
              Estamos conectando esta sección con nuestra base de datos. ¡Muy pronto podrás ver todas nuestras noticias aquí!
            </p>
          </div>
        ) : noticias.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 max-w-md mx-auto space-y-4">
            <span className="text-5xl block">📰</span>
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">No hay noticias publicadas</h3>
            <p className="text-xs text-fepv-gray/70">
              Pronto publicaremos novedades. ¡Vuelve más tarde!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full group"
                onClick={() => setSelectedNoticia(n)}
              >
                {/* Imagen */}
                <div className="h-48 w-full bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {n.image ? (
                    <img 
                      src={n.image} 
                      alt={n.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-4xl text-gray-300">
                      📸
                    </div>
                  )}
                </div>
                
                {/* Contenido Card */}
                <div className="p-6 flex flex-col flex-grow text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-fepv-green bg-fepv-light px-2 py-0.5 rounded">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-fepv-gray/60 font-semibold">
                      {n.date}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-bold text-base sm:text-lg text-fepv-darkblue leading-snug mb-2 group-hover:text-fepv-green transition-colors">
                    {n.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-fepv-gray/80 line-clamp-3 mb-4 flex-grow">
                    {n.summary || n.content}
                  </p>
                  
                  <span className="text-xs font-bold text-fepv-orange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Leer más <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL LECTURA NOTICIA */}
      {selectedNoticia && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Cerrar */}
            <button
              onClick={() => setSelectedNoticia(null)}
              className="absolute top-4 right-4 z-10 bg-black/40 text-white hover:bg-black/60 cursor-pointer p-2 rounded-full transition-colors backdrop-blur-md"
              aria-label="Cerrar modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div className="overflow-y-auto">
              {/* Imagen Portada */}
              {selectedNoticia.image && (
                <div className="w-full h-64 sm:h-80 relative bg-gray-100">
                  <img 
                    src={selectedNoticia.image} 
                    alt={selectedNoticia.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Contenido Artículo */}
              <div className="p-6 sm:p-10 space-y-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-fepv-green px-2.5 py-1 rounded">
                      {selectedNoticia.category}
                    </span>
                    <span className="text-xs text-fepv-gray/70 font-semibold">
                      {selectedNoticia.date}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-4xl text-fepv-darkblue leading-tight">
                    {selectedNoticia.title}
                  </h2>
                  {selectedNoticia.author && (
                    <p className="text-xs text-fepv-gray/60 font-semibold">
                      Redactado por: <span className="text-fepv-darkblue">{selectedNoticia.author}</span>
                    </p>
                  )}
                </div>
                
                <div className="w-12 h-1 bg-fepv-orange rounded-full"></div>

                <div className="text-sm sm:text-base text-fepv-gray/90 leading-relaxed space-y-4 whitespace-pre-wrap">
                  {selectedNoticia.content}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
