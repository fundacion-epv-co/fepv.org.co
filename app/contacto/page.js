"use client";

import { useState } from "react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    tipoSolicitud: "informacion",
    mensaje: "",
    aceptaDatos: false
  });

  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.aceptaDatos) {
      alert("Debes aceptar la polÃ­tica de tratamiento de datos personales para enviar tu mensaje.");
      return;
    }

    setSubmitting(true);

    // Para GitHub Pages (estÃ¡tico): abrimos WhatsApp con el mensaje pre-llenado
    const mensajeWA = encodeURIComponent(
      `*CONTACTO FEPV â€” ${formData.tipoSolicitud.toUpperCase()}*\n\n` +
      `ðŸ‘¤ *Nombre:* ${formData.nombre}\n` +
      `ðŸ“§ *Correo:* ${formData.correo}\n` +
      `ðŸ“ž *TelÃ©fono:* ${formData.telefono || "No indicado"}\n\n` +
      `ðŸ’¬ *Mensaje:* ${formData.mensaje}\n\n` +
      `_Acepta tratamiento de datos: SÃ­ (Ley 1581/2012)_`
    );

    window.open(`https://wa.me/573000000000?text=${mensajeWA}`, "_blank");

    setSuccess(true);
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      tipoSolicitud: "informacion",
      mensaje: "",
      aceptaDatos: false
    });
    setTimeout(() => {
      setSuccess(false);
      setSubmitting(false);
    }, 4000);
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
            Â¿Tienes preguntas, propuestas o deseas sumarte a nuestras iniciativas? EscrÃ­benos y nos pondremos en contacto contigo.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Info Directa (Lado Izquierdo) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-fepv-darkblue">
              FundaciÃ³n Encuentros Para la Vida
            </h2>
            <p className="text-sm text-fepv-gray/80 leading-relaxed">
              Estamos a tu disposiciÃ³n en la sede principal en el departamento del Cesar o a travÃ©s de nuestros canales digitales.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-fepv-gray/90">
            <div className="flex items-start gap-4">
              <span className="text-2xl bg-fepv-light/50 p-2.5 rounded-xl flex items-center justify-center">ðŸ“</span>
              <div className="space-y-1">
                <h4 className="font-bold text-fepv-darkblue">DirecciÃ³n FÃ­sica</h4>
                <p>AgustÃ­n Codazzi, Cesar, Colombia</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl bg-fepv-light/50 p-2.5 rounded-xl flex items-center justify-center">ðŸ“§</span>
              <div className="space-y-1">
                <h4 className="font-bold text-fepv-darkblue">Correo ElectrÃ³nico</h4>
                <p className="hover:underline">
                  <a href="mailto:fundacion.epv.co@gmail.com">fundacion.epv.co@gmail.com</a>
                </p>
                <p className="text-[10px] text-fepv-gray/50">Corporativos: contacto@fepv.org.co (En proceso)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl bg-fepv-light/50 p-2.5 rounded-xl flex items-center justify-center">ðŸ“±</span>
              <div className="space-y-1">
                <h4 className="font-bold text-fepv-darkblue">WhatsApp e Instagram</h4>
                <p className="hover:underline">
                  <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer">WhatsApp Institucional</a>
                </p>
                <p className="text-xs text-fepv-gray/70">Instagram/Facebook: @fundacion.epv.co</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario (Lado Derecho) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-150 shadow-md">
            
            {success ? (
              <div className="p-8 bg-fepv-light/60 border border-fepv-green/20 rounded-2xl text-center space-y-3 animate-in fade-in duration-300">
                <span className="text-4xl block">ðŸ“²</span>
                <h3 className="font-display font-bold text-base text-fepv-darkblue">Â¡Mensaje enviado por WhatsApp!</h3>
                <p className="text-xs text-fepv-gray/80 leading-relaxed">
                  Se abriÃ³ WhatsApp con tu mensaje pre-llenado. EnvÃ­alo para completar tu contacto con FEPV. Agradecemos tu interÃ©s y nos comunicaremos contigo a la brevedad.
                </p>
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
                      placeholder="Ej. Ana MarÃ­a Castro"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">Correo ElectrÃ³nico *</label>
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
                    <label className="block text-xs font-bold text-fepv-darkblue mb-1">NÃºmero de TelÃ©fono</label>
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
                      <option value="informacion">InformaciÃ³n General</option>
                      <option value="programa">InscripciÃ³n a Programa / Proyecto</option>
                      <option value="alianza">Alianzas y Convenios</option>
                      <option value="donacion">DonaciÃ³n y Apadrinamiento</option>
                      <option value="voluntariado">Voluntariado</option>
                      <option value="cooperacion">CooperaciÃ³n TÃ©cnica/Financiera</option>
                      <option value="prensa">Prensa / Comunicados</option>
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
                    placeholder="Escribe aquÃ­ tu mensaje en detalle..."
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
                    Autorizo el tratamiento de mis datos personales para fines de registro, verificaciÃ³n y contacto de FEPV, de conformidad con la Ley 1581 de 2012 de Colombia.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full fepv-btn fepv-btn-primary py-3.5 text-xs font-bold cursor-pointer disabled:opacity-55"
                >
                  {submitting ? "Abriendo WhatsApp..." : "ðŸ“² ENVIAR POR WHATSAPP"}
                </button>
              </form>
            )}

          </div>
        </div>

      </section>

    </div>
  );
}
