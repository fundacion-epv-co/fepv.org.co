"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PROGRAM_DATA } from "../../../lib/programData";
import { fetchGoogleSheetData, GOOGLE_SHEETS_CONVOCATORIAS_CSV, GOOGLE_SHEETS_PROGRAMAS_CSV, getDirectDriveImageUrl, fetchProgramImagesMap } from "../../../lib/api";

export default function ProgramDetailClient({ slug }) {
  const [oportunidades, setOportunidades] = useState([]);
  const [isLoadingOpps, setIsLoadingOpps] = useState(true);

  // Obtener la información del programa desde el estado
  const [program, setProgram] = useState(PROGRAM_DATA[slug]);

  useEffect(() => {
    async function loadOpps() {
      setIsLoadingOpps(true);
      try {
        const oppsData = await fetchGoogleSheetData(GOOGLE_SHEETS_CONVOCATORIAS_CSV);
        if (oppsData && oppsData.length > 0) {
          const activeOpps = oppsData.map(item => ({
            id: item.id || `OPP-${Math.random()}`,
            title: item.titulo || "",
            desc: item.descripcion || "",
            deadline: item.cierre || "",
            status: item.estado || "",
            categoria: item.categoria || "",
            programa: item.programa || "",
            lugar: item.lugar || "",
            enlace_drive: item.enlace_drive || "",
            enlace_formulario: item.enlace_formulario || ""
          })).filter(opp => 
            opp.status.toLowerCase().trim() === "abierta" && 
            (
              (opp.programa && opp.programa.toLowerCase().trim() === slug.toLowerCase().trim()) ||
              (PROGRAM_DATA[slug] && opp.programa && opp.programa.toLowerCase().trim() === PROGRAM_DATA[slug].title.toLowerCase().trim())
            )
          );
          setOportunidades(activeOpps);
        }
      } catch (e) {
        console.error("Error cargando convocatorias para el detalle de programa", e);
      }
      setIsLoadingOpps(false);
    }

    async function loadProgramCMS() {
      try {
        const progData = await fetchGoogleSheetData(GOOGLE_SHEETS_PROGRAMAS_CSV);
        const imagesMap = await fetchProgramImagesMap();
        
        const sheetProg = (progData && progData.length > 0) ? progData.find(item => 
          (item.id && item.id.toLowerCase().trim() === slug.toLowerCase().trim()) ||
          (item.titulo && item.titulo.toLowerCase().trim().includes(slug.replace("-", " ").toLowerCase().trim()))
        ) : null;

        const customIcon = imagesMap[slug] || (sheetProg && (sheetProg.icono || sheetProg.imagen || sheetProg.enlace_imagen_drive)) || PROGRAM_DATA[slug]?.icon;

        if (sheetProg) {
          const updated = {
            ...PROGRAM_DATA[slug],
            title: sheetProg.titulo || PROGRAM_DATA[slug]?.title,
            desc: sheetProg.descripcion || PROGRAM_DATA[slug]?.desc,
            obj: sheetProg.objetivo || PROGRAM_DATA[slug]?.obj,
            population: sheetProg.poblacion || PROGRAM_DATA[slug]?.population,
            location: sheetProg.lugar || PROGRAM_DATA[slug]?.location,
            allies: sheetProg.aliados || PROGRAM_DATA[slug]?.allies,
            status: sheetProg.estado || PROGRAM_DATA[slug]?.status,
            icon: customIcon
          };
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`fepv_cache_program_${slug}`, JSON.stringify(updated));
            } catch(e){}
          }
          setProgram(updated);
        } else {
          const updated = {
            ...PROGRAM_DATA[slug],
            icon: customIcon
          };
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`fepv_cache_program_${slug}`, JSON.stringify(updated));
            } catch(e){}
          }
          setProgram(updated);
        }
      } catch (e) {
        console.error("Error cargando detalles del CMS de programas", e);
      }
    }

    if (slug) {
      // Cargar caché local instantáneamente antes de la petición de red
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem(`fepv_cache_program_${slug}`);
          if (cached) {
            setProgram(JSON.parse(cached));
          }
        } catch(e){}
      }
      loadOpps();
      loadProgramCMS();
    }
  }, [slug]);

  const isImageUrl = (str) => {
    if (!str) return false;
    return str.startsWith("http") || str.includes("drive.google.com") || str.includes("lh3.googleusercontent.com");
  };

  if (!program) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4 space-y-6">
        <span className="text-6xl">🔍</span>
        <h1 className="font-display font-bold text-2xl text-fepv-darkblue">Programa no encontrado</h1>
        <p className="text-sm text-fepv-gray/80 max-w-md text-center">
          La línea de acción o proyecto que buscas no está registrada en nuestro portafolio institucional.
        </p>
        <Link href="/programas" className="fepv-btn fepv-btn-primary py-2.5">
          Volver a programas
        </Link>
      </div>
    );
  }

  // ODS mapper
  const ODS_LIST = {
    3: { name: "Salud y Bienestar", color: "bg-red-500 text-white" },
    4: { name: "Educación de Calidad", color: "bg-red-600 text-white" },
    5: { name: "Igualdad de Género", color: "bg-orange-500 text-white" },
    6: { name: "Agua Limpia y Saneamiento", color: "bg-cyan-500 text-white" },
    8: { name: "Trabajo Decente y Crecimiento Económico", color: "bg-red-800 text-white" },
    10: { name: "Reducción de las Desigualdades", color: "bg-pink-600 text-white" },
    11: { name: "Ciudades y Comunidades Sostenibles", color: "bg-orange-400 text-white" },
    13: { name: "Acción por el Clima", color: "bg-green-700 text-white" },
    15: { name: "Vida de Ecosistemas Terrestres", color: "bg-green-500 text-white" },
    16: { name: "Paz, Justicia e Instituciones Sólidas", color: "bg-blue-700 text-white" }
  };

  return (
    <div className="w-full bg-gray-50 pb-20 min-h-screen">
      
      {/* Banner Superior del Programa */}
      <section className="bg-gradient-to-br from-fepv-dark to-fepv-darkblue text-white py-20 relative overflow-hidden">
        {/* Adorno de fondo */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-fepv-green/10 rounded-l-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10 text-left">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-fepv-light/80">
            <Link href="/" className="hover:underline">Inicio</Link>
            <span>/</span>
            <Link href="/programas" className="hover:underline">Programas</Link>
            <span>/</span>
            <span className="text-white font-bold">{program.category}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
            {/* Contenido de Texto (Izquierda) */}
            <div className="md:col-span-8 space-y-4 order-2 md:order-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-black text-fepv-green uppercase tracking-widest bg-fepv-green/10 border border-fepv-green/20 px-3 py-1 rounded-md">
                  Proyecto {program.code}
                </span>
                <span className={`inline-block text-xs font-bold px-3.5 py-1 rounded-full border ${program.statusColor}`}>
                  {program.status}
                </span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5.5xl lg:text-6.5xl leading-tight text-white">
                {program.title}
              </h1>
              
              <p className="font-sans text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
                {program.subtitle}
              </p>
            </div>

            {/* Contenedor del Logo (Derecha en Desktop, Arriba en Mobile) */}
            <div className="md:col-span-4 flex justify-center md:justify-end order-1 md:order-2">
              {program && isImageUrl(program.icon) ? (
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-full p-5 shadow-[0_20px_50px_rgba(8,_112,_184,_0.35)] border-4 border-white/10 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                  <img 
                    src={getDirectDriveImageUrl(program.icon)} 
                    alt={program.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <span className="text-7xl p-8 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center min-w-[130px] min-h-[130px] shadow-lg border border-white/10">
                  {program?.icon}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid del Desafío y Respuesta */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* El Desafío */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded inline-block">
                El Desafío Regional
              </span>
              <h3 className="font-display font-bold text-lg text-fepv-darkblue">¿Qué problemática enfrentamos?</h3>
              <p className="text-xs sm:text-sm text-fepv-gray/80 leading-relaxed">
                {program.challenge}
              </p>
            </div>
            <div className="w-12 h-1 bg-red-400 rounded-full"></div>
          </div>

          {/* Nuestra Respuesta */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-fepv-green uppercase tracking-widest bg-fepv-light px-2 py-1 rounded inline-block">
                Nuestra Respuesta
              </span>
              <h3 className="font-display font-bold text-lg text-fepv-darkblue">¿Cómo intervenimos?</h3>
              <p className="text-xs sm:text-sm text-fepv-gray/80 leading-relaxed">
                {program.response}
              </p>
            </div>
            <div className="w-12 h-1 bg-fepv-green rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Componentes (¿Qué hacemos?) */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="mb-8 space-y-2">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-fepv-darkblue">
            Componentes del Proyecto
          </h2>
          <p className="text-xs sm:text-sm text-fepv-gray/70">
            Líneas de trabajo estructuradas que componen el funcionamiento de {program.title}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {program.components.map((comp, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-3 flex flex-col justify-between hover:border-fepv-green/20 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-2">
                <span className="text-lg bg-fepv-light text-fepv-green w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <h4 className="font-display font-bold text-sm text-fepv-darkblue">
                  {comp.title}
                </h4>
                <p className="text-xs text-fepv-gray/75 leading-relaxed">
                  {comp.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ficha Técnica e Indicadores */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Ficha Técnica */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm text-left space-y-6">
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">Ficha Técnica</h3>
            
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold text-fepv-blue uppercase tracking-wider block">📍 Territorio Inicial</span>
                <span className="text-fepv-darkblue font-semibold">{program.location}</span>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold text-fepv-blue uppercase tracking-wider block">👥 Población Destinataria</span>
                <span className="text-fepv-gray/95 font-medium leading-relaxed block">{program.population}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold text-fepv-blue uppercase tracking-wider block">🤝 Aliados Estratégicos</span>
                <span className="text-fepv-gray/95 font-medium leading-relaxed block">{program.allies}</span>
              </div>
            </div>

            {/* ODS */}
            {program.ods && (
              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] font-bold text-fepv-darkblue uppercase tracking-widest">ODS Relacionados</h4>
                <div className="flex flex-wrap gap-2">
                  {program.ods.map(num => {
                    const odsItem = ODS_LIST[num];
                    return (
                      <span 
                        key={num} 
                        className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${odsItem?.color || "bg-gray-100 text-gray-700"}`}
                        title={odsItem?.name || ""}
                      >
                        ODS {num}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Indicadores / Resultados */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm text-left space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-fepv-darkblue">Resultados e Indicadores</h3>
              <p className="text-xs text-fepv-gray/70">
                Medimos nuestro impacto de manera responsable y transparente bajo los siguientes criterios:
              </p>
              
              <ul className="space-y-3">
                {program.indicators.map((ind, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-fepv-gray/90 leading-relaxed">
                    <span className="text-fepv-green font-bold text-base mt-0.5">✔</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Advertencia especial */}
            {program.important && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-250/20 text-[11px] text-amber-800 leading-relaxed font-semibold italic mt-4">
                ⚠ {program.important}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Convocatorias Abiertas en Vivo en este programa */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="mb-6 space-y-2">
          <h2 className="font-display font-bold text-xl text-fepv-darkblue flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            Convocatorias Activas en esta Línea
          </h2>
          <p className="text-xs text-fepv-gray/70">
            Postúlate directamente a las vacantes de empleo, voluntariado o cursos de formación disponibles para esta área.
          </p>
        </div>

        {isLoadingOpps ? (
          <div className="flex justify-center items-center py-6">
            <div className="w-6 h-6 border-2 border-fepv-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : oportunidades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {oportunidades.map(opp => (
              <div 
                key={opp.id} 
                className="bg-white border border-gray-150 p-5 rounded-2xl flex justify-between items-center gap-4 shadow-sm hover:border-fepv-green/30 transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-fepv-green uppercase tracking-wider bg-fepv-light px-2 py-0.5 rounded inline-block">
                    {opp.categoria}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-fepv-darkblue leading-tight">{opp.title}</h4>
                  {opp.deadline && (
                    <p className="text-[10px] text-fepv-gray/60 font-semibold">Plazo: {opp.deadline}</p>
                  )}
                </div>
                <a 
                  href={opp.enlace_formulario || opp.enlace_drive || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] font-bold bg-fepv-green hover:bg-fepv-darkblue text-white px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Postularse
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white border border-gray-150 rounded-2xl text-xs text-fepv-gray/60">
            No hay convocatorias de inscripción abiertas en esta línea por el momento.
          </div>
        )}
      </section>

      {/* Identificador de alianzas y footer */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-fepv-green/10 to-transparent border border-fepv-green/20 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <span className="text-4xl">🤝</span>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-fepv-darkblue">
              Los grandes cambios se construyen en alianza
            </h3>
            <p className="text-xs sm:text-sm text-fepv-gray/80 leading-relaxed">
              FEPV trabaja activamente con entidades públicas, privadas, de cooperación internacional y organizaciones sociales locales para expandir el impacto del proyecto <strong>{program.title}</strong>.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link 
              href="/participa?rol=aliado"
              className="fepv-btn fepv-btn-primary py-3 px-6 text-xs font-bold shadow-md shadow-fepv-green/15"
            >
              🤝 Soy una entidad y quiero hacer una alianza
            </Link>
            <Link 
              href="/donaciones"
              className="fepv-btn bg-white text-fepv-darkblue hover:bg-gray-50 border border-gray-250 py-3 px-6 text-xs font-bold shadow-sm"
            >
              💚 Quiero apoyar este proyecto
            </Link>
            <Link 
              href={`/participa?rol=beneficiario&programa=${program.id}`}
              className="fepv-btn bg-fepv-blue text-white hover:bg-fepv-darkblue py-3 px-6 text-xs font-bold shadow-sm"
            >
              🙋 Quiero participar
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
