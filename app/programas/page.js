"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { fetchGoogleSheetData, GOOGLE_SHEETS_CONVOCATORIAS_CSV, getDynamicPrograms } from "../../lib/api";

export default function Programas() {
  const [oportunidades, setOportunidades] = useState([]);
  const [isLoadingOpps, setIsLoadingOpps] = useState(true);

  // Obtener array de programas desde el estado
  const [programsList, setProgramsList] = useState([]);

  // Cargar oportunidades en vivo para cruzar conteo en badges
  useEffect(() => {
    async function loadOpps() {
      setIsLoadingOpps(true);
      try {
        const data = await fetchGoogleSheetData(GOOGLE_SHEETS_CONVOCATORIAS_CSV);
        if (data && data.length > 0) {
          const active = data.map(item => ({
            id: item.id || `OPP-${Math.random()}`,
            status: item.estado || "",
            programa: item.programa || ""
          })).filter(opp => opp.status.toLowerCase().trim() === "abierta");
          setOportunidades(active);
        }
      } catch (e) {
        console.error("Error cargando convocatorias para página de programas", e);
      }
      setIsLoadingOpps(false);
    }

    async function loadProgramsCMS() {
      try {
        const progData = await fetchGoogleSheetData(GOOGLE_SHEETS_PROGRAMAS_CSV);
        const imagesMap = await fetchProgramImagesMap();
        
        const merged = Object.values(PROGRAM_DATA).map(staticProg => {
          const sheetProg = (progData && progData.length > 0) ? progData.find(item => 
            (item.id && item.id.toLowerCase().trim() === staticProg.id.toLowerCase().trim()) ||
            (item.titulo && item.titulo.toLowerCase().trim().includes(staticProg.id.replace("-", " ").toLowerCase().trim()))
          ) : null;
          
          const customIcon = imagesMap[staticProg.id] || (sheetProg && (sheetProg.icono || sheetProg.imagen || sheetProg.enlace_imagen_drive)) || staticProg.icon;

          if (sheetProg) {
            return {
              ...staticProg,
              title: sheetProg.titulo || staticProg.title,
              desc: sheetProg.descripcion || staticProg.desc,
              obj: sheetProg.objetivo || staticProg.obj,
              population: sheetProg.poblacion || staticProg.population,
              location: sheetProg.lugar || staticProg.location,
              allies: sheetProg.aliados || staticProg.allies,
              status: sheetProg.estado || staticProg.status,
              icon: customIcon
            };
          }
          return {
            ...staticProg,
            icon: customIcon
          };
        });
        setProgramsList(merged);
      } catch (e) {
        console.error("Error cargando programas desde el CMS de Sheets", e);
      }
    }

    loadOpps();
    loadProgramsCMS();
  }, []);

  const isImageUrl = (str) => {
    if (!str) return false;
    return str.startsWith("http") || str.includes("drive.google.com") || str.includes("lh3.googleusercontent.com");
  };

  // Lista de estados sugeridos
  const statusLabels = {
    "En ejecución": { label: "En ejecución", color: "bg-emerald-500", text: "text-emerald-700 bg-emerald-50 border-emerald-100" },
    "En desarrollo": { label: "En desarrollo", color: "bg-blue-500", text: "text-blue-700 bg-blue-50 border-blue-100" },
    "En búsqueda de financiación": { label: "En búsqueda de financiación", color: "bg-amber-500", text: "text-amber-700 bg-amber-50 border-amber-100" },
    "Próximamente": { label: "Próximamente", color: "bg-gray-400", text: "text-gray-600 bg-gray-50 border-gray-150" }
  };

  // Los 3 Proyectos Destacados (Insignias)
  const featuredIds = ["medio-ambiente", "educacion", "emprendimiento"];
  const featuredProjects = programsList.filter(p => featuredIds.includes(p.id));

  return (
    <div className="w-full bg-gray-50 pb-20 min-h-screen">
      
      {/* Banner Superior */}
      <section className="bg-gradient-to-br from-fepv-dark to-fepv-darkblue text-white py-20 relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute left-0 bottom-0 top-0 w-1/4 bg-fepv-green/10 rounded-r-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight">
            Programas y Proyectos
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Iniciativas integrales estructuradas para transformar comunidades y promover el desarrollo sostenible en Agustín Codazzi y la región.
          </p>
        </div>
      </section>

      {/* Grid del Portafolio Completo (Las 8 Líneas de Acción) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] font-bold text-fepv-green uppercase tracking-widest bg-fepv-light px-2.5 py-1 rounded inline-block">
            Portafolio Institucional FEPV
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3.5xl text-fepv-darkblue">
            Nuestras Líneas Programáticas
          </h2>
          <p className="text-xs sm:text-sm text-fepv-gray/80">
            Conoce el portafolio de proyectos diseñado para el periodo 2026–2030, enfocado en dar soluciones reales y sostenibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programsList.map((p) => {
            const statusStyle = statusLabels[p.status] || statusLabels["Próximamente"];
            
            // Conteo de convocatorias activas para este programa
            const oppCount = oportunidades.filter(opp => 
              (opp.programa && opp.programa.toLowerCase().trim() === p.id.toLowerCase().trim()) ||
              (opp.programa && opp.programa.toLowerCase().trim() === p.title.toLowerCase().trim())
            ).length;

            return (
              <Link 
                key={p.id} 
                href={`/programas/${p.id}`}
                className="bg-white rounded-3xl border border-gray-150 p-6 flex flex-col justify-between hover:shadow-md hover:border-fepv-green/25 hover:scale-[1.02] transition-all duration-300 relative text-left group"
              >
                {/* Badge en vivo si hay convocatorias */}
                {oppCount > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white font-bold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="w-1 h-1 bg-white rounded-full"></span>
                    {oppCount} {oppCount === 1 ? 'oferta' : 'ofertas'}
                  </span>
                )}

                <div className="space-y-4">
                  {/* Icono grande y Categoría */}
                  <div className="flex items-center gap-3">
                    {isImageUrl(p.icon) ? (
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl group-hover:bg-fepv-light transition-colors overflow-hidden flex items-center justify-center p-2">
                        <img 
                          src={getDirectDriveImageUrl(p.icon)} 
                          alt={p.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-3xl p-2.5 bg-gray-50 rounded-2xl group-hover:bg-fepv-light transition-colors">
                        {p.icon}
                      </span>
                    )}
                    <div>
                      <span className="text-[9px] font-bold text-fepv-blue uppercase tracking-widest block">
                        {p.category}
                      </span>
                      <span className="text-[8px] font-mono text-fepv-gray/50">
                        {p.code}
                      </span>
                    </div>
                  </div>

                  {/* Título de Proyecto */}
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-fepv-darkblue group-hover:text-fepv-green transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-[10px] font-semibold text-fepv-gray/50 italic mt-0.5 truncate">
                      {p.subtitle.split("(")[0]}
                    </p>
                  </div>

                  {/* Descripción simple */}
                  <p className="text-xs text-fepv-gray/80 line-clamp-3 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                {/* Estado y Enlace */}
                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[9px] font-bold text-fepv-gray/70">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.color}`}></span>
                    {p.status}
                  </span>
                  
                  <span className="text-[11px] font-bold text-fepv-orange group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Ver proyecto &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sección: Proyectos Insignia (Destacados) */}
      <section className="py-16 bg-white border-t border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] font-bold text-fepv-blue uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded inline-block">
              Focos Estratégicos
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3.5xl text-fepv-darkblue">
              Proyectos Insignia FEPV
            </h2>
            <p className="text-xs sm:text-sm text-fepv-gray/70">
              Iniciativas de alto impacto priorizadas para el desarrollo comunitario y social del municipio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredProjects.map((p) => (
              <div 
                key={p.id}
                className="bg-gray-50 rounded-3xl border border-gray-150 p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {isImageUrl(p.icon) ? (
                      <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-2">
                        <img 
                          src={getDirectDriveImageUrl(p.icon)} 
                          alt={p.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-3xl p-3 bg-white rounded-2xl border border-gray-100 flex items-center justify-center">
                        {p.icon}
                      </span>
                    )}
                    <span className="text-[9px] font-black bg-fepv-orange text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                      ★ Insignia
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-fepv-blue uppercase tracking-widest block">
                      Línea {p.category}
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-fepv-darkblue leading-tight">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-fepv-gray/80 leading-relaxed">
                    {p.desc}
                  </p>

                  <div className="bg-white p-4 rounded-2xl border border-gray-200/50 space-y-1 text-xs">
                    <span className="text-fepv-green font-bold">🎯 Objetivo Principal:</span>
                    <p className="text-fepv-gray/90 leading-normal">{p.obj}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200/50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-fepv-green bg-fepv-light px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-fepv-green rounded-full"></span>
                    {p.status}
                  </span>
                  
                  <Link 
                    href={`/programas/${p.id}`}
                    className="fepv-btn fepv-btn-primary py-2 px-5 text-xs font-bold shadow-sm"
                  >
                    Conocer proyecto &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección "Buscamos Aliados" */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <span className="text-4xl block">🤝</span>
        <div className="space-y-3 max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-2xl sm:text-3.5xl text-fepv-darkblue">
            Los grandes cambios se construyen en alianza
          </h2>
          <p className="text-xs sm:text-sm text-fepv-gray/80 leading-relaxed">
            La Fundación Encuentros Para la Vida (FEPV) colabora de la mano con instituciones públicas, empresas del sector privado, entes territoriales, comunidades, universidades y organismos de cooperación internacional para convertir estas iniciativas en soluciones sostenibles en el Cesar.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/participa?rol=aliado"
            className="fepv-btn fepv-btn-primary py-3.5 px-6 text-xs font-bold shadow-md shadow-fepv-green/15"
          >
            🤝 Soy una entidad y quiero hacer una alianza
          </Link>
          <Link 
            href="/donaciones"
            className="fepv-btn bg-white text-fepv-darkblue hover:bg-gray-100 border border-gray-250 py-3.5 px-6 text-xs font-bold shadow-sm"
          >
            💚 Quiero apoyar un proyecto
          </Link>
          <Link 
            href="/participa?rol=beneficiario"
            className="fepv-btn bg-fepv-blue text-white hover:bg-fepv-darkblue py-3.5 px-6 text-xs font-bold shadow-sm"
          >
            🙋 Quiero participar
          </Link>
        </div>
      </section>

    </div>
  );
}
