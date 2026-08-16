"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchGoogleSheetData, GOOGLE_SHEETS_CONVOCATORIAS_CSV, GOOGLE_SHEETS_OFERTAS_CSV, getDirectDriveImageUrl } from "../../lib/api";
import { useGlobalConfig } from "../../components/ConfigContext";

function OportunidadesClient() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [convocatorias, setConvocatorias] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const config = useGlobalConfig();

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
          const normalizedConvs = dataConvs.map(row => {
            const obj = {};
            for (let k in row) {
              obj[k.toLowerCase().trim()] = row[k];
            }
            return obj;
          });
          // Filtrar las activas
          const validConvs = normalizedConvs.filter(c => c.titulo);
          setConvocatorias(validConvs);
        }

        if (dataOfertas && dataOfertas.length > 0) {
          // Normalizar las llaves a minúsculas
          const normalizedOfertas = dataOfertas.map(row => {
            const obj = {};
            for (let k in row) {
              obj[k.toLowerCase().trim()] = row[k];
            }
            return obj;
          });

          // Filtrar vacantes válidas y que el estado no sea cerrado/oculto
          const validOfertas = normalizedOfertas.filter(o => {
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

  // ==========================================
  // CONFIGURACIÓN DE IMAGEN DE FONDO
  // La URL viene desde ConfiguracionGlobal (gid=3001) bajo la clave: banner_oportunidades_url
  // ==========================================
  const googleDriveLink = config?.banner_oportunidades_url || ""; 
  const bgImageUrl = googleDriveLink ? getDirectDriveImageUrl(googleDriveLink) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* HEADER SECTION */}
      <section 
        className="relative pt-24 pb-16 px-4 bg-fepv-darkblue"
        style={bgImageUrl ? { 
          backgroundImage: `url(${bgImageUrl})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        } : {}}
      >
        {/* Overlay oscuro para que el texto sea legible si hay imagen */}
        {bgImageUrl && <div className="absolute inset-0 bg-black/60 z-0"></div>}
        
        <div className="max-w-7xl mx-auto text-center space-y-4 mt-8 relative z-10 text-white">
          <span className="text-fepv-green font-bold tracking-wider uppercase text-sm drop-shadow-md">Portal de Oportunidades</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight drop-shadow-lg">
            Encuentra tu próximo desafío
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto text-base sm:text-lg drop-shadow-md">
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
              {/* VISTA 1: RESUMEN (DASHBOARD) */}
              {activeTab === "resumen" && (
                <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                  
                  {/* Cabecera Principal */}
                  <div className="bg-[#002f6c] rounded-t-[40px] rounded-br-[40px] rounded-bl-sm p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left space-y-4">
                        <h2 className="font-display font-black text-4xl md:text-6xl uppercase leading-none tracking-tight">
                          Oportunidades<br/>
                          <span className="text-[#8cc63f]">De Empleo</span><br/>
                          En El Cesar
                        </h2>
                        <div className="inline-block bg-[#001f4d] text-white font-bold px-6 py-2 rounded-full text-sm sm:text-base border border-[#003876]">
                          Impulsamos oportunidades, construimos futuro
                        </div>
                      </div>
                      <div className="hidden md:block">
                         <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <span className="text-6xl">🎯</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Cifras Clave */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ofertas Disponibles (Caja Verde) */}
                    <div className="bg-[#2d7a2d] text-white rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-md transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setActiveTab("ofertas")}>
                      <div className="text-6xl opacity-90">💼</div>
                      <div className="flex-1 flex items-center gap-6">
                        <div className="text-6xl sm:text-7xl font-black leading-none">{totalOfertas}</div>
                        <div className="text-sm sm:text-base font-bold uppercase tracking-wider leading-tight border-l-2 border-white/30 pl-4">
                          Ofertas<br/>De Empleo<br/>Disponibles
                        </div>
                      </div>
                    </div>

                    {/* Rango Salarial (Caja Blanca) */}
                    <div className="bg-white text-fepv-darkblue rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-md border border-gray-200">
                      <div className="w-16 h-16 bg-[#002f6c] text-white rounded-full flex items-center justify-center text-3xl font-black shrink-0">
                        $
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Rango Salarial Promedio</div>
                        <div className="text-2xl sm:text-3xl font-black text-[#002f6c] leading-tight mb-1">
                          $ 1.5 a $4<br/>millones
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400 font-medium">(Según cargo y experiencia)</div>
                      </div>
                    </div>
                  </div>

                  {/* Municipios */}
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                       <span className="text-2xl text-[#2d7a2d]">📍</span>
                       <h3 className="font-black text-xl text-[#2d7a2d] uppercase tracking-wide">Municipios con ofertas disponibles</h3>
                    </div>
                    
                    <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-1 w-full">
                        {uniqueMunicipios.length > 0 ? (
                          <div className="columns-2 sm:columns-3 gap-8 space-y-4">
                            {uniqueMunicipios.map((m, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-bold uppercase tracking-wider break-inside-avoid">
                                <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                                {m}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center">No hay municipios disponibles por el momento.</p>
                        )}
                      </div>
                      
                      <div className="hidden md:flex w-1/3 justify-center border-l border-dashed border-gray-200 pl-8">
                         <div className="text-[120px] opacity-80 filter drop-shadow-md">🗺️</div>
                      </div>
                    </div>
                  </div>

                  {/* Agencias Aliadas */}
                  <div className="relative pt-6">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#002f6c] text-white text-xs font-bold px-6 py-2 rounded-full uppercase tracking-widest z-10">
                      Agencias de Empleo Aliadas
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 pt-10">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                        <div className="flex flex-col items-center justify-center py-4">
                           <span className="font-black text-2xl text-[#0065ff] tracking-tight">Computrabajo</span>
                           <span className="text-xs text-gray-400 mt-1">LeaderSearch</span>
                        </div>
                        <div className="flex flex-col items-center justify-center py-4">
                           <span className="font-black text-3xl text-[#6e28d9] tracking-tight lowercase">magneto</span>
                        </div>
                        <div className="flex flex-col items-center justify-center py-4">
                           <div className="flex items-center gap-1">
                              <span className="text-xl">🍂</span>
                              <span className="font-black text-xl text-red-600 uppercase tracking-tighter">Comfacesar</span>
                           </div>
                           <span className="text-[10px] text-gray-400 mt-1">Estamos cumpliendo sueños</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats / Info */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-wrap justify-center sm:justify-between items-center gap-6 shadow-sm">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-fepv-green text-white rounded-full flex items-center justify-center text-sm">✓</div>
                        <span className="text-xs font-bold text-gray-700">Información<br/>verificada</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#0065ff] text-white rounded-full flex items-center justify-center text-sm">🎁</div>
                        <span className="text-xs font-bold text-gray-700">Gratuita</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">👥</div>
                        <span className="text-xs font-bold text-gray-700">Para<br/>todos</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-fepv-green text-white rounded-full flex items-center justify-center text-sm">🤝</div>
                        <span className="text-xs font-bold text-gray-700">Comprometidos<br/>con tu futuro</span>
                     </div>
                  </div>
                  
                  {/* Convocatorias Call to Action */}
                  <div className="mt-8">
                    <button 
                      onClick={() => setActiveTab("convocatorias")}
                      className="w-full bg-[#002f6c] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all text-center group border border-[#001f4d]"
                    >
                      <h3 className="font-display font-bold text-2xl text-white mb-1 group-hover:text-fepv-orange transition-colors flex justify-center items-center gap-3">
                        Ver Convocatorias de la Fundación <span className="bg-white/10 p-2 rounded-full text-sm">➔</span>
                      </h3>
                      <p className="text-white/70 text-sm">Participa en proyectos sociales, formaciones y becas exclusivas.</p>
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
