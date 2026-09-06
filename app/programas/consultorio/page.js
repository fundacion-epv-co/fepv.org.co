"use client";

import { useState } from "react";
import Link from "next/link";
import { useGlobalConfig } from "../../components/ConfigContext";

export default function ConsultorioPage() {
  const config = useGlobalConfig();
  const phone = config?.telefono_contacto || "+573166899250";
  
  // Limpiar número de teléfono para WhatsApp
  const waPhone = phone.replace(/\D/g, "");

  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    correo: "",
    servicio: "Psicología",
    fecha: "",
    motivo: ""
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!formData.nombre || !formData.telefono || !formData.fecha) {
      setStatus({ loading: false, success: false, error: "Por favor, llena los campos requeridos (*)." });
      return;
    }

    setStatus({ loading: true, success: false, error: "" });

    try {
      // Simulación de URL de Google Apps Script. 
      // Se debe reemplazar con la URL real desplegada (scriptUrl) que gestiona el POST
      const SCRIPT_URL = config?.script_url || "https://script.google.com/macros/s/AKfycbz_REPLACE_ME/exec"; 
      
      const payload = {
        action: "agendar_cita",
        datos: formData
      };

      // Realizar la petición POST
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Al usar no-cors, la respuesta siempre es opaca, asumimos éxito si no hay throw
      setStatus({ loading: false, success: true, error: "" });
      setFormData({ nombre: "", documento: "", telefono: "", correo: "", servicio: "Psicología", fecha: "", motivo: "" });
      
    } catch (error) {
      console.error("Error al agendar:", error);
      setStatus({ loading: false, success: false, error: "Ocurrió un error al agendar. Intenta de nuevo." });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Banner Principal */}
      <section className="relative w-full py-16 bg-fepv-darkblue overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-fepv-green font-bold tracking-wider text-sm sm:text-base uppercase mb-2 block">
            Acompañamiento Profesional
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white mb-4">
            Consultorio Social y Psicológico
          </h1>
          <p className="text-gray-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Ofrecemos espacios de escucha, valoración y seguimiento profesional para transformar vidas y fortalecer el bienestar emocional y comunitario.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Lado Izquierdo: Información */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-fepv-darkblue mb-4">
                  Nuestros Servicios
                </h2>
                <p className="text-fepv-gray/90 text-sm sm:text-base leading-relaxed mb-6">
                  Contamos con profesionales altamente capacitados para brindarte orientación integral. Selecciona la especialidad que necesitas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-fepv-green">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="font-bold text-fepv-darkblue text-lg mb-2">Psicología</h3>
                  <ul className="text-sm text-fepv-gray space-y-2 list-disc pl-4">
                    <li>Valoración inicial y diagnóstico.</li>
                    <li>Seguimiento emocional personalizado.</li>
                    <li>Atención psicosocial e intervención en crisis.</li>
                    <li>Talleres de resiliencia y salud mental.</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-fepv-blue">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="font-bold text-fepv-darkblue text-lg mb-2">Trabajo Social</h3>
                  <ul className="text-sm text-fepv-gray space-y-2 list-disc pl-4">
                    <li>Valoración de dinámicas familiares.</li>
                    <li>Orientación y acompañamiento en derechos.</li>
                    <li>Seguimiento de casos comunitarios.</li>
                    <li>Gestión y articulación de redes de apoyo.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                <span className="text-2xl">📆</span>
                <div>
                  <h4 className="font-bold text-fepv-darkblue text-sm mb-1">Horarios de Atención</h4>
                  <p className="text-sm text-fepv-gray/80">Lunes a Viernes de 8:00 a.m. a 5:00 p.m.<br/>Es indispensable agendar tu cita previamente para garantizar tu espacio.</p>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Formulario */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-display font-bold text-fepv-darkblue mb-2">
                Agendar Cita
              </h2>
              <p className="text-sm text-fepv-gray/80 mb-6">
                Completa el formulario y te redirigiremos a WhatsApp para confirmar la hora exacta de tu cita.
              </p>

              {status.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                  {status.error}
                </div>
              )}

              {status.success && (
                <div className="bg-fepv-light/20 text-fepv-green p-4 rounded-xl text-sm mb-6 border border-fepv-green/30 font-bold text-center">
                  ¡Genial! Hemos preparado tu mensaje. Si no se abrió WhatsApp, haz clic en el botón nuevamente.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Nombre Completo *</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green focus:bg-white transition-colors text-sm" placeholder="Ej. Ana Pérez" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Documento de Identidad</label>
                    <input type="text" name="documento" value={formData.documento} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green focus:bg-white transition-colors text-sm" placeholder="Opcional" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Celular / WhatsApp *</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green focus:bg-white transition-colors text-sm" placeholder="300 000 0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Correo Electrónico (Para recibir la cita)</label>
                    <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green focus:bg-white transition-colors text-sm" placeholder="ana@ejemplo.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Tipo de Consulta *</label>
                    <select name="servicio" value={formData.servicio} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green focus:bg-white transition-colors text-sm">
                      <option value="Psicología">Psicología</option>
                      <option value="Trabajo Social">Trabajo Social</option>
                      <option value="Valoración Inicial General">Valoración Inicial (No sé cuál requiero)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Fecha de Preferencia *</label>
                    <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} min={new Date().toISOString().split("T")[0]} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green focus:bg-white transition-colors text-sm text-gray-700" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Motivo de Consulta (Opcional)</label>
                  <textarea name="motivo" value={formData.motivo} onChange={handleInputChange} rows="3" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green focus:bg-white transition-colors text-sm resize-none" placeholder="Cuéntanos brevemente cómo podemos apoyarte..."></textarea>
                </div>

                <button disabled={status.loading} type="submit" className="w-full py-3 px-6 bg-fepv-green hover:bg-[#5da914] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {status.loading ? "Agendando..." : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Agendar Cita Oficial
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
