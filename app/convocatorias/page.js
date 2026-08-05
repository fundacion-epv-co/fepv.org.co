"use client";

import { useState } from "react";

// Convocatorias estÃ¡ticas embebidas (sin necesidad de API)
const CONVOCATORIAS_ESTATICAS = [
  {
    id: "CONV-001",
    title: "Curso de Primeros Auxilios PsicolÃ³gicos â€” Nivel BÃ¡sico",
    category: "cursos",
    status: "ABIERTA",
    location: "AgustÃ­n Codazzi, Cesar",
    deadline: "2026-09-30",
    target: "LÃ­deres comunitarios, docentes y cuidadores",
    desc: "FormaciÃ³n certificada en tÃ©cnicas de apoyo emocional de primera respuesta. Aprende a acompaÃ±ar a personas en crisis, duelos y situaciones de emergencia psicosocial. Avalado por FEPV con intensidad de 40 horas.",
    requirements: [
      "Mayor de 18 aÃ±os",
      "InterÃ©s en salud comunitaria",
      "Disponibilidad de 2 dÃ­as por semana"
    ],
    documents: [
      "Copia de documento de identidad",
      "Foto tipo documento",
      "Carta de motivaciÃ³n (opcional)"
    ],
    schedule: "SÃ¡bados y domingos, 8:00 a.m. â€“ 12:00 m."
  },
  {
    id: "CONV-002",
    title: "Voluntariado Ambiental â€” Jornada de Siembra y Limpieza",
    category: "voluntariado",
    status: "ABIERTA",
    location: "Zona rural, Codazzi â€“ Cesar",
    deadline: "2026-08-25",
    target: "Toda la comunidad, estudiantes y familias",
    desc: "Jornada comunitaria de reforestaciÃ³n y limpieza de fuentes hÃ­dricas en cuencas del municipio. Actividad libre, sin costo y familiar. Transporte desde el casco urbano disponible para grupos mayores de 10 personas.",
    requirements: [
      "InscripciÃ³n previa obligatoria",
      "Ropa cÃ³moda y botas",
      "DisposiciÃ³n de compartir"
    ],
    documents: [
      "Nombre completo",
      "NÃºmero de contacto"
    ],
    schedule: "Domingo 25 de agosto, 7:00 a.m. â€“ 1:00 p.m."
  },
  {
    id: "CONV-003",
    title: "Programa de Apoyo Psicosocial PAPSIVI â€” Nuevo Proceso",
    category: "cursos",
    status: "ABIERTA",
    location: "AgustÃ­n Codazzi, Cesar",
    deadline: "2026-10-15",
    target: "VÃ­ctimas del conflicto armado registradas en el RUV",
    desc: "Proceso de atenciÃ³n psicosocial individual y grupal para personas vÃ­ctimas del conflicto armado, en marco del Programa de AtenciÃ³n Psicosocial y Salud Integral a VÃ­ctimas (PAPSIVI). Confidencial y gratuito.",
    requirements: [
      "Estar registrado en el RUV (Registro Ãšnico de VÃ­ctimas)",
      "Residir en AgustÃ­n Codazzi o municipios aledaÃ±os",
      "Voluntariedad de participaciÃ³n"
    ],
    documents: [
      "Documento de identidad",
      "Constancia del RUV (si aplica)",
      "Formulario de inscripciÃ³n"
    ],
    schedule: "Lunes a viernes, previa cita. Horario flexible."
  },
  {
    id: "CONV-004",
    title: "Convocatoria de Emprendimiento Social â€” Cohorte II",
    category: "becas",
    status: "ABIERTA",
    location: "AgustÃ­n Codazzi, Cesar (presencial + virtual)",
    deadline: "2026-09-10",
    target: "JÃ³venes entre 18 y 35 aÃ±os con idea de negocio",
    desc: "Programa intensivo de 8 semanas para el desarrollo de habilidades empresariales, diseÃ±o de modelo de negocio, acceso a financiaciÃ³n y mentorÃ­a individual. Cupos limitados a 25 participantes por cohorte.",
    requirements: [
      "JÃ³venes entre 18 y 35 aÃ±os",
      "Tener una idea de negocio (no necesita estar formalizada)",
      "Comprometerse con el 80% de asistencia"
    ],
    documents: [
      "Copia de cÃ©dula de ciudadanÃ­a",
      "Resumen ejecutivo de la idea (mÃ¡x. 1 pÃ¡gina)",
      "Carta de motivaciÃ³n"
    ],
    schedule: "Martes y jueves, 6:00 p.m. â€“ 8:00 p.m."
  }
];

