"use client";

import { useState, useEffect } from "react";
import { fetchGoogleSheetData, GOOGLE_SHEETS_GALERIA_CSV, getDirectDriveImageUrl } from "../../lib/api";

// Fotos de prueba iniciales si la hoja de cálculo no tiene datos
const MOCK_PHOTOS = [
  {
    id: "MOCK-1",
    title: "Apoyo Psicosocial a Niños",
    desc: "Talleres lúdicos y de expresión emocional orientados al fortalecimiento de la salud mental en la infancia.",
    imagen: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
    categoria: "Salud Mental",
    lugar: "Agustín Codazzi, Cesar"
  },
  {
    id: "MOCK-2",
    title: "Encuentro de Madres Comunitarias",
    desc: "Espacio de intercambio de saberes y pautas de crianza respetuosa para el bienestar familiar.",
    imagen: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    categoria: "Familia",
    lugar: "Sede Principal FEPV"
  },
  {
    id: "MOCK-3",
    title: "Jornada de Reforestación Local",
    desc: "Siembra de árboles nativos y concientización sobre el cuidado de nuestras cuencas hídricas.",
    imagen: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    categoria: "Medio Ambiente",
    lugar: "Zona Rural, Cesar"
  },
  {
    id: "MOCK-4",
    title: "Capacitación en Emprendimiento",
    desc: "Mujeres líderes se capacitan en costura y modelos de negocio sostenibles para empoderamiento económico.",
    imagen: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
    categoria: "Educación",
    lugar: "Agustín Codazzi, Cesar"
  },
  {
    id: "MOCK-5",
    title: "Campaña de Tenencia Responsable",
    desc: "Atención básica de bienestar animal y charlas comunitarias de cuidado a mascotas de la calle.",
    imagen: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    categoria: "Bienestar Animal",
    lugar: "Sede Principal FEPV"
  },
  {
    id: "MOCK-6",
    title: "Taller Creativo de Pintura",
    desc: "Niños de la comunidad plasman sus sueños de transformación y paz a través del arte y colores.",
    imagen: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    categoria: "Salud Mental",
    lugar: "Agustín Codazzi, Cesar"
  }
];

export default function GaleriaPage() {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [categories, setCategories] = useState(["Todas"]);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      if (GOOGLE_SHEETS_GALERIA_CSV === "PENDIENTE_DE_URL_GALERIA") {
        // Cargar mocks directamente
        setPhotos(MOCK_PHOTOS);
        setFilteredPhotos(MOCK_PHOTOS);
        extractCategories(MOCK_PHOTOS);
        setIsLoading(false);
        return;
      }

      try {
        const rawData = await fetchGoogleSheetData(GOOGLE_SHEETS_GALERIA_CSV);
        if (rawData && rawData.length > 0) {
          const mapped = rawData.map((item, index) => ({
            id: item.id || `IMG-${index + 1}`,
            title: item.titulo || "Sin título",
            desc: item.descripcion || "",
            imagen: getDirectDriveImageUrl(item.imagen),
            categoria: item.categoria || "General",
            lugar: item.lugar || ""
          }));
          setPhotos(mapped);
          setFilteredPhotos(mapped);
          extractCategories(mapped);
        } else {
          setPhotos(MOCK_PHOTOS);
          setFilteredPhotos(MOCK_PHOTOS);
          extractCategories(MOCK_PHOTOS);
        }
      } catch (err) {
        console.error("Error al cargar fotos de la galería", err);
        setPhotos(MOCK_PHOTOS);
        setFilteredPhotos(MOCK_PHOTOS);
        extractCategories(MOCK_PHOTOS);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const extractCategories = (items) => {
    const list = ["Todas"];
    items.forEach(photo => {
      if (photo.categoria && !list.includes(photo.categoria)) {
        list.push(photo.categoria);
      }
    });
    setCategories(list);
  };

  // Filtrar
  useEffect(() => {
    if (activeCategory === "Todas") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter(p => p.categoria === activeCategory));
    }
  }, [activeCategory, photos]);

  // Controles de teclado para el Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredPhotos]);

  const handleNext = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className="w-full bg-white pb-24">
      {/* Banner Principal */}
      <section className="bg-fepv-darkblue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-5xl">
            Nuestra Galería de Impacto
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Una mirada de fe y acción. Compartimos los registros fotográficos de nuestros encuentros, talleres comunitarios e intervenciones en el territorio.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                  activeCategory === cat
                    ? "bg-fepv-vividgreen text-white border-fepv-vividgreen shadow-sm"
                    : "bg-white text-fepv-gray hover:bg-gray-50 border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-fepv-gray/70">
            Mostrando <strong>{filteredPhotos.length}</strong> fotografías
          </span>
        </div>
      </section>

      {/* Rejilla de fotos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-fepv-green border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-fepv-gray/75">Cargando galería de impacto...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
            <span className="text-4xl block mb-2">📸</span>
            <p className="text-sm font-semibold text-fepv-gray/75">No hay imágenes cargadas en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo, idx) => (
              <div 
                key={photo.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 aspect-[4/3] flex items-center justify-center"
              >
                {/* Imagen de fondo */}
                <img 
                  src={photo.imagen} 
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Overlay oscuro y textos que aparecen al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-fepv-darkblue/90 via-fepv-darkblue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                  <span className="text-[10px] font-bold text-fepv-vividgreen uppercase tracking-wider mb-1.5">
                    {photo.categoria}
                  </span>
                  <h3 className="font-display font-bold text-base text-white leading-tight mb-1 drop-shadow-sm">
                    {photo.title}
                  </h3>
                  {photo.lugar && (
                    <p className="text-[11px] text-white/70 font-semibold flex items-center gap-1">
                      📍 {photo.lugar}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX MODAL — PANTALLA COMPLETA */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          {/* Botón de Cerrar */}
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none"
            aria-label="Cerrar visor"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          {/* Flecha Izquierda (Anterior) */}
          {filteredPhotos.length > 1 && (
            <button 
              onClick={handlePrev}
              className="absolute left-4 z-40 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer focus:outline-none"
              aria-label="Foto anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
          )}

          {/* Imagen Ampliada */}
          <div className="relative max-w-4xl w-full max-h-[75vh] flex justify-center items-center select-none animate-in zoom-in-95 duration-300">
            <img 
              src={filteredPhotos[lightboxIndex].imagen} 
              alt={filteredPhotos[lightboxIndex].title}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Flecha Derecha (Siguiente) */}
          {filteredPhotos.length > 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-4 z-40 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer focus:outline-none"
              aria-label="Siguiente foto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          )}

          {/* Información al pie */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-3xl w-full px-6 text-center text-white space-y-2">
            <span className="text-[10px] font-bold bg-fepv-vividgreen/90 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
              {filteredPhotos[lightboxIndex].categoria}
            </span>
            <h2 className="font-display font-bold text-lg sm:text-xl drop-shadow-md pt-1">
              {filteredPhotos[lightboxIndex].title}
            </h2>
            {filteredPhotos[lightboxIndex].desc && (
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
                {filteredPhotos[lightboxIndex].desc}
              </p>
            )}
            {filteredPhotos[lightboxIndex].lugar && (
              <p className="text-[11px] text-fepv-light/80 font-semibold flex items-center justify-center gap-1">
                📍 {filteredPhotos[lightboxIndex].lugar}
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
