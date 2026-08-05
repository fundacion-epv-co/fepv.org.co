"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Subcomponent to handle tabs and forms using useSearchParams inside Suspense
function ParticipaForms() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("beneficiario");
  const [successMessage, setSuccessMessage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const rol = searchParams.get("rol");
    if (rol && ["beneficiario", "voluntario", "aliado"].includes(rol)) {
      setActiveTab(rol);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    documento: "",
    programa: "PAPSIVI (Salud Integral a Víctimas)",
    perfil: "",
    areaInteres: "Salud Mental & Atención Psicosocial",
    organizacion: "",
    representante: "",
    cooperacion: "Cooperación Técnica",
    mensaje: "",
    aceptaDatos: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.aceptaDatos) {
      alert("Debes aceptar el tratamiento de datos personales para continuar.");
      return;
    }

    setSubmitting(true);

    // Para GitHub Pages (estático): construimos el mensaje de WhatsApp
    let mensajeTexto = "";
    if (activeTab === "beneficiario") {
      mensajeTexto =
        `*REGISTRO BENEFICIARIO — FEPV*\n\n` +
        `👤 *Nombre:* ${formData.nombre}\n` +
        `🪪 *Documento:* ${formData.documento}\n` +
        `📞 *Celular:* ${formData.telefono}\n` +
        `📋 *Programa de interés:* ${formData.programa}\n\n` +
        `_Acepta tratamiento de datos: Sí (Ley 1581/2012)_`;
    } else if (activeTab === "voluntario") {
      mensajeTexto =
        `*REGISTRO VOLUNTARIADO — FEPV*\n\n` +
        `👤 *Nombre:* ${formData.nombre}\n` +
        `📞 *Celular:* ${formData.telefono}\n` +
        `📧 *Correo:* ${formData.correo}\n` +
        `🌱 *Área de interés:* ${formData.areaInteres}\n` +
        `📝 *Perfil:* ${formData.perfil}\n\n` +
        `_Acepta tratamiento de datos: Sí (Ley 1581/2012)_`;
    } else if (activeTab === "aliado") {
      mensajeTexto =
        `*REGISTRO ALIANZA / COOPERACIÓN — FEPV*\n\n` +
        `🏢 *Organización:* ${formData.organizacion}\n` +
        `👤 *Representante:* ${formData.representante}\n` +
        `📧 *Correo:* ${formData.correo}\n` +
        `🤝 *Propuesta:* ${formData.cooperacion}\n` +
        `💬 *Descripción:* ${formData.mensaje}\n\n` +
        `_Acepta tratamiento de datos: Sí (Ley 1581/2012)_`;
    }

    const whatsappUrl = `https://wa.me/573166899250?text=${encodeURIComponent(mensajeTexto)}`;
    window.open(whatsappUrl, "_blank");

    setSuccessMessage(true);
    setFormData({
      nombre: "", correo: "", telefono: "", documento: "",
      programa: "PAPSIVI (Salud Integral a Víctimas)", perfil: "",
      areaInteres: "Salud Mental & Atención Psicosocial",
      organizacion: "", representante: "", cooperacion: "Cooperación Técnica",
      mensaje: "", aceptaDatos: false
    });
    setTimeout(() => {
      setSuccessMessage(false);
      setSubmitting(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Tabs selectors */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("beneficiario")}
          className={`flex-1 text-center py-4 font-display font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
            activeTab === "beneficiario"
              ? "border-fepv-green text-fepv-green"
              : "border-transparent text-fepv-gray/60 hover:text-fepv-darkblue"
          }`}
        >
          🙋 Soy Beneficiario
        </button>
        <button
          onClick={() => setActiveTab("voluntario")}
          className={`flex-1 text-center py-4 font-display font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
            activeTab === "voluntario"
              ? "border-fepv-green text-fepv-green"
              : "border-transparent text-fepv-gray/60 hover:text-fepv-darkblue"
          }`}
        >
          🌱 Quiero ser Voluntario
        </button>
        <button
          onClick={() => setActiveTab("aliado")}
          className={`flex-1 text-center py-4 font-display font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
            activeTab === "aliado"
              ? "border-fepv-green text-fepv-green"
              : "border-transparent text-fepv-gray/60 hover:text-fepv-darkblue"
          }`}
        >
          🤝 Quiero ser Aliado
        </button>
      </div>

      {successMessage ? (
        <div className="p-8 bg-fepv-light/50 border border-fepv-green/20 rounded-3xl text-center space-y-4 max-w-xl mx-auto">
          <span className="text-4xl block">🎉</span>
          <h3 className="font-display font-bold text-lg text-fepv-darkblue">¡Formulario enviado por WhatsApp!</h3>
          <p className="text-xs text-fepv-gray/80 leading-relaxed">
            Se abrió WhatsApp con tu información pre-llenada. Envía el mensaje para completar tu registro con la Fundación Encuentros Para la Vida (FEPV). Nuestro equipo revisará tu solicitud y se pondrá en contacto pronto.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-150 shadow-sm max-w-2xl mx-auto space-y-6 text-xs sm:text-sm">
          
          {/* ROL: BENEFICIARIO */}
          {activeTab === "beneficiario" && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-1">
                Registro de Beneficiario
              </h3>
              <p className="text-xs text-fepv-gray/70 leading-relaxed">
                Inscríbete para acceder a nuestros procesos de apoyo psicosocial, capacitación técnica o programas de fortalecimiento.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Nombre Completo *</label>
                  <input type="text" required name="nombre" value={formData.nombre} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="Ej. María Pérez" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Documento de Identidad *</label>
                  <input type="text" required name="documento" value={formData.documento} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="C.C. o T.I." />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Celular de contacto (WhatsApp) *</label>
                  <input type="tel" required name="telefono" value={formData.telefono} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="300 000 0000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Programa de interés *</label>
                  <select name="programa" value={formData.programa} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green bg-white">
                    <option>PAPSIVI (Salud Integral a Víctimas)</option>
                    <option>Escuela de Formación y Competencias</option>
                    <option>Medio Ambiente & Eco-Encuentros</option>
                    <option>Bienestar Animal (Esterilización/Apoyo)</option>
                    <option>Emprendimiento y Autonomía</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ROL: VOLUNTARIO */}
          {activeTab === "voluntario" && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-1">
                Registro de Voluntariado
              </h3>
              <p className="text-xs text-fepv-gray/70 leading-relaxed">
                Únete a FEPV aportando tu tiempo y conocimientos profesionales.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Nombre Completo *</label>
                  <input type="text" required name="nombre" value={formData.nombre} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="Ej. Carlos Mendoza" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">WhatsApp de contacto *</label>
                  <input type="tel" required name="telefono" value={formData.telefono} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="300 000 0000" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Correo Electrónico *</label>
                  <input type="email" required name="correo" value={formData.correo} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="carlos@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Área de interés *</label>
                  <select name="areaInteres" value={formData.areaInteres} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green bg-white">
                    <option>Salud Mental &amp; Atención Psicosocial</option>
                    <option>Educación y Formación</option>
                    <option>Medio Ambiente &amp; Reforestación</option>
                    <option>Bienestar Animal y Veterinaria</option>
                    <option>Asesoría de Negocios y Emprendimiento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fepv-darkblue mb-1">Perfil Académico / Laboral *</label>
                <textarea required name="perfil" rows="3" value={formData.perfil} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green resize-none text-xs"
                  placeholder="Describe brevemente tus estudios, profesión, habilidades o experiencias de voluntariado..." />
              </div>
            </div>
          )}

          {/* ROL: ALIADO */}
          {activeTab === "aliado" && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-1">
                Registro de Alianzas y Cooperación
              </h3>
              <p className="text-xs text-fepv-gray/70 leading-relaxed">
                Dirigido a empresas, ONGs, entidades públicas u organismos de cooperación que deseen formular y co-ejecutar convenios con la fundación.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Organización / Entidad *</label>
                  <input type="text" required name="organizacion" value={formData.organizacion} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="Nombre legal de la entidad" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Nombre Representante / Delegado *</label>
                  <input type="text" required name="representante" value={formData.representante} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="Nombre completo de contacto" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Correo Corporativo *</label>
                  <input type="email" required name="correo" value={formData.correo} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green"
                    placeholder="contacto@empresa.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fepv-darkblue mb-1">Propuesta de Cooperación *</label>
                  <select name="cooperacion" value={formData.cooperacion} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green bg-white">
                    <option>Cooperación Técnica</option>
                    <option>Cofinanciación de Proyectos</option>
                    <option>Voluntariado Corporativo</option>
                    <option>Donación Específica / Patrocinio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fepv-darkblue mb-1">Descripción de la propuesta *</label>
                <textarea required name="mensaje" rows="3" value={formData.mensaje} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green resize-none text-xs"
                  placeholder="Detalla de qué manera visualizan la alianza estratégica con FEPV..." />
              </div>
            </div>
          )}

          {/* Común: Ley de Datos Personales */}
          <div className="border-t border-gray-100 pt-4 flex items-start gap-2">
            <input type="checkbox" required id="aceptaDatos" name="aceptaDatos"
              checked={formData.aceptaDatos} onChange={handleInputChange}
              className="mt-0.5 cursor-pointer w-4 h-4 text-fepv-green" />
            <label htmlFor="aceptaDatos" className="text-[10px] sm:text-xs text-fepv-gray/80 leading-normal cursor-pointer select-none">
              Autorizo el tratamiento de mis datos personales para fines de registro, verificación y contacto de FEPV, de conformidad con la Ley 1581 de 2012 de Colombia.
            </label>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full fepv-btn fepv-btn-primary py-3.5 text-xs font-bold cursor-pointer disabled:opacity-55">
            {submitting ? "Abriendo WhatsApp..." : "📲 ENVIAR SOLICITUD POR WHATSAPP"}
          </button>
        </form>
      )}

    </div>
  );
}

export default function Participa() {
  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-5xl">
            Participa con Nosotros
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Forma parte del cambio. Completa el formulario de registro según el rol con el que deseas sumarte a la labor de FEPV.
          </p>
        </div>
      </section>

      {/* Forms Section wrapped in Suspense for useSearchParams */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="text-center py-10 font-sans text-xs text-fepv-gray/55">
            Cargando formularios de participación...
          </div>
        }>
          <ParticipaForms />
        </Suspense>
      </section>

    </div>
  );
}
