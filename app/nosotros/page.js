"use client";

import { useState } from "react";

export default function Nosotros() {
  const enfoques = [
    { name: "Derechos Humanos", icon: "❤️", desc: "Priorizamos la dignidad humana y las garantías fundamentales en cada intervención." },
    { name: "Enfoque Psicosocial", icon: "🧠", desc: "Comprendemos el impacto emocional y social de las realidades para sanar integralmente." },
    { name: "Inclusión Social", icon: "♿", desc: "Aseguramos la participación activa de personas con discapacidad y poblaciones diversas." },
    { name: "Fortalecimiento Familiar", icon: "👨‍👩‍👧", desc: "Creemos en la familia como el núcleo protector fundamental para el desarrollo sano." },
    { name: "Desarrollo Comunitario", icon: "🌎", desc: "Impulsamos la autogestión y capacidades propias de las comunidades en su territorio." },
    { name: "Enfoque de Género", icon: "⚖️", desc: "Promovemos la equidad, el respeto a la diversidad y la prevención de violencias." },
    { name: "Enfoque Intercultural", icon: "🤝", desc: "Respetamos las costumbres, saberes tradicionales y etnias del Cesar y Colombia." },
    { name: "Sostenibilidad Ambiental", icon: "🌱", desc: "Educamos en conservación y promovemos prácticas armónicas con la biodiversidad." },
    { name: "Bienestar Animal", icon: "🐾", desc: "Defendemos los derechos de los animales y la tenencia responsable en comunidades." },
    { name: "Enfoque Diferencial", icon: "🕊️", desc: "Adaptamos las acciones a las necesidades específicas de víctimas del conflicto y vulnerabilidades." }
  ];

  const milestones = [
    { date: "12 MAY 2026", title: "Constitución de FEPV", desc: "Firma del acta oficial de constitución en Agustín Codazzi, Cesar, como entidad sin ánimo de lucro." },
    { date: "09 JUN 2026", title: "Inscripción en Cámara de Comercio", desc: "Registro oficial y asignación de personería jurídica institucional." },
    { date: "JUNIO 2026", title: "Consolidación Institucional", desc: "Estructuración de estatutos, políticas internas y conformación del equipo directivo." },
    { date: "JULIO 2026", title: "Primeros Procesos y Alianzas", desc: "Mapeo territorial del municipio de Codazzi y primeros acercamientos con cooperantes técnicos." },
    { date: "2030", title: "Visión Institucional", desc: "Consolidación de FEPV como organización líder en el Cesar y Colombia por su innovación y transformación social." }
  ];

  const transparencyDocs = [
    { title: "Certificado de Existencia y Representación Legal", type: "PDF", date: "Actualizado Jun 2026" },
    { title: "Estatutos Oficiales de la Fundación", type: "PDF", date: "Vigente 2026" },
    { title: "Política de Tratamiento de Datos Personales", type: "PDF", date: "Ley 1581 de 2012" },
    { title: "Código de Ética y Conducta Institucional", type: "PDF", date: "Aprobado 2026" },
    { title: "Manual de Control Interno y Transparencia", type: "PDF", date: "Aprobado 2026" },
    { title: "Formato de Consentimiento para Uso de Imagen", type: "PDF", date: "Protección de Menores" }
  ];

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-4.5xl">
            Nuestra Fundación
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Conoce la historia, misión, enfoques institucionales y el equipo humano detrás de la Fundación Encuentros Para la Vida.
          </p>
        </div>
      </section>

      {/* Bloque 1: Quiénes Somos */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="quienes-somos">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-fepv-dark relative inline-block">
              ¿Quiénes Somos?
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-fepv-green rounded"></span>
            </h2>
            <p className="text-sm sm:text-base text-fepv-gray/85 leading-relaxed">
              La <strong>Fundación Encuentros Para la Vida (FEPV)</strong> es una entidad sin ánimo de lucro con domicilio principal en el municipio de <strong>Agustín Codazzi, Cesar</strong>. Fue constituida oficialmente el <strong>12 de mayo de 2026</strong> e inscrita ante la Cámara de Comercio el <strong>9 de junio de 2026</strong>.
            </p>
            <p className="text-sm sm:text-base text-fepv-gray/85 leading-relaxed">
              Nacemos con la firme convicción de que las transformaciones duraderas se logran mediante encuentros significativos que devuelven la esperanza, brindan herramientas y fortalecen la resiliencia comunitaria en territorios que han superado históricas complejidades sociales.
            </p>
          </div>
          
          <div className="lg:col-span-5 bg-fepv-light/30 p-8 rounded-3xl border border-fepv-green/10 text-center space-y-4">
            <span className="text-5xl block">🏡</span>
            <h3 className="font-display font-bold text-lg text-fepv-dark">Domicilio y Registro</h3>
            <div className="text-xs text-fepv-gray/85 space-y-2">
              <p>📍 <strong>Sede Principal:</strong> Agustín Codazzi, Cesar, Colombia</p>
              <p>📅 <strong>Constitución:</strong> 12 de Mayo de 2026</p>
              <p>📝 <strong>CC Registro:</strong> 9 de Junio de 2026</p>
              <p>💼 <strong>Naturaleza:</strong> Entidad Sin Ánimo de Lucro (ESAL)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bloque 2: Misión y Visión */}
      <section className="py-16 bg-fepv-light/20" id="mision-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="bg-fepv-green/10 text-fepv-green w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold">
              🎯
            </div>
            <h3 className="font-display font-bold text-xl text-fepv-dark">Nuestra Misión</h3>
            <p className="text-sm text-fepv-gray/85 leading-relaxed">
              Transformar vidas y fortalecer comunidades mediante programas integrales de salud mental, atención psicosocial, educación, protección de derechos, inclusión social, fortalecimiento familiar, desarrollo comunitario, sostenibilidad ambiental y bienestar animal, logrando procesos autónomos y sostenibles.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="bg-fepv-blue/10 text-fepv-blue w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold">
              👁️
            </div>
            <h3 className="font-display font-bold text-xl text-fepv-dark">Nuestra Visión</h3>
            <p className="text-sm text-fepv-gray/85 leading-relaxed">
              Para el año <strong>2030</strong>, la Fundación Encuentros Para la Vida (FEPV) será reconocida a nivel regional y nacional como una organización líder por su impacto social medible, innovación metodológica, transparencia de gestión y su capacidad para articular alianzas comunitarias y de cooperación internacional.
            </p>
          </div>

        </div>
      </section>

      {/* Bloque 3: Enfoques Institucionales */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="enfoques">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-fepv-dark">
            Nuestros Enfoques de Trabajo
          </h2>
          <p className="text-sm text-fepv-gray/80">
            Nuestra labor no se guía por la improvisación. Diseñamos metodologías basadas en diez enfoques clave contemplados en nuestra misión oficial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {enfoques.map((e, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-fepv-green/30 hover:shadow-md transition-all duration-300"
            >
              <span className="text-3xl mb-3 block">{e.icon}</span>
              <h4 className="font-display font-bold text-sm text-fepv-dark mb-2">{e.name}</h4>
              <p className="text-[11px] text-fepv-gray/75 leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bloque 4: Historia - Línea de Tiempo */}
      <section className="py-16 bg-fepv-light/10" id="historia">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-fepv-dark">
              Nuestra Historia
            </h2>
            <p className="text-sm text-fepv-gray/80 mt-2">Los hitos de consolidación institucional de FEPV.</p>
          </div>

          <div className="relative border-l-2 border-fepv-green/30 ml-4 sm:ml-32 space-y-12">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-10">
                {/* Indicador de Línea de Tiempo */}
                <div className="absolute -left-[9px] top-1 bg-white border-2 border-fepv-green w-4 h-4 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-fepv-green rounded-full"></span>
                </div>
                
                {/* Fecha en escritorio colocada a la izquierda */}
                <span className="hidden sm:block absolute -left-36 top-0 w-28 text-right font-display font-bold text-sm text-fepv-green">
                  {m.date}
                </span>

                {/* Contenido */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-xl">
                  <span className="sm:hidden block font-display font-bold text-xs text-fepv-green mb-1">
                    {m.date}
                  </span>
                  <h4 className="font-display font-bold text-base text-fepv-dark mb-2">{m.title}</h4>
                  <p className="text-xs text-fepv-gray/80 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloque 5: Equipo Directivo y Técnico */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="equipo">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-fepv-dark">
            Estructura Organizacional
          </h2>
          <p className="text-sm text-fepv-gray/80">
            Conoce los roles de gobernanza y las áreas técnicas que estructuran el funcionamiento de FEPV.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Representación Legal */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-fepv-green/20 shadow-md text-center space-y-4">
            <span className="text-xs font-bold text-fepv-green uppercase tracking-wider block">Dirección Ejecutiva</span>
            <div className="w-24 h-24 bg-fepv-light rounded-full mx-auto flex items-center justify-center text-4xl text-fepv-dark font-bold font-display">
              JM
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-fepv-dark">Jesús Manuel González Madrid</h3>
              <p className="text-xs text-fepv-green font-semibold mt-0.5">Director Ejecutivo & Representante Legal</p>
            </div>
            <p className="text-xs text-fepv-gray/80 leading-relaxed">
              Registrado oficialmente ante Cámara de Comercio, lidera la ejecución estratégica, representación institucional y la coordinación de programas de la fundación.
            </p>
          </div>

          {/* Áreas y Órganos de Control */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-fepv-light/20 p-6 rounded-2xl border border-fepv-green/10">
              <h4 className="font-display font-bold text-sm text-fepv-dark mb-3 uppercase tracking-wider">
                Junta Directiva
              </h4>
              <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-fepv-dark/85">
                <div className="p-3 bg-white rounded-xl text-center">👑 Presidencia</div>
                <div className="p-3 bg-white rounded-xl text-center">💰 Tesorería</div>
                <div className="p-3 bg-white rounded-xl text-center">📝 Secretaría</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-display font-bold text-sm text-fepv-dark mb-4 uppercase tracking-wider">
                Áreas Técnicas y Operativas
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] text-fepv-gray/90 font-medium">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">📋 Dirección de Programas</div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">🌎 Cooperación Internacional</div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">💸 Admin. y Financiera</div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">⚖️ Dirección Jurídica</div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">📢 Comunicaciones</div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">📈 Planeación</div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg col-span-2 sm:col-span-1">🗄️ Gestión Documental</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bloque 6: Transparencia Institucional */}
      <section className="py-16 bg-fepv-light/20" id="transparencia">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-fepv-dark">
              Transparencia Institucional
            </h2>
            <p className="text-sm text-fepv-gray/80">
              Creemos firmemente en el control y la rendición de cuentas. Ponemos a disposición de la ciudadanía y cooperantes los documentos esenciales de constitución y políticas de FEPV.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {transparencyDocs.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-fepv-green/20 transition-all duration-300"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-fepv-light text-fepv-green px-2 py-0.5 rounded-full inline-block">
                    {doc.type}
                  </span>
                  <h4 className="font-display font-semibold text-xs text-fepv-dark leading-snug pr-2">
                    {doc.title}
                  </h4>
                  <span className="text-[9px] text-fepv-gray/60 block">{doc.date}</span>
                </div>
                
                {/* Botón Simulado de Descarga */}
                <button
                  onClick={() => alert(`Simulación de descarga del documento: ${doc.title}`)}
                  className="bg-fepv-light/50 p-2 rounded-xl text-fepv-green hover:bg-fepv-green hover:text-white transition-colors cursor-pointer"
                  aria-label={`Descargar ${doc.title}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
