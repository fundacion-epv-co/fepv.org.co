"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGlobalConfig } from "../../components/ConfigContext";

// Subcomponent to handle tabs and forms using useSearchParams inside Suspense
function ParticipaForms() {
  const searchParams = useSearchParams();
  const config = useGlobalConfig();
  const [activeTab, setActiveTab] = useState("beneficiario");
  const [successMessage, setSuccessMessage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const officialEmail = config?.correo_contacto || "fundacion.epv.co@gmail.com";
  const officialPhone = config?.telefono_contacto || "+57 316 689 9250";
  const whatsappBaseUrl = config?.enlace_whatsapp || "https://wa.me/573166899250";

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
    ubicacion: "",
    edad: "",
    disponibilidad: "Fines de semana",
    motivacion: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.aceptaDatos) {
      alert("Debes aceptar el tratamiento de datos personales para continuar.");
      return;
    }

    setSubmitting(true);
    const formElement = e.target;
    
    // Si el usuario configuró el enlace de Google Apps Script en Sheets
    if (config?.enlace_formulario_web && config.enlace_formulario_web.includes("script.google.com")) {
      if (!config.enlace_formulario_web.endsWith("/exec")) {
        alert("❌ ADVERTENCIA: El enlace pegado en Google Sheets no es correcto. Debe terminar en '/exec'. Revisa la configuración de tu hoja de Google Sheets (gid=3001).");
        setSubmitting(false);
        return;
      }
      
      try {
        const formDataObj = new FormData(formElement);
        const payload = {};
        for (const [key, value] of formDataObj.entries()) {
          payload[key] = value;
        }
        payload.Rol = activeTab.toUpperCase();
        
        const fileInput = formElement.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const base64Str = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
          });
          payload.hoja_de_vida_base64 = base64Str;
          payload.hoja_de_vida_name = file.name;
          payload.hoja_de_vida_mime = file.type;
        }
        
        delete payload.hoja_de_vida;

        // Enviar JSON puro a Google Apps Script
        await fetch(config.enlace_formulario_web, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          mode: 'no-cors'
        });

        setSuccessMessage(true);
        setFormData({
          nombre: "", correo: "", telefono: "", documento: "",
          programa: "PAPSIVI (Salud Integral a Víctimas)", perfil: "",
          areaInteres: "Salud Mental & Atención Psicosocial",
          ubicacion: "", edad: "", disponibilidad: "Fines de semana", motivacion: "",
          organizacion: "", representante: "", cooperacion: "Cooperación Técnica",
          mensaje: "", aceptaDatos: false
        });
        formElement.reset();
      } catch (error) {
        console.error("Error al enviar:", error);
        alert("Hubo un error de red. Intenta nuevamente.");
      } finally {
        setSubmitting(false);
        setTimeout(() => setSuccessMessage(false), 5000);
      }
      return;
    }

    // SI NO HAY GOOGLE SCRIPT CONFIGURADO -> Cae de respaldo a enviar por WhatsApp
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
        `📍 *Ubicación:* ${formData.ubicacion}\n` +
        `🎂 *Edad:* ${formData.edad}\n` +
        `🌱 *Área de interés:* ${formData.areaInteres}\n` +
        `⏳ *Disponibilidad:* ${formData.disponibilidad}\n` +
        `📝 *Perfil:* ${formData.perfil}\n` +
        `💡 *Motivación:* ${formData.motivacion}\n\n` +
        `_Nota: Adjuntaré/enviaré mi Hoja de Vida diligenciada a ${officialEmail}_\n` +
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

    const cleanWaNum = whatsappBaseUrl.replace(/[^0-9]/g, "") || "573166899250";
    const whatsappUrl = `https://wa.me/${cleanWaNum}?text=${encodeURIComponent(mensajeTexto)}`;
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
          <h3 className="font-display font-bold text-lg text-fepv-darkblue">¡Formulario enviado con éxito!</h3>
          <p className="text-xs text-fepv-gray/80 leading-relaxed">
            Se abrió la ventana de confirmación. Tu solicitud fue registrada con la Fundación Encuentros Para la Vida (FEPV). Nuestro equipo revisará tus datos y se pondrá en contacto pronto a través del correo <strong>{officialEmail}</strong> o el teléfono <strong>{officialPhone}</strong>.
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
                    <option>Medio Ambiente &amp; Eco-Encuentros</option>
                    <option>Bienestar Animal (Esterilización/Apoyo)</option>
                    <option>Emprendimiento y Autonomía</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ROL: VOLUNTARIO */}
          {activeTab === "voluntario" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-1">
                  Registro de Voluntariado
                </h3>
                <p className="text-xs text-fepv-gray/70 leading-relaxed">
                  Únete a FEPV aportando tu tiempo y conocimientos profesionales en nuestros proyectos territoriales.
                </p>
              </div>

              {/* BLOQUE DE DESCARGA DE HOJA DE VIDA VIGENTE */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-fepv-light/60 to-white border border-fepv-green/30 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center gap-2 font-display font-bold text-fepv-darkblue text-xs sm:text-sm">
                  <span className="text-xl">📄</span> Formato Único de Hoja de Vida para Voluntariado
                </div>
                <p className="text-xs text-fepv-gray/80 leading-relaxed">
                  Para formalizar tu postulación, por favor <strong>descarga el formato de Hoja de Vida oficial vigente</strong> y diligéncialo. Luego, completa el formulario a continuación y adjunta el archivo.
                </p>
                
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a 
                    href={config?.formato_hoja_vida || config?.enlace_hoja_vida || "https://docs.google.com/document/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub"}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-fepv-green hover:bg-fepv-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Descargar Formato de Hoja de Vida Vigente
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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

              <div>
                <label className="block text-xs font-bold text-fepv-darkblue mb-1">Hoja de Vida Diligenciada (PDF o DOCX)</label>
                <input type="file" name="hoja_de_vida" accept=".pdf,.doc,.docx" required
                  className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-fepv-green/10 file:text-fepv-green hover:file:bg-fepv-green/20" />
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
            {submitting 
              ? (config?.enlace_formulario_web ? "Enviando solicitud..." : "Abriendo WhatsApp...") 
              : (config?.enlace_formulario_web ? "📩 ENVIAR SOLICITUD" : "📲 ENVIAR SOLICITUD POR WHATSAPP")
            }
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
