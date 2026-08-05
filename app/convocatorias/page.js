"use client";

import { useState, useEffect } from "react";
import { fetchGoogleSheetData, GOOGLE_SHEETS_CONVOCATORIAS_CSV } from "../../lib/api";

const categories = [
  { id: "all", name: "Todas" },
  { id: "cursos", name: "Cursos" },
  { id: "voluntariado", name: "Voluntariado" },
  { id: "becas", name: "Becas & Apoyos" },
  { id: "general", name: "General" }
];

export default function Convocatorias() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [convocatorias, setConvocatorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    documento: "",
    motivo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await fetchGoogleSheetData(GOOGLE_SHEETS_CONVOCATORIAS_CSV);
      // Mapear los datos del CSV (id, titulo, descripcion, fecha_cierre, enlace_drive, estado)
      const mapped = data.map((item, index) => ({
        id: item.id || `CONV-${index + 1}`,
        title: item.titulo || 'Sin título',
        desc: item.descripcion || '',
        deadline: item.fecha_cierre || '',
        status: (item.estado || 'CERRADA').toUpperCase(),
        category: 'general', // Por defecto, o se podría añadir una columna categoría en el futuro
        location: "Sede FEPV / Virtual", // Por defecto
        enlace_drive: item.enlace_drive || null
      }));
      setConvocatorias(mapped);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredConvocatorias = convocatorias.filter((c) =>
    filterCategory === "all" ? true : c.category === filterCategory
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMessage(true);

      const mensaje = `Hola Fundación FEPV, quiero inscribirme en la convocatoria:
Código: ${selectedConvocatoria.id}
Título: ${selectedConvocatoria.title}

Mis datos:
- Nombre: ${formData.nombre}
- Documento: ${formData.documento}
- Correo: ${formData.correo}
- WhatsApp: ${formData.telefono}
- Motivo: ${formData.motivo}`;

      window.open(`https://wa.me/573166899250?text=${encodeURIComponent(mensaje)}`, "_blank");
      
      setTimeout(() => {
        setSuccessMessage(false);
        setSelectedConvocatoria(null);
        setFormData({ nombre: "", correo: "", telefono: "", documento: "", motivo: "" });
      }, 4000);
    }, 1500);
  };

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-darkblue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-5xl">
            Convocatorias y Oportunidades
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Participa en nuestros procesos. Inscríbete en los cursos, postúlate a las vacantes, voluntariados y becas locales de FEPV.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                  filterCategory === cat.id
                    ? "bg-fepv-vividgreen text-white border-fepv-vividgreen shadow-sm"
                    : "bg-white text-fepv-gray hover:bg-gray-50 border-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <span className="text-xs text-fepv-gray/70">
            Mostrando <strong>{filteredConvocatorias.length}</strong> oportunidades
          </span>
        </div>
      </section>

      {/* Lista de Convocatorias */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-fepv-light border-t-fepv-vividgreen rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-fepv-darkblue">Cargando datos desde el sistema...</p>
          </div>
        ) : filteredConvocatorias.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-md mx-auto space-y-4">
            <span className="text-5xl block">📢</span>
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">No hay convocatorias activas</h3>
            <p className="text-xs text-fepv-gray/70">
              No se encontraron oportunidades en esta categoría en este momento.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredConvocatorias.map((c) => {
              const isOpen = c.status === "ABIERTA";
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-fepv-gray">
                        {c.category}
                      </span>
                      <span className="text-[10px] text-fepv-gray/50">Código: {c.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isOpen ? "bg-fepv-light/60 text-fepv-vividgreen" : "bg-red-50 text-red-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-fepv-vividgreen animate-pulse" : "bg-red-600"}`}></span>
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-fepv-darkblue leading-snug">
                      {c.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-fepv-gray/80">
                      <p>📍 <strong>Lugar:</strong> {c.location}</p>
                      <p>📅 <strong>Cierre:</strong> {c.deadline}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setSelectedConvocatoria(c)}
                      className="fepv-btn text-xs py-3 px-6 w-full md:w-auto text-center cursor-pointer bg-fepv-orange text-white hover:bg-orange-600 transition-colors rounded-xl"
                    >
                      VER DETALLES
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL DETALLE / INSCRIPCIÓN */}
      {selectedConvocatoria && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative border border-gray-150">
            
            <button
              onClick={() => setSelectedConvocatoria(null)}
              className="absolute top-4 right-4 text-fepv-gray/60 hover:text-fepv-darkblue cursor-pointer p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div className="space-y-2 pr-8">
              <span className="text-[10px] font-bold text-fepv-vividgreen bg-fepv-light/60 px-2 py-0.5 rounded">
                Código: {selectedConvocatoria.id}
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-fepv-darkblue leading-snug">
                {selectedConvocatoria.title}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fepv-gray/70">
                <p>📍 <strong>Lugar:</strong> {selectedConvocatoria.location}</p>
                <p>📅 <strong>Cierre:</strong> {selectedConvocatoria.deadline}</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-b border-gray-100 py-4 text-xs sm:text-sm text-fepv-gray/90">
              <div>
                <h4 className="font-bold text-fepv-darkblue mb-1">Descripción de la oportunidad:</h4>
                <p className="leading-relaxed text-xs">{selectedConvocatoria.desc}</p>
              </div>
              
              {selectedConvocatoria.enlace_drive && (
                <div className="mt-4">
                  <a 
                    href={selectedConvocatoria.enlace_drive} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                    </svg>
                    Descargar / Ver Documento Adjunto
                  </a>
                </div>
              )}
            </div>

            {selectedConvocatoria.status === "ABIERTA" ? (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-base text-fepv-darkblue">
                  Formulario de Inscripción
                </h3>

                {successMessage ? (
                  <div className="p-4 bg-fepv-light/60 border border-fepv-vividgreen/20 rounded-2xl text-center space-y-2">
                    <span className="text-3xl block">🎉</span>
                    <h4 className="font-display font-bold text-sm text-fepv-darkblue">¡Inscripción Enviada por WhatsApp!</h4>
                    <p className="text-[11px] text-fepv-gray/80">
                      Se abrió WhatsApp con tu información pre-llenada. Envía el mensaje para confirmar tu inscripción.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-3 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Nombre Completo *</label>
                        <input type="text" required name="nombre" value={formData.nombre} onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-vividgreen"
                          placeholder="Ej. Juan Pérez" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Documento de Identidad *</label>
                        <input type="text" required name="documento" value={formData.documento} onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-vividgreen"
                          placeholder="C.C. o T.I." />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Correo Electrónico *</label>
                        <input type="email" required name="correo" value={formData.correo} onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-vividgreen"
                          placeholder="juan@ejemplo.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">WhatsApp de contacto *</label>
                        <input type="tel" required name="telefono" value={formData.telefono} onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-vividgreen"
                          placeholder="Ej. 300 123 4567" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-fepv-darkblue mb-1">Motivo de postulación *</label>
                      <textarea required name="motivo" value={formData.motivo} onChange={handleInputChange} rows="3"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-vividgreen resize-none"
                        placeholder="Cuéntanos brevemente por qué te interesa participar..."></textarea>
                    </div>

                    <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl font-bold text-white transition-colors bg-fepv-vividgreen hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2">
                      {submitting ? "Abriendo WhatsApp..." : "💬 ENVIAR POR WHATSAPP"}
                    </button>
                    <p className="text-[10px] text-center text-fepv-gray/50">
                      Tus datos están seguros y serán tratados según nuestra Política de Privacidad.
                    </p>
                  </form>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-2">
                <span className="text-3xl block">⏳</span>
                <h4 className="font-display font-bold text-sm text-fepv-darkblue">Esta convocatoria ya cerró</h4>
                <p className="text-[11px] text-fepv-gray/80">
                  El periodo de inscripción para esta oportunidad ha finalizado. Te invitamos a estar atento a nuestras próximas convocatorias en las redes sociales de FEPV.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