export default function Convocatorias() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    documento: "",
    motivo: "",
    aceptaDatos: false
  });
  const [successMessage, setSuccessMessage] = useState(false);

  const categories = [
    { id: "all", name: "Todas" },
    { id: "cursos", name: "Cursos" },
    { id: "becas", name: "Becas / Emprendimiento" },
    { id: "voluntariado", name: "Voluntariado" }
  ];

  const filteredConvocatorias = filterCategory === "all"
    ? CONVOCATORIAS_ESTATICAS
    : CONVOCATORIAS_ESTATICAS.filter(c => c.category === filterCategory);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!formData.aceptaDatos) {
      alert("Debes aceptar la polÃ­tica de tratamiento de datos personales para continuar.");
      return;
    }

    // Para GitHub Pages (estÃ¡tico): enviar por WhatsApp
    const mensaje = encodeURIComponent(
      `*INSCRIPCIÃ“N FEPV â€” ${selectedConvocatoria.title}*\n\n` +
      `ðŸ‘¤ *Nombre:* ${formData.nombre}\n` +
      `ðŸªª *Documento:* ${formData.documento}\n` +
      `ðŸ“§ *Correo:* ${formData.correo}\n` +
      `ðŸ“ž *TelÃ©fono:* ${formData.telefono}\n\n` +
      `ðŸ’¬ *MotivaciÃ³n:* ${formData.motivo}\n\n` +
      `_CÃ³digo convocatoria: ${selectedConvocatoria.id}_\n` +
      `_Acepta tratamiento de datos: SÃ­ (Ley 1581/2012)_`
    );

    window.open(`https://wa.me/573000000000?text=${mensaje}`, "_blank");

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setSelectedConvocatoria(null);
      setFormData({ nombre: "", correo: "", telefono: "", documento: "", motivo: "", aceptaDatos: false });
    }, 4000);
  };

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-5xl">
            Convocatorias y Oportunidades
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Participa en nuestros procesos. InscrÃ­bete en los cursos, postÃºlate a las vacantes, voluntariados y becas locales de FEPV.
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
                    ? "bg-fepv-green text-white border-fepv-green shadow-sm"
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
        {filteredConvocatorias.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-md mx-auto space-y-4">
            <span className="text-5xl block">ðŸ“¢</span>
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">No hay convocatorias activas</h3>
            <p className="text-xs text-fepv-gray/70">
              No se encontraron oportunidades en esta categorÃ­a en este momento.
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        c.category === "cursos" ? "bg-green-100 text-fepv-darkblue" :
                        c.category === "voluntariado" ? "bg-blue-100 text-fepv-blue" :
                        c.category === "becas" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {c.category}
                      </span>
                      <span className="text-[10px] text-fepv-gray/50">CÃ³digo: {c.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isOpen ? "bg-fepv-light/60 text-fepv-green" : "bg-red-50 text-red-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-fepv-green animate-pulse" : "bg-red-600"}`}></span>
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-fepv-darkblue leading-snug">
                      {c.title}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs text-fepv-gray/80">
                      <p>ðŸ“ <strong>Municipio:</strong> {c.location}</p>
                      <p>ðŸ“… <strong>Cierre:</strong> {new Date(c.deadline).toLocaleDateString("es-CO")}</p>
                      <p className="col-span-2 md:col-span-1">ðŸ‘¥ <strong>Dirigido a:</strong> {c.target}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => isOpen && setSelectedConvocatoria(c)}
                      disabled={!isOpen}
                      className={`fepv-btn text-xs py-3 px-6 w-full md:w-auto text-center cursor-pointer ${
                        isOpen ? "fepv-btn-primary" : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      VER CONVOCATORIA
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL DETALLE / INSCRIPCIÃ“N */}
      {selectedConvocatoria && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative border border-gray-150">
            
            {/* Cerrar */}
            <button
              onClick={() => setSelectedConvocatoria(null)}
              className="absolute top-4 right-4 text-fepv-gray/60 hover:text-fepv-darkblue cursor-pointer p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {/* Encabezado */}
            <div className="space-y-2 pr-8">
              <span className="text-[10px] font-bold text-fepv-green bg-fepv-light/60 px-2 py-0.5 rounded">
                CÃ³digo: {selectedConvocatoria.id}
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-fepv-darkblue leading-snug">
                {selectedConvocatoria.title}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fepv-gray/70">
                <p>ðŸ“ <strong>Lugar:</strong> {selectedConvocatoria.location}</p>
                <p>ðŸ“… <strong>Cierre:</strong> {new Date(selectedConvocatoria.deadline).toLocaleDateString("es-CO")}</p>
              </div>
            </div>

            {/* Detalles */}
            <div className="space-y-4 border-t border-b border-gray-100 py-4 text-xs sm:text-sm text-fepv-gray/90">
              <div>
                <h4 className="font-bold text-fepv-darkblue mb-1">DescripciÃ³n de la oportunidad:</h4>
                <p className="leading-relaxed text-xs">{selectedConvocatoria.desc}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-fepv-darkblue mb-1.5">Requisitos obligatorios:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedConvocatoria.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-fepv-darkblue mb-1.5">Documentos requeridos:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedConvocatoria.documents.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>
              <div>
                <p>â° <strong>Horarios:</strong> {selectedConvocatoria.schedule}</p>
              </div>
            </div>

            {/* Formulario de InscripciÃ³n */}
            {selectedConvocatoria.status === "ABIERTA" && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-base text-fepv-darkblue">
                  Formulario de InscripciÃ³n
                </h3>

                {successMessage ? (
                  <div className="p-4 bg-fepv-light/60 border border-fepv-green/20 rounded-2xl text-center space-y-2">
                    <span className="text-3xl block">ðŸŽ‰</span>
                    <h4 className="font-display font-bold text-sm text-fepv-darkblue">Â¡InscripciÃ³n Enviada por WhatsApp!</h4>
                    <p className="text-[11px] text-fepv-gray/80">
                      Se abriÃ³ WhatsApp con tu informaciÃ³n pre-llenada. EnvÃ­a el mensaje para confirmar tu inscripciÃ³n. Â¡Gracias por participar!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-3 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Nombre Completo *</label>
                        <input type="text" required name="nombre" value={formData.nombre} onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                          placeholder="Ej. Juan PÃ©rez" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Documento de Identidad *</label>
                        <input type="text" required name="documento" value={formData.documento} onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                          placeholder="C.C. o T.I." />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">Correo ElectrÃ³nico *</label>
                        <input type="email" required name="correo" value={formData.correo} onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                          placeholder="juan@ejemplo.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-fepv-darkblue mb-1">WhatsApp de contacto *</label>
                        <input type="tel" required name="telefono" value={formData.telefono} onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                          placeholder="300 000 0000" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-fepv-darkblue mb-1">Â¿Por quÃ© deseas participar? *</label>
                      <textarea required name="motivo" rows="2" value={formData.motivo} onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green resize-none text-xs"
                        placeholder="Describe brevemente tus motivos de postulaciÃ³n..." />
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input type="checkbox" required id="aceptaDatos" name="aceptaDatos" checked={formData.aceptaDatos}
                        onChange={handleInputChange} className="mt-0.5 cursor-pointer w-4 h-4 text-fepv-green" />
                      <label htmlFor="aceptaDatos" className="text-[10px] text-fepv-gray/80 leading-snug cursor-pointer select-none">
                        Autorizo el tratamiento de mis datos personales para fines de registro y contacto de FEPV, conforme a la Ley 1581 de 2012 de Colombia.
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                      <button type="submit" className="fepv-btn fepv-btn-primary w-full sm:w-auto text-xs py-3 px-8 cursor-pointer">
                        ðŸ“² ENVIAR POR WHATSAPP
                      </button>
                      <button type="button" onClick={() => setSelectedConvocatoria(null)}
                        className="fepv-btn fepv-btn-secondary w-full sm:w-auto text-xs py-3 px-8 cursor-pointer">
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
