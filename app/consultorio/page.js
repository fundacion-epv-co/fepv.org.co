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

  const handleWhatsAppRedirect = (e) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!formData.nombre || !formData.telefono || !formData.fecha) {
      setStatus({ loading: false, success: false, error: "Por favor, llena los campos requeridos (*)." });
      return;
    }

    // Construir el mensaje
    const mensaje = `Hola Fundación Encuentros Para la Vida, quisiera agendar una cita en su consultorio.%0A%0A` + 
                    `*Datos del paciente:*%0A` +
                    `- Nombre: ${formData.nombre}%0A` +
                    `- Documento: ${formData.documento || "No especificado"}%0A` +
                    `- Teléfono: ${formData.telefono}%0A` +
                    `- Servicio requerido: ${formData.servicio}%0A` +
                    `- Fecha deseada: ${formData.fecha}%0A%0A` +
                    `*Motivo:* ${formData.motivo || "No especificado"}`;
    
    // Redirigir a WhatsApp
    const waUrl = `https://wa.me/${waPhone}?text=${mensaje}`;
    window.open(waUrl, "_blank");
    
    setStatus({ loading: false, success: true, error: "" });
    setFormData({ nombre: "", documento: "", telefono: "", correo: "", servicio: "Psicología", fecha: "", motivo: "" });
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

              <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
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
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Correo Electrónico</label>
                    <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green focus:bg-white transition-colors text-sm" placeholder="ana@ejemplo.com" />
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

                <button type="submit" className="w-full py-3 px-6 bg-fepv-green hover:bg-[#5da914] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Agendar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
