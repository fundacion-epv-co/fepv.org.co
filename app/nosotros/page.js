"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGoogleSheetData, GOOGLE_SHEETS_EQUIPO_CSV, GOOGLE_SHEETS_ALIADOS_CSV, GOOGLE_SHEETS_INTRANET_CSV, getDirectDriveImageUrl, fetchEnfoques, fetchHitosHistoria } from "../../lib/api";

const MOCK_EQUIPO = [
  {
    id: "EQ-1",
    nombre: "Jesús Manuel González Madrid",
    cargo: "Director Ejecutivo & Representante Legal",
    foto: "",
    bio: "Registrado oficialmente ante Cámara de Comercio, lidera la ejecución estratégica, representación institucional y la coordinación de programas de la fundación."
  }
];

const MOCK_ALIADOS = [
  { id: "AL-1", nombre: "SENA", logo: "", enlace_web: "https://www.sena.edu.co" },
  { id: "AL-2", nombre: "Cámara de Comercio", logo: "", enlace_web: "https://ccvalledupar.org.co" }
];

const MOCK_TRANSPARENCIA = [
  { title: "Certificado de Existencia y Representación Legal", type: "PDF", date: "Actualizado Jun 2026", url: "" },
  { title: "Estatutos Oficiales de la Fundación", type: "PDF", date: "Vigente 2026", url: "" },
  { title: "Política de Tratamiento de Datos Personales", type: "PDF", date: "Ley 1581 de 2012", url: "" },
  { title: "Código de Ética y Conducta Institucional", type: "PDF", date: "Aprobado 2026", url: "" },
  { title: "Manual de Control Interno y Transparencia", type: "PDF", date: "Aprobado 2026", url: "" },
  { title: "Formato de Consentimiento para Uso de Imagen", type: "PDF", date: "Protección de Menores", url: "" }
];

