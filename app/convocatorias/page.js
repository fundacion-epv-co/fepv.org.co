"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchGoogleSheetData, GOOGLE_SHEETS_CONVOCATORIAS_CSV, GOOGLE_SHEETS_OFERTAS_CSV } from "../../lib/api";

function OportunidadesClient() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [convocatorias, setConvocatorias] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  useEffect(() => {
    if (catParam) {
      if (catParam.toLowerCase() === "empleo") setActiveTab("ofertas");
      else if (catParam.toLowerCase() === "convocatoria") setActiveTab("convocatorias");
    }
  }, [catParam]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        const [dataConvs, dataOfertas] = await Promise.all([
          fetchGoogleSheetData(GOOGLE_SHEETS_CONVOCATORIAS_CSV),
          fetchGoogleSheetData(GOOGLE_SHEETS_OFERTAS_CSV)
        ]);

        if (dataConvs && dataConvs.length > 0) {
          // Filtrar las activas
          const validConvs = dataConvs.filter(c => c.titulo);
          setConvocatorias(validConvs);
        }

        if (dataOfertas && dataOfertas.length > 0) {
          // Filtrar vacantes válidas y que el estado no sea cerrado/oculto
          const validOfertas = dataOfertas.filter(o => {
            if (!o.titulo_vacante && !o.codigo_vacante) return false;
            const st = (o.estado || "").toLowerCase().trim();
            if (st === "inactiva" || st === "inactivo" || st === "cerrada" || st === "cerrado" || st === "oculta" || st === "oculto") return false;
            return true;
          });
          setOfertas(validOfertas);
        }

      } catch (e) {
        console.error("Error cargando oportunidades:", e);
      }

      setIsLoading(false);
    }
    loadData();
  }, []);

  const totalOfertas = ofertas.reduce((acc, curr) => acc + (parseInt(curr.cantidad_vacantes) || 1), 0);
  const activeConvocatorias = convocatorias.filter(c => (c.estado || "").toLowerCase().includes("abierta") || (c.estado || "").toLowerCase().includes("activa")).length;

  // Municipios únicos de ofertas
  const municipiosMap = {};
  ofertas.forEach(o => {
    const mun = (o.municipio || "CESAR").toUpperCase().trim();
    municipiosMap[mun] = true;
  });
  const uniqueMunicipios = Object.keys(municipiosMap).sort();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* HEADER SECTION */}
      <section className="bg-fepv-darkblue text-white pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4 mt-8">
          <span className="text-fepv-green font-bold tracking-wider uppercase text-sm">Portal de Oportunidades</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Encuentra tu próximo desafío
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
            Explora las vacantes de empleo en el Cesar, oportunidades de voluntariado y convocatorias exclusivas de la Fundación.
          </p>
        </div>
      </section>

      {/* TABS NAVIGATION */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`whitespace-nowrap py-4 px-2 sm:px-6 font-bold text-sm sm:text-base border-b-4 transition-colors ${activeTab === "resumen" ? "border-fepv-green text-fepv-darkblue" : "border-transparent text-gray-500 hover:text-fepv-darkblue"}`}
          >
            📊 Resumen General
          </button>
          <button
            onClick={() => setActiveTab("ofertas")}
            className={`whitespace-nowrap py-4 px-2 sm:px-6 font-bold text-sm sm:text-base border-b-4 transition-colors ${activeTab === "ofertas" ? "border-fepv-blue text-fepv-darkblue" : "border-transparent text-gray-500 hover:text-fepv-darkblue"}`}
          >
            💼 Ofertas de Empleo
          </button>
          <button
            onClick={() => setActiveTab("convocatorias")}
            className={`whitespace-nowrap py-4 px-2 sm:px-6 font-bold text-sm sm:text-base border-b-4 transition-colors ${activeTab === "convocatorias" ? "border-fepv-orange text-fepv-darkblue" : "border-transparent text-gray-500 hover:text-fepv-darkblue"}`}
          >
            📢 Convocatorias
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fepv-darkblue"></div>
              <p className="text-gray-500 font-medium">Buscando oportunidades...</p>
            </div>
          ) : (
            <>
              {/* VISTA 1: RESUMEN (DASHBOARD) */}
              {activeTab === "resumen" && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Banner Principal Estilo Infografía */}
                  <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col lg:flex-row gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-fepv-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    
                    <div className="flex-1 space-y-8 relative z-10">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="bg-fepv-green text-white rounded-2xl p-6 flex-1 w-full sm:w-auto shadow-md transform hover:scale-105 transition-transform cursor-pointer" onClick={() => setActiveTab("ofertas")}>
                          <div className="text-5xl font-black mb-2">{totalOfertas}</div>
                          <div className="text-sm font-bold uppercase tracking-wide">Ofertas de Empleo<br/>Disponibles</div>
                        </div>
                        <div className="bg-fepv-blue text-white rounded-2xl p-6 flex-1 w-full sm:w-auto shadow-md transform hover:scale-105 transition-transform cursor-pointer" onClick={() => setActiveTab("convocatorias")}>
                          <div className="text-5xl font-black mb-2">{activeConvocatorias}</div>
                          <div className="text-sm font-bold uppercase tracking-wide">Convocatorias<br/>FEPV Activas</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h3 className="font-bold text-fepv-darkblue mb-4 flex items-center gap-2">
                          <span className="text-fepv-green text-xl">📍</span> Municipios con ofertas disponibles
                        </h3>
                        {uniqueMunicipios.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                            {uniqueMunicipios.map((m, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-fepv-blue"></div>
                                {m}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No hay municipios disponibles por el momento.</p>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-1/3 space-y-6 relative z-10 flex flex-col justify-between">
                      <div className="bg-fepv-light/30 rounded-2xl p-6 border border-fepv-green/20 text-center">
                        <div className="text-4xl mb-2 text-fepv-darkblue">💰</div>
                        <div className="text-xs font-bold text-fepv-green uppercase tracking-wider mb-1">Rango Salarial Promedio</div>
                        <div className="text-2xl font-black text-fepv-darkblue leading-tight">
                          $1.5 a $4 millones
                        </div>
                        <div className="text-xs text-gray-500 mt-2">(Según cargo y experiencia)</div>
                      </div>

                      <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-sm">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Agencias Aliadas</h4>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                          <div className="font-black text-xl text-[#0065ff] tracking-tight">Computrabajo</div>
                          <div className="font-black text-xl text-[#6e28d9] tracking-tight">magneto</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to action hacia las pestañas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                      onClick={() => setActiveTab("ofertas")}
                      className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:border-fepv-blue hover:shadow-md transition-all text-left flex items-center justify-between group"
                    >
                      <div>
                        <h3 className="font-display font-bold text-2xl text-fepv-darkblue mb-2 group-hover:text-fepv-blue transition-colors">Explorar Empleos</h3>
                        <p className="text-gray-500">Postúlate a las vacantes activas en el departamento del Cesar.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-full text-fepv-blue group-hover:bg-fepv-blue group-hover:text-white transition-colors flex-shrink-0 ml-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab("convocatorias")}
                      className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:border-fepv-orange hover:shadow-md transition-all text-left flex items-center justify-between group"
                    >
                      <div>
                        <h3 className="font-display font-bold text-2xl text-fepv-darkblue mb-2 group-hover:text-fepv-orange transition-colors">Explorar Convocatorias</h3>
                        <p className="text-gray-500">Participa en proyectos sociales, formaciones y becas de la FEPV.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-full text-fepv-orange group-hover:bg-fepv-orange group-hover:text-white transition-colors flex-shrink-0 ml-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* VISTA 2: OFERTAS DE EMPLEO (TABLA DIRECTORIO) */}
              {activeTab === "ofertas" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                    <div>
                      <span className="text-fepv-blue font-bold text-sm tracking-widest uppercase mb-1 block">Parte 4 de 4</span>
                      <h2 className="font-display font-bold text-3xl text-fepv-darkblue uppercase">Busca Oportunidades | Cesar</h2>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1"><span className="text-fepv-green text-lg">✓</span> Información verificada</span>
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1"><span className="text-fepv-blue text-lg">●</span> Gratuita</span>
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1"><span className="text-fepv-orange text-lg">●</span> Para todos</span>
                      </div>
                    </div>
                  </div>

                  {ofertas.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center shadow-sm">
                      <span className="text-6xl mb-4 block">📭</span>
                      <h3 className="text-xl font-bold text-gray-700">No hay ofertas de empleo activas</h3>
                      <p className="text-gray-500 mt-2">Vuelve pronto para nuevas oportunidades o revisa las convocatorias de la Fundación.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead>
                            <tr className="bg-[#1f2937] text-white text-xs uppercase tracking-wider">
                              <th className="px-4 py-4 font-bold text-center">#</th>
                              <th className="px-4 py-4 font-bold">Código</th>
                              <th className="px-4 py-4 font-bold w-1/3">Vacantes</th>
                              <th className="px-4 py-4 font-bold">Rango Salarial</th>
                              <th className="px-4 py-4 font-bold text-center">Cantidad</th>
                              <th className="px-4 py-4 font-bold">Municipio</th>
                              <th className="px-4 py-4 font-bold">Vencimiento</th>
                              <th className="px-4 py-4 font-bold text-center">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                            {ofertas.map((o, idx) => {
                              const st = (o.estado || "").toLowerCase().trim();
                              const isUrgent = st.includes("urgente");
                              return (
                                <tr key={idx} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-fepv-light/20`}>
                                  <td className="px-4 py-4 font-bold text-gray-500 text-center">
                                    <div className="bg-[#8cc63f] text-white w-6 h-6 rounded-md flex items-center justify-center mx-auto">{idx + 1}</div>
                                  </td>
                                  <td className="px-4 py-4 font-mono text-xs text-gray-600">{o.codigo_vacante || '-'}</td>
                                  <td className="px-4 py-4">
                                    <div className="font-bold text-fepv-darkblue">{o.titulo_vacante || o.cargo || 'Sin título'}</div>
                                    <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{o.nombre_prestador || 'Agencia de Empleo'}</div>
                                    {isUrgent && <span className="inline-block mt-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">URGENTE</span>}
                                  </td>
                                  <td className="px-4 py-4 font-medium text-gray-700">{o.rango_salarial || 'A Convenir'}</td>
                                  <td className="px-4 py-4 text-center font-bold text-fepv-darkblue">{o.cantidad_vacantes || '1'}</td>
                                  <td className="px-4 py-4 text-gray-600 uppercase font-medium text-xs tracking-wider">{o.municipio || 'CESAR'}</td>
                                  <td className="px-4 py-4 text-gray-600 text-xs">{o.fecha_vencimiento || '-'}</td>
                                  <td className="px-4 py-4 text-center">
                                    {o.url_detalle_vacante || o.enlace ? (
                                      <Link 
                                        href={o.url_detalle_vacante || o.enlace || "#"} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-[#003876] hover:bg-fepv-darkblue text-white text-xs font-bold px-4 py-2 rounded transition-colors shadow-sm whitespace-nowrap"
                                      >
                                        Ver Oferta
                                      </Link>
                                    ) : (
                                      <span className="text-[10px] text-gray-400 font-bold uppercase">Sin Enlace</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg className="w-5 h-5 text-fepv-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          Recuerda buscar el empleo en el portal oficial con el código.
                        </div>
                        <div className="text-gray-400">Total listadas: {ofertas.length}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VISTA 3: CONVOCATORIAS (TARJETAS) */}
              {activeTab === "convocatorias" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                    <div>
                      <h2 className="font-display font-bold text-3xl text-fepv-darkblue">Convocatorias FEPV</h2>
                      <p className="text-gray-500">Participa en nuestros proyectos sociales, becas y voluntariados.</p>
                    </div>
                  </div>

                  {convocatorias.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center shadow-sm">
                      <span className="text-6xl mb-4 block">📣</span>
                      <h3 className="text-xl font-bold text-gray-700">No hay convocatorias activas</h3>
                      <p className="text-gray-500 mt-2">Pronto abriremos nuevos espacios de participación institucional.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {convocatorias.map((c, idx) => {
                        const st = (c.estado || "").toUpperCase();
                        let bgStatus = "bg-gray-100 text-gray-600";
                        if (st.includes("ABIERTA") || st.includes("ACTIVA")) bgStatus = "bg-fepv-green text-white";
                        if (st.includes("CERRADA")) bgStatus = "bg-red-100 text-red-600";
                        
                        return (
                          <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${bgStatus}`}>
                                {st || 'CONVOCATORIA'}
                              </span>
                            </div>
                            <h3 className="font-display font-bold text-xl text-fepv-darkblue mb-2 leading-tight">
                              {c.titulo}
                            </h3>
                            {c.categoria && (
                              <p className="text-xs font-bold text-fepv-orange uppercase tracking-wider mb-4">
                                {c.categoria}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                              {c.descripcion}
                            </p>
                            
                            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                              <div className="flex items-center gap-3 text-xs text-gray-600">
                                <span className="text-lg">📅</span> 
                                <div>
                                  <div className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Cierre</div>
                                  <strong className="text-gray-800">{c.cierre || c.fecha_cierre || 'No definido'}</strong>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-600">
                                <span className="text-lg">📍</span> 
                                <div>
                                  <div className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Lugar</div>
                                  <strong className="text-gray-800">{c.lugar || 'Por definir'}</strong>
                                </div>
                              </div>
                            </div>
                            
                            {(c.enlace || c.enlace_formulario) ? (
                              <Link 
                                href={c.enlace || c.enlace_formulario || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-center bg-fepv-orange hover:bg-[#d96704] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
                              >
                                Ver Detalles / Inscribirse
                              </Link>
                            ) : (
                              <button disabled className="w-full text-center bg-gray-100 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed text-sm">
                                Inscripciones Cerradas
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OportunidadesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>}>
      <OportunidadesClient />
    </Suspense>
  );
}
