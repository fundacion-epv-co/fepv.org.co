"use client";

import { fetchGoogleSheetData, GOOGLE_SHEETS_FAQ_CSV } from "../../lib/api";
import { useGlobalConfig } from "../../components/ConfigContext";

const MOCK_FAQS = [
  {
    id: "FAQ-1",
    pregunta: "¿Cómo puedo participar en las convocatorias o cursos?",
    respuesta: "Puedes postularte ingresando a nuestra sección de Oportunidades, eligiendo la convocatoria de tu interés y completando el formulario de inscripción digital. Si requieres ayuda técnica, puedes comunicarte por WhatsApp."
  },
  {
    id: "FAQ-2",
    pregunta: "¿Mis donaciones son seguras y destinadas a los programas?",
    respuesta: "Sí. La FEPV es una entidad sin ánimo de lucro registrada ante Cámara de Comercio. Emitimos certificados de donación oficiales y publicamos estados financieros anualmente por transparencia institucional."
  },
  {
    id: "FAQ-3",
    pregunta: "¿Dónde opera principalmente la fundación?",
    respuesta: "Nuestra sede principal física y centro operativo se encuentra en Agustín Codazzi (Cesar), realizando brigadas y talleres presenciales en las comunas y áreas rurales aledañas, con cobertura virtual nacional."
  }
];

import { useState, useEffect } from "react";