export default function Nosotros() {
  const [equipo, setEquipo] = useState([]);
  const [aliados, setAliados] = useState([]);
  const [transparencyDocs, setTransparencyDocs] = useState([]);
  const [enfoquesData, setEnfoquesData] = useState([]);
  const [hitosData, setHitosData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNosotrosData() {
      setIsLoading(true);
      
      // Cargar Equipo
      try {
        const teamData = await fetchGoogleSheetData(GOOGLE_SHEETS_EQUIPO_CSV);
        if (teamData && teamData.length > 0) {
          const mapped = teamData.map(item => ({
            id: item.id || `EQ-${Math.random()}`,
            nombre: item.nombre || "Miembro de Equipo",
            cargo: item.cargo || "",
            foto: getDirectDriveImageUrl(item.foto),
            bio: item.bio || ""
          }));
          setEquipo(mapped);
        } else {
          setEquipo(MOCK_EQUIPO);
        }
      } catch (e) {
        console.error("Error cargando equipo", e);
        setEquipo(MOCK_EQUIPO);
      }

      // Cargar Aliados
      try {
        const alliesData = await fetchGoogleSheetData(GOOGLE_SHEETS_ALIADOS_CSV);
        if (alliesData && alliesData.length > 0) {
          const mapped = alliesData.map(item => ({
            id: item.id || `AL-${Math.random()}`,
            nombre: item.nombre || "Aliado",
            logo: getDirectDriveImageUrl(item.logo || item.url_imagen || item.enlace_imagen),
            enlace_web: item.enlace_web || item.url || ""
          }));
          setAliados(mapped);
        } else {
          setAliados(MOCK_ALIADOS);
        }
      } catch (e) {
        console.error("Error cargando aliados", e);
        setAliados(MOCK_ALIADOS);
      }

      // Cargar Documentos de Transparencia
      try {
        const docData = await fetchGoogleSheetData(GOOGLE_SHEETS_INTRANET_CSV);
        if (docData && docData.length > 0) {
          const mapped = docData.map(item => ({
            title: item["Título"] || item["titulo"] || item["Nombre de Archivo"] || "",
            type: item["Tipo"] || item["tipo"] || "PDF",
            url: item["Enlace Drive"] || item["enlace_drive"] || "",
            etiqueta: item["Etiqueta"] || item["etiqueta"] || "publico",
            date: item["Versión"] || item["version"] || "Actualizado 2026"
          })).filter(doc => doc.title && doc.type && doc.type.toUpperCase().includes("TRANSPARENCIA"));
          
          if (mapped.length > 0) {
            setTransparencyDocs(mapped);
          } else {
            setTransparencyDocs([]);
          }
        } else {
           setTransparencyDocs([]);
        }
      } catch (e) {
        console.error("Error cargando documentos transparencia", e);
      }

      // Cargar Enfoques y Hitos
      try {
        const [enfoquesRes, hitosRes] = await Promise.all([fetchEnfoques(), fetchHitosHistoria()]);
        if (enfoquesRes && enfoquesRes.length > 0) {
          setEnfoquesData(enfoquesRes.map(item => ({ name: item.titulo || "", icon: item.icono || "🎯", desc: item.descripcion || "" })));
        } else {
          setEnfoquesData(enfoques);
        }
        if (hitosRes && hitosRes.length > 0) {
          setHitosData(hitosRes.map(item => ({ date: item.ano || "", title: item.titulo || "", desc: item.descripcion || "" })));
        } else {
          setHitosData(milestones);
        }
      } catch (e) {
        console.error("Error cargando enfoques o hitos", e);
        setEnfoquesData(enfoques);
        setHitosData(milestones);
      }

      setIsLoading(false);
    }
    loadNosotrosData();
  }, []);

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

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-20">
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
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="quienes-somos">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-fepv-darkblue relative inline-block">
              ¿Quiénes Somos?
              <span className="absolute bottom-0 left-0 w-16 h-1.5 bg-fepv-green rounded-full"></span>
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
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">Domicilio y Registro</h3>
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
      <section className="py-24 bg-fepv-light/20" id="mision-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="bg-fepv-green/10 text-fepv-green w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold">
              🎯
            </div>
            <h3 className="font-display font-bold text-xl text-fepv-darkblue">Nuestra Misión</h3>
            <p className="text-sm text-fepv-gray/85 leading-relaxed">
              Transformar vidas y fortalecer comunidades mediante programas integrales de salud mental, atención psicosocial, educación, protección de derechos, inclusión social, fortalecimiento familiar, desarrollo comunitario, sostenibilidad ambiental y bienestar animal, logrando procesos autónomos y sostenibles.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="bg-fepv-blue/10 text-fepv-blue w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold">
              👁️
            </div>
            <h3 className="font-display font-bold text-xl text-fepv-darkblue">Nuestra Visión</h3>
            <p className="text-sm text-fepv-gray/85 leading-relaxed">
              Para el año <strong>2030</strong>, la Fundación Encuentros Para la Vida (FEPV) será reconocida a nivel regional y nacional como una organización líder por su impacto social medible, innovación metodológica, transparencia de gestión y su capacidad para articular alianzas comunitarias y de cooperación internacional.
            </p>
          </div>

        </div>
      </section>

      {/* Bloque 3: Enfoques Institucionales */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="enfoques">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-display font-bold text-3xl text-fepv-darkblue">
            Nuestros Enfoques de Trabajo
          </h2>
          <p className="text-sm text-fepv-gray/80">
            Nuestra labor no se guía por la improvisación. Diseñamos metodologías basadas en diez enfoques clave contemplados en nuestra misión oficial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {enfoquesData.map((e, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-fepv-green/30 hover:shadow-md transition-all duration-300"
            >
              <span className="text-3xl mb-3 block">{e.icon}</span>
              <h4 className="font-display font-bold text-sm text-fepv-darkblue mb-2">{e.name}</h4>
              <p className="text-[11px] text-fepv-gray/75 leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bloque 4: Historia - Línea de Tiempo */}
      <section className="py-24 bg-fepv-light/10" id="historia">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl text-fepv-darkblue">
              Nuestra Historia
            </h2>
            <p className="text-sm text-fepv-gray/80 mt-2">Los hitos de consolidación institucional de FEPV.</p>
          </div>

          <div className="relative border-l-2 border-fepv-green/30 ml-4 sm:ml-32 space-y-12">
            {hitosData.map((m, idx) => (
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
                  <h4 className="font-display font-bold text-base text-fepv-darkblue mb-2">{m.title}</h4>
                  <p className="text-xs text-fepv-gray/80 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloque 5: Equipo Directivo y Técnico */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="equipo">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="font-display font-bold text-3xl text-fepv-darkblue">
            Estructura Organizacional
          </h2>
          <p className="text-sm text-fepv-gray/80">
            Conoce los roles de gobernanza y las áreas técnicas que estructuran el funcionamiento de FEPV.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-10 space-y-3">
            <div className="w-10 h-10 border-4 border-fepv-green border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-fepv-gray/70">Cargando equipo humano...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipo.map((member) => {
              const initials = member.nombre
                ? member.nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
                : "EQ";

              return (
                <div key={member.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm text-center flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                  <div className="space-y-4">
                    {member.foto ? (
                      <img
                        src={member.foto}
                        alt={member.nombre}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-fepv-green/20"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-fepv-light rounded-full mx-auto flex items-center justify-center text-3xl text-fepv-darkblue font-bold font-display">
                        {initials}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-fepv-darkblue leading-tight">{member.nombre}</h3>
                      <p className="text-xs text-fepv-green font-semibold mt-1">{member.cargo}</p>
                    </div>
                    {member.bio && (
                      <p className="text-xs text-fepv-gray/75 leading-relaxed pt-2">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bloque 5.5: SECCIÓN ALIADOS */}
      <div id="aliados" className="scroll-mt-24"></div>
      {(isLoading || aliados.length > 0) && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h3 className="font-display font-bold text-2xl text-fepv-darkblue">
              Organizaciones y Aliados
            </h3>
            <p className="text-xs text-fepv-gray/70">
              Trabajamos de la mano con entidades públicas, privadas y de cooperación para la sostenibilidad territorial.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center space-x-8 sm:space-x-12 overflow-hidden opacity-50">
              {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="h-16 sm:h-20 w-24 sm:w-32 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden flex w-full" style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <div className="flex whitespace-nowrap animate-marquee items-center min-w-max">
              {[...aliados, ...aliados, ...aliados, ...aliados].map((aliado, i) => (
                <a
                  key={`${aliado.id}-${i}`}
                  href={aliado.enlace_web || "#"}
                  target={aliado.enlace_web ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="mx-6 sm:mx-10 opacity-70 hover:opacity-100 transition-all duration-300 filter grayscale hover:grayscale-0 flex-shrink-0"
                  title={aliado.nombre}
                >
                  {aliado.logo ? (
                    <img
                      src={aliado.logo}
                      alt={aliado.nombre}
                      className="h-16 sm:h-20 w-auto max-w-[200px] object-contain inline-block"
                    />
                  ) : (
                    <span className="text-xs font-bold text-fepv-gray bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 inline-block">
                      {aliado.nombre}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
          )}
        </section>
      )}

      {/* Bloque 6: Transparencia Institucional */}
      <section className="py-24 bg-fepv-light/20" id="transparencia">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-bold text-3xl text-fepv-darkblue">
              Transparencia Institucional
            </h2>
            <p className="text-sm text-fepv-gray/80">
              Creemos firmemente en el control y la rendición de cuentas. Ponemos a disposición de la ciudadanía y cooperantes los documentos esenciales de constitución y políticas de FEPV.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between h-24 animate-pulse">
                  <div className="space-y-3 w-3/4">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                </div>
              ))}
            </div>
          ) : transparencyDocs.length > 0 ? (
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
                    <h4 className="font-display font-semibold text-xs text-fepv-darkblue leading-snug pr-2">
                      {doc.title}
                    </h4>
                    <span className="text-[9px] text-fepv-gray/60 block">{doc.date}</span>
                  </div>
                  
                  {doc.url ? (
                    <Link
                      href={doc.etiqueta && doc.etiqueta.toLowerCase().includes("protegido") ? `/visualizar?url=${encodeURIComponent(doc.url)}&title=${encodeURIComponent(doc.title)}&protected=true` : doc.url}
                      target="_blank"
                      rel={doc.etiqueta && doc.etiqueta.toLowerCase().includes("protegido") ? "" : "noopener noreferrer"}
                      className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-full flex items-center justify-center text-fepv-green hover:bg-fepv-green hover:text-white transition-colors cursor-pointer"
                      title={doc.etiqueta && doc.etiqueta.toLowerCase().includes("protegido") ? "Ver documento protegido" : "Descargar / Ver"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {doc.etiqueta && doc.etiqueta.toLowerCase().includes("protegido") ? (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        )}
                      </svg>
                    </Link>
                  ) : (
                    <button
                      className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-full flex items-center justify-center text-fepv-green cursor-default opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm text-fepv-gray font-medium">No hay documentos de transparencia publicados en este momento.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
