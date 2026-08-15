"use client";

import { useState } from "react";
import { useGlobalConfig } from "../../components/ConfigContext";

export default function Participa() {
  const config = useGlobalConfig();
  const [activeTab, setActiveTab] = useState("beneficiario");
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false);

  const officialEmail = config?.correo_contacto || "fundacion.epv.co@gmail.com";
  const officialPhone = config?.telefono_contacto || "+57 316 689 9250";

  // Función para obtener el estado y enlace desde la configuración
  const getConfigTab = () => {
    switch(activeTab) {
      case "beneficiario":
        return {
          estado: (config?.beneficiario_estado || "ABIERTO").toUpperCase(),
          enlace: config?.beneficiario_link || "#"
        };
      case "voluntario":
        return {
          estado: (config?.voluntario_estado || "ABIERTO").toUpperCase(),
          enlace: config?.voluntario_link || "#"
        };
      case "aliado":
        return {
          estado: (config?.aliado_estado || "ABIERTO").toUpperCase(),
          enlace: config?.aliado_link || "#"
        };
      default:
        return { estado: "CERRADO", enlace: "#" };
    }
  };

  const { estado, enlace } = getConfigTab();

  // Reiniciar el checkbox al cambiar de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAceptaCondiciones(false);
  };

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-5xl">
            Participa con Nosotros
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Forma parte del cambio. Elige tu rol a continuación y accede al Registro Único Oficial.
          </p>
        </div>
      </section>

      {/* Contenedor Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-fepv-gray/10 overflow-hidden border border-gray-100">
          
          {/* Tabs selectors */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange("beneficiario")}
              className={`flex-1 text-center py-4 font-display font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
                activeTab === "beneficiario"
                  ? "border-fepv-green text-fepv-green bg-gray-50/50"
                  : "border-transparent text-fepv-gray/60 hover:text-fepv-darkblue"
              }`}
            >
              🙋 Soy Beneficiario
            </button>
            <button
              onClick={() => handleTabChange("voluntario")}
              className={`flex-1 text-center py-4 font-display font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
                activeTab === "voluntario"
                  ? "border-fepv-green text-fepv-green bg-gray-50/50"
                  : "border-transparent text-fepv-gray/60 hover:text-fepv-darkblue"
              }`}
            >
              🌱 Quiero ser Voluntario
            </button>
            <button
              onClick={() => handleTabChange("aliado")}
              className={`flex-1 text-center py-4 font-display font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
                activeTab === "aliado"
                  ? "border-fepv-green text-fepv-green bg-gray-50/50"
                  : "border-transparent text-fepv-gray/60 hover:text-fepv-darkblue"
              }`}
            >
              🤝 Quiero ser Aliado
            </button>
          </div>

          <div className="p-6 sm:p-10">
            {estado !== "ABIERTO" ? (
              // VISTA DE CONVOCATORIA CERRADA
              <div className="p-8 bg-gray-50 border border-gray-200 rounded-3xl text-center space-y-5 max-w-2xl mx-auto">
                <span className="text-5xl block">⏳</span>
                <h3 className="font-display font-bold text-xl text-fepv-darkblue">CONVOCATORIA CERRADA</h3>
                <p className="text-sm text-fepv-gray leading-relaxed text-justify">
                  Agradecemos su interés en participar en esta convocatoria de la Fundación Encuentros Para la Vida.
                  <br/><br/>
                  Le informamos que el período de inscripciones ha finalizado o no ha sido habilitado, por lo tanto actualmente no es posible recibir nuevas postulaciones para este proceso.
                  <br/><br/>
                  ¡Gracias por confiar en la Fundación Encuentros Para la Vida!
                </p>
                <div className="text-xs text-fepv-gray/60 pt-4 border-t border-gray-200">
                  Para más información, puede contactarnos a <strong>{officialEmail}</strong>
                </div>
              </div>
            ) : (
              // VISTA DE CONVOCATORIA ABIERTA (ACEPTACIÓN DE CONDICIONES)
              <div className="max-w-2xl mx-auto space-y-8">
                
                {activeTab === "beneficiario" && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-2xl text-fepv-darkblue text-center">Registro Único de Beneficiarios</h3>
                    <p className="text-sm text-fepv-gray leading-relaxed text-justify">
                      Inscríbete para acceder a nuestros procesos de apoyo psicosocial, capacitación técnica o programas de fortalecimiento familiar y comunitario. 
                      A continuación, serás redirigido al formulario oficial de caracterización poblacional.
                    </p>
                  </div>
                )}

                {activeTab === "voluntario" && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-2xl text-fepv-darkblue text-center">Registro de Voluntariado</h3>
                    <p className="text-sm text-fepv-gray leading-relaxed text-justify">
                      Únete a FEPV aportando tu tiempo y conocimientos profesionales en nuestros proyectos territoriales. 
                      En el formulario oficial deberás cargar tu Hoja de Vida y responder a algunas preguntas de selección y perfilamiento.
                    </p>
                    <div className="p-4 bg-fepv-light/30 border border-fepv-green/30 rounded-xl">
                      <p className="text-xs font-bold text-fepv-darkblue mb-2">📄 Nota importante:</p>
                      <p className="text-xs text-fepv-gray leading-relaxed">
                        Ten preparado tu documento de identidad y tu Hoja de Vida en formato PDF, ya que serán solicitados durante el registro oficial.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "aliado" && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-2xl text-fepv-darkblue text-center">Registro de Alianzas y Cooperación</h3>
                    <p className="text-sm text-fepv-gray leading-relaxed text-justify">
                      Dirigido a empresas, ONGs, entidades públicas u organismos de cooperación que deseen formular y co-ejecutar convenios con la fundación.
                      Completa el formulario institucional para presentarnos tu propuesta.
                    </p>
                  </div>
                )}

                {/* Casilla de aceptación común */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={aceptaCondiciones}
                        onChange={(e) => setAceptaCondiciones(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-fepv-green focus:ring-fepv-green cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-fepv-gray leading-relaxed select-none group-hover:text-fepv-darkblue transition-colors">
                      He leído y acepto los términos de participación. Autorizo el tratamiento de mis datos personales para fines de registro, verificación y contacto de la Fundación Encuentros Para la Vida (FEPV), de conformidad con la Ley 1581 de 2012 sobre protección de datos.
                    </span>
                  </label>
                </div>

                {/* Botón dinámico */}
                <div className="text-center pt-2">
                  {aceptaCondiciones ? (
                    <a 
                      href={enlace} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full sm:w-auto px-8 py-4 bg-fepv-green hover:bg-fepv-dark text-white font-bold rounded-xl transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    >
                      Ir al Formulario Oficial 📝
                    </a>
                  ) : (
                    <div className="inline-block w-full sm:w-auto px-8 py-4 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                      Debe aceptar las condiciones para continuar
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