export default function Contacto() {
  const config = useGlobalConfig();
  const foundationName = config?.nombre_fundacion || "Fundación Encuentros Para la Vida";
  const contactPhone = config?.telefono_contacto || "+57 316 689 9250";
  const contactEmail = config?.correo_contacto || "fundacion.epv.co@gmail.com";
  const address = config?.direccion_fisica || "Agustín Codazzi, Cesar, Colombia";
  const whatsappUrl = config?.enlace_whatsapp || "https://wa.me/573166899250";
  const facebookUrl = config?.enlace_facebook || "https://facebook.com/fundacion.epv.co";
  const instagramUrl = config?.enlace_instagram || "https://instagram.com/fundacion.epv.co";

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    tipoSolicitud: "peticion",
    mensaje: "",
    aceptaDatos: false
  });

  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Consulta de PQRS
  const [consultaRadicado, setConsultaRadicado] = useState("");
  const [consultaResultado, setConsultaResultado] = useState(null);
  const [consultaLoading, setConsultaLoading] = useState(false);
  const [consultaError, setConsultaError] = useState("");

  const handleConsultar = async (e) => {
    e.preventDefault();
    if (!consultaRadicado.trim()) return;
    setConsultaLoading(true);
    setConsultaError("");
    setConsultaResultado(null);
    try {
      const { GOOGLE_APPS_SCRIPT_INTRANET_URL } = await import('../../lib/api');
      const response = await fetch(GOOGLE_APPS_SCRIPT_INTRANET_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "consultarPQRS", radicado: consultaRadicado.trim() })
      });
      const data = await response.json();
      if (data.success) {
        setConsultaResultado(data.pqrs);
      } else {
        setConsultaError(data.message);
      }
    } catch (err) {
      setConsultaError("Error de conexión al consultar el radicado.");
    } finally {
      setConsultaLoading(false);
    }
  };

  // Estados de Preguntas Frecuentes
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    async function loadFaqs() {
      setIsLoadingFaqs(true);
      try {
        const data = await fetchGoogleSheetData(GOOGLE_SHEETS_FAQ_CSV);
        if (data && data.length > 0) {
          const sorted = data.map(item => ({
            id: item.id || `FAQ-${Math.random()}`,
            pregunta: item.pregunta || "",
            respuesta: item.respuesta || "",
            orden: parseInt(item.orden, 10) || 99
          })).sort((a, b) => a.orden - b.orden);
          setFaqs(sorted);
        } else {
          setFaqs(MOCK_FAQS);
        }
      } catch (e) {
        console.error("Error cargando FAQs", e);
        setFaqs(MOCK_FAQS);
      }
      setIsLoadingFaqs(false);
    }
    loadFaqs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.aceptaDatos) {
      alert("Debes aceptar la política de tratamiento de datos personales para enviar tu mensaje.");
      return;
    }

    setSubmitting(true);

    try {
      const { GOOGLE_APPS_SCRIPT_INTRANET_URL } = await import('../../lib/api');
      const response = await fetch(GOOGLE_APPS_SCRIPT_INTRANET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          tipo: formData.tipoSolicitud,
          nombre: formData.nombre,
          correo: formData.correo,
          telefono: formData.telefono,
          asunto: "Contacto desde fepv.org.co",
          mensaje: formData.mensaje,
          aceptaDatos: formData.aceptaDatos ? "SÍ" : "NO"
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.radicado || true);
      setFormData({
        nombre: "",
        correo: "",
        telefono: "",
        tipoSolicitud: "peticion",
        mensaje: "",
        aceptaDatos: false
      });
    } catch (error) {
      console.error("Error enviando el formulario:", error);
      alert("Hubo un error al enviar el mensaje. Por favor intenta más tarde o escríbenos directamente a nuestro correo.");
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }
  };

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-4.5xl">
            Contacto Institucional
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            ¿Tienes preguntas, propuestas o deseas sumarte a nuestras iniciativas? Escríbenos y nos pondremos en contacto contigo.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Info Directa (Lado Izquierdo) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-fepv-darkblue">
              {foundationName}
            </h2>
            <p className="text-sm text-fepv-gray/80 leading-relaxed">
              Estamos a tu disposición en la sede principal en el departamento del Cesar o a través de nuestros canales digitales.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-fepv-gray/90">
            <div className="flex items-start gap-4">
              <span className="text-2xl bg-fepv-light/50 p-2.5 rounded-xl flex items-center justify-center">📍</span>
              <div className="space-y-1">
                <h4 className="font-bold text-fepv-darkblue">Dirección Física</h4>
                <p>{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl bg-fepv-light/50 p-2.5 rounded-xl flex items-center justify-center">📧</span>
              <div className="space-y-1">
                <h4 className="font-bold text-fepv-darkblue">Correo Electrónico</h4>
                <p className="hover:underline">
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl bg-fepv-light/50 p-2.5 rounded-xl flex items-center justify-center">📱</span>
              <div className="space-y-1">
                <h4 className="font-bold text-fepv-darkblue">Canales de Contacto</h4>
                <p className="hover:underline">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp ({contactPhone})</a>
                </p>
                <p className="text-xs text-fepv-gray/70">
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-fepv-orange transition-colors">Instagram</a> / <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-fepv-orange transition-colors">Facebook</a>
                </p>
              </div>
            </div>
            
            {/* Consulta de Radicado */}
            <div className="mt-8 bg-fepv-green/10 border border-fepv-green/20 p-6 rounded-2xl">
              <h4 className="font-bold text-fepv-darkblue mb-3">¿Ya enviaste una PQRS?</h4>
              <p className="text-xs text-fepv-gray/80 mb-4">Consulta el estado de tu radicado aquí.</p>
              
              <form onSubmit={handleConsultar} className="space-y-3">
                <input 
                  type="text" 
                  required 
                  value={consultaRadicado} 
                  onChange={(e) => setConsultaRadicado(e.target.value)}
                  placeholder="Ej: PQRS-20260823-1" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green text-sm"
                />
                <button 
                  type="submit" 
                  disabled={consultaLoading}
                  className="w-full py-3 bg-fepv-green text-white font-bold rounded-xl hover:bg-fepv-dark transition-colors disabled:opacity-50 text-sm"
                >
                  {consultaLoading ? "Consultando..." : "Consultar Estado"}
                </button>
              </form>

              {consultaError && <p className="mt-3 text-xs text-red-500 font-medium">{consultaError}</p>}

              {consultaResultado && (
                <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-fepv-green/30 space-y-2">
                  <p className="text-xs text-fepv-gray"><strong>Estado:</strong> <span className="text-fepv-orange uppercase tracking-wide font-bold">{consultaResultado.estado}</span></p>
                  <p className="text-xs text-fepv-gray"><strong>Fecha:</strong> {new Date(consultaResultado.fecha).toLocaleDateString()}</p>
                  <p className="text-xs text-fepv-gray"><strong>Asunto:</strong> {consultaResultado.asunto}</p>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-fepv-darkblue font-bold mb-1">Respuesta oficial:</p>
                    <p className="text-xs text-fepv-gray italic leading-relaxed">{consultaResultado.respuesta}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Formulario (Lado Derecho) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-150 shadow-md">
            
            {success ? (
              <div className="p-8 bg-fepv-light/60 border border-fepv-vividgreen/20 rounded-2xl text-center space-y-3 animate-in fade-in duration-300">
                <span className="text-4xl block">✅</span>
                <h3 className="font-display font-bold text-base text-fepv-darkblue">¡Mensaje enviado con éxito!</h3>
                <p className="text-xs text-fepv-gray/80 leading-relaxed">
                  Hemos recibido tu solicitud y la hemos registrado en nuestro sistema. El equipo de la Fundación Encuentros Para la Vida se pondrá en contacto contigo muy pronto a través del correo o teléfono que nos proporcionaste.
                </p>
                {typeof success === "string" && success !== "true" && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Tu número de radicado para seguimiento es:</p>
                    <p className="font-bold text-fepv-darkblue text-lg tracking-wider">{success}</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                      placeholder="Ej. Ana María Castro"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                      placeholder="ana@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Número de Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                      placeholder="Ej. 300 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Tipo de Solicitud *</label>
                    <select
                      name="tipoSolicitud"
                      value={formData.tipoSolicitud}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green bg-white text-xs sm:text-sm"
                    >
                      <option value="peticion">Petición</option>
                      <option value="queja">Queja</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                      <option value="felicitacion">Felicitación</option>
                      <option value="voluntariado">Voluntariado</option>
                      <option value="alianza_donacion">Alianzas y Donaciones</option>
                      <option value="informacion">Información General</option>
                      <option value="otra">Otra Solicitud</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Mensaje *</label>
                  <textarea
                    required
                    name="mensaje"
                    rows="4"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green resize-none text-xs"
                    placeholder="Escribe aquí tu mensaje en detalle..."
                  />
                </div>

                {/* Casilla Ley 1581 */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    required
                    id="aceptaDatos"
                    name="aceptaDatos"
                    checked={formData.aceptaDatos}
                    onChange={handleInputChange}
                    className="mt-0.5 cursor-pointer w-4 h-4 text-fepv-green"
                  />
                  <label htmlFor="aceptaDatos" className="text-[10px] sm:text-xs text-fepv-gray/80 leading-normal cursor-pointer select-none">
                    Autorizo el tratamiento de mis datos personales para fines de registro, verificación y contacto de FEPV, de conformidad con la Ley 1581 de 2012 de Colombia.
                  </label>
                </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-bold text-white transition-colors bg-fepv-vividgreen hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {submitting ? "Enviando mensaje..." : "✉️ ENVIAR MENSAJE A FEPV"}
                  </button>
              </form>
            )}

          </div>
        </div>

      </section>

      {/* Preguntas Frecuentes Accordion Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-150">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-fepv-darkblue">
              Preguntas Frecuentes
            </h2>
            <p className="text-xs sm:text-sm text-fepv-gray/70">
              Resuelve tus dudas más comunes de forma inmediata sobre el funcionamiento de la fundación.
            </p>
          </div>

          {isLoadingFaqs ? (
            <div className="flex flex-col justify-center items-center py-10 space-y-3">
              <div className="w-8 h-8 border-3 border-fepv-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-fepv-gray/70">Cargando preguntas frecuentes...</p>
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-center text-xs text-fepv-gray/50">No hay preguntas publicadas actualmente.</p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={faq.id} 
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none hover:bg-gray-50/50"
                    >
                      <span className="font-display font-bold text-xs sm:text-sm text-fepv-darkblue">
                        {faq.pregunta}
                      </span>
                      <span className={`text-fepv-green font-bold text-lg transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                        ＋
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-fepv-gray/85 leading-relaxed border-t border-gray-50 animate-in fade-in duration-300">
                        {faq.respuesta}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
