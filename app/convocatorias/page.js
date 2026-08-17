"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchGoogleSheetData, GOOGLE_SHEETS_CONVOCATORIAS_CSV, GOOGLE_SHEETS_OFERTAS_CSV, getDirectDriveImageUrl } from "../../lib/api";
import { useGlobalConfig } from "../../components/ConfigContext";
import { toJpeg } from "html-to-image";

function OportunidadesClient() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [convocatorias, setConvocatorias] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros y Paginación
  const [filterMunicipio, setFilterMunicipio] = useState("");
  const [filterCargo, setFilterCargo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Exportar a imagen
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef(null); // Para Ofertas
  const printRefResumen = useRef(null); // Para Resumen General

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
          const validConvs = normalizedConvs.filter(c => c.titulo);
          setConvocatorias(validConvs);
        }

        if (dataOfertas && dataOfertas.length > 0) {
          const normalizedOfertas = dataOfertas.map(row => {
            const obj = {};
            for (let k in row) {
              obj[k.toLowerCase().trim()] = row[k];
            }
            return obj;
          });

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

  const municipiosMap = {};
  ofertas.forEach(o => {
    const mun = (o.municipio || "CESAR").toUpperCase().trim();
    municipiosMap[mun] = true;
  });
  const uniqueMunicipios = Object.keys(municipiosMap).sort();

  // Lógica de Paginación y Filtrado
  const filteredOfertas = ofertas.filter(o => {
    const matchMun = filterMunicipio === "" || (o.municipio || "").toLowerCase().includes(filterMunicipio.toLowerCase());
    const matchCargo = filterCargo === "" || (o.titulo_vacante || o.cargo || "").toLowerCase().includes(filterCargo.toLowerCase());
    return matchMun && matchCargo;
  });

  const totalPages = Math.ceil(filteredOfertas.length / itemsPerPage) || 1;
  const currentOfertas = filteredOfertas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const googleDriveLink = config?.banner_oportunidades_url || ""; 
  const bgImageUrl = googleDriveLink ? getDirectDriveImageUrl(googleDriveLink) : null;

  const handleExport = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    
    // Forzar renderizado y esperar
    setTimeout(async () => {
      try {
        const dataUrl = await toJpeg(printRef.current, { 
          quality: 0.95,
          backgroundColor: '#ffffff',
          width: 1000,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: '1000px'
          }
        });
        const link = document.createElement("a");
        link.download = `ofertas-empleo-fepv-pagina-${currentPage}.jpg`;
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.error("Error al exportar imagen:", e);
        alert("Hubo un error al generar la imagen. El diseño actual podría tener estilos no soportados por el exportador.");
      }
      setIsExporting(false);
    }, 200);
  };

  const handleExportResumen = async () => {
    if (!printRefResumen.current) return;
    setIsExporting(true);
    
    setTimeout(async () => {
      try {
        const dataUrl = await toJpeg(printRefResumen.current, { 
          quality: 0.95,
          backgroundColor: '#ffffff',
          style: { transform: 'scale(1)', transformOrigin: 'top left' }
        });
        const link = document.createElement("a");
        link.download = `boletin-resumen-fepv.jpg`;
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.error("Error al exportar resumen:", e);
        alert("Hubo un error al generar el boletín.");
      }
      setIsExporting(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 relative">
      
      {/* EXPORT TEMPLATE (HIDDEN) */}
      <div className="absolute top-[-9999px] left-[-9999px] w-[1000px] z-[-1]" aria-hidden="true">
        <div ref={printRef} className="bg-white w-[1000px] h-[1300px] flex flex-col justify-between" style={{ fontFamily: 'sans-serif' }}>
          
          <div className="flex flex-col gap-6 p-8">
            {/* Print Header */}
            <div className="flex bg-[#002f6c] text-white rounded-2xl overflow-hidden shadow-sm relative">
              <div className="w-1/3 bg-white p-6 flex items-center justify-center rounded-r-[50px] z-10 shadow-[5px_0_15px_rgba(0,0,0,0.2)]">
                 {/* Usamos directamente la ruta local con el basePath para evitar 404 en GitHub Pages */}
                 <img src="/fepv.org.co/logo.png" alt="Logo FEPV" style={{ height: '100px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            <div className="w-2/3 p-8 flex flex-col justify-center relative">
              <div className="absolute top-4 right-4 bg-[#8cc63f] text-white px-6 py-2 rounded-xl text-center">
                 <div className="text-sm font-bold uppercase">Página</div>
                 <div className="text-xl font-black">{currentPage} DE {totalPages}</div>
              </div>
              <h1 className="text-5xl font-black uppercase tracking-tight leading-none mb-2">BUSCA<br/>OPORTUNIDADES <span className="text-[#8cc63f]">| {filterMunicipio || 'CESAR'}</span></h1>
              <div className="flex gap-4 mt-4">
                 <div className="flex items-center gap-2 text-sm font-bold"><span className="w-5 h-5 bg-[#8cc63f] rounded-full flex items-center justify-center text-white text-xs">✓</span> Información verificada</div>
                 <div className="flex items-center gap-2 text-sm font-bold"><span className="w-5 h-5 bg-[#0065ff] rounded-full flex items-center justify-center text-white text-xs">●</span> Gratuita</div>
                 <div className="flex items-center gap-2 text-sm font-bold"><span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">●</span> Para todos</div>
              </div>
            </div>
          </div>

          {/* Green Title Bar */}
          <div className="bg-[#2d7a2d] text-white text-center py-3 rounded-xl font-bold text-xl uppercase tracking-widest shadow-sm flex items-center justify-center gap-4">
            <span className="text-3xl">💼</span> 
            {filterCargo ? `RESULTADOS PARA: ${filterCargo}` : 'OFERTAS DE EMPLEO ACTIVAS'}
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002f6c] text-white text-xs uppercase tracking-wider">
                  <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">#</th>
                  <th className="px-4 py-4 font-bold border-r border-[#001f4d]">Código</th>
                  <th className="px-4 py-4 font-bold w-1/3 border-r border-[#001f4d]">Vacantes</th>
                  <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">Rango Salarial</th>
                  <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">Cantidad</th>
                  <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">Municipio</th>
                  <th className="px-4 py-4 font-bold text-center">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {currentOfertas.map((o, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-5 border-r border-gray-200 text-center">
                      <div className="bg-[#8cc63f] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold mx-auto">{(currentPage - 1) * itemsPerPage + idx + 1}</div>
                    </td>
                    <td className="px-4 py-5 font-mono text-sm text-gray-700 border-r border-gray-200">{o.codigo_vacante || '-'}</td>
                    <td className="px-4 py-5 border-r border-gray-200">
                      <div className="font-bold text-[#002f6c] text-base leading-tight">{o.titulo_vacante || o.cargo || 'Sin título'}</div>
                      <div className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider font-bold">{o.nombre_prestador || 'Agencia de Empleo'}</div>
                    </td>
                    <td className="px-4 py-5 text-center font-bold text-gray-700 border-r border-gray-200">{o.rango_salarial || 'A Convenir'}</td>
                    <td className="px-4 py-5 text-center font-black text-xl text-[#002f6c] border-r border-gray-200">{o.cantidad_vacantes || '1'}</td>
                    <td className="px-4 py-5 text-center text-gray-700 font-bold uppercase text-xs tracking-wider border-r border-gray-200">{o.municipio || 'CESAR'}</td>
                    <td className="px-4 py-5 text-center text-gray-700 font-medium text-sm">{o.fecha_vencimiento || '-'}</td>
                  </tr>
                ))}
                {/* Rellenar filas vacías si hay menos de 10 */}
                {Array.from({ length: Math.max(0, itemsPerPage - currentOfertas.length) }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className={currentOfertas.length % 2 === 0 ? (idx % 2 === 0 ? 'bg-gray-50' : 'bg-white') : (idx % 2 !== 0 ? 'bg-gray-50' : 'bg-white')}>
                    <td className="px-4 py-5 border-r border-gray-200 h-[72px]"></td><td className="px-4 py-5 border-r border-gray-200"></td><td className="px-4 py-5 border-r border-gray-200"></td><td className="px-4 py-5 border-r border-gray-200"></td><td className="px-4 py-5 border-r border-gray-200"></td><td className="px-4 py-5 border-r border-gray-200"></td><td className="px-4 py-5"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="bg-[#002f6c] text-white rounded-2xl p-6 flex items-center justify-between shadow-sm">
             <div>
                <h3 className="font-black text-2xl mb-1">Fundación Encuentros Para La Vida</h3>
                <p className="text-[#8cc63f] italic font-medium">¡Juntos transformamos vidas! 🍃</p>
             </div>
             <div className="space-y-2 text-sm font-medium border-l border-white/20 pl-6">
                <div className="flex items-center gap-3"><span>📞</span> {config?.telefono_contacto}</div>
                <div className="flex items-center gap-3"><span>✉️</span> {config?.correo_contacto}</div>
                <div className="flex items-center gap-3"><span>📍</span> {config?.direccion_fisica}</div>
             </div>
          </div>
          
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2d7a2d] rounded-full flex items-center justify-center text-2xl text-white">🛡️</div>
                <div>
                   <span className="font-bold text-[#002f6c] text-sm block">Recuerda: Busca el empleo de tu preferencia con el código en el portal oficial:</span>
                   <span className="font-bold text-[#2d7a2d] text-base">https://www.buscadordeempleo.gov.co/#/home</span>
                </div>
             </div>
             <div className="text-right text-xs font-bold text-gray-400 uppercase">
                Comparta<br/>esta información
             </div>
          </div>
          </div>
        </div>
      </div>
      {/* END EXPORT TEMPLATE */}

      {/* HEADER SECTION (IMAGEN COMPLETAMENTE VISIBLE) */}
      <section 
        className="relative flex items-center justify-center bg-fepv-darkblue overflow-hidden"
        style={{
          minHeight: bgImageUrl ? '250px' : 'auto',
          paddingTop: bgImageUrl ? '0' : '6rem',
          paddingBottom: bgImageUrl ? '0' : '4rem',
          backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : 'none', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Solo mostramos texto si NO hay imagen de fondo */}
        {!bgImageUrl && (
          <div className="max-w-7xl mx-auto text-center space-y-4 px-4 relative z-10 text-white">
            <span className="text-fepv-green font-bold tracking-wider uppercase text-sm drop-shadow-md">Portal de Oportunidades</span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight drop-shadow-lg">
              Encuentra tu próximo desafío
            </h1>
            <p className="text-gray-200 max-w-2xl mx-auto text-base sm:text-lg drop-shadow-md">
              Explora las vacantes de empleo en el Cesar, oportunidades de voluntariado y convocatorias exclusivas de la Fundación.
            </p>
          </div>
        )}
      </section>

      {/* TABS NAVIGATION (BOTONES COLORIDOS) */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-3 sm:gap-6">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`flex items-center gap-2 py-3 px-6 rounded-full font-bold text-sm sm:text-base transition-all shadow-sm ${activeTab === "resumen" ? "bg-fepv-green text-white shadow-md transform scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            📊 Resumen General
          </button>
          <button
            onClick={() => setActiveTab("ofertas")}
            className={`flex items-center gap-2 py-3 px-6 rounded-full font-bold text-sm sm:text-base transition-all shadow-sm ${activeTab === "ofertas" ? "bg-fepv-blue text-white shadow-md transform scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            💼 Ofertas de Empleo
          </button>
          <button
            onClick={() => setActiveTab("convocatorias")}
            className={`flex items-center gap-2 py-3 px-6 rounded-full font-bold text-sm sm:text-base transition-all shadow-sm ${activeTab === "convocatorias" ? "bg-fepv-orange text-white shadow-md transform scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
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
                <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                  
                  {/* Botón Exportar Boletín */}
                  <div className="flex justify-end mb-4">
                    <button 
                      onClick={handleExportResumen}
                      disabled={isExporting}
                      className="bg-[#2d7a2d] hover:bg-[#1e5c1e] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? "Generando..." : "⬇️ Exportar Boletín"}
                    </button>
                  </div>

                  <div ref={printRefResumen} className="bg-gray-50 p-6 sm:p-10 space-y-6 rounded-3xl" style={{ fontFamily: 'sans-serif' }}>
                    <div className="bg-[#002f6c] rounded-t-[40px] rounded-br-[40px] rounded-bl-sm p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left space-y-4">
                          <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl w-max">
                             <img src="/fepv.org.co/logo.png" alt="Logo FEPV" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
                          </div>
                          <h2 className="font-display font-black text-4xl md:text-6xl uppercase leading-none tracking-tight">
                            Oportunidades<br/>
                            <span className="text-[#8cc63f]">De Empleo</span><br/>
                            En El Cesar
                          </h2>
                          <div className="inline-block bg-[#001f4d] text-white font-bold px-6 py-2 rounded-full text-sm sm:text-base border border-[#003876]">
                            Impulsamos oportunidades, construimos futuro
                          </div>
                        </div>
                      </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#2d7a2d] text-white rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-md transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setActiveTab("ofertas")}>
                      <div className="text-6xl opacity-90">💼</div>
                      <div className="flex-1 flex items-center gap-6">
                        <div className="text-6xl sm:text-7xl font-black leading-none">{totalOfertas}</div>
                        <div className="text-sm sm:text-base font-bold uppercase tracking-wider leading-tight border-l-2 border-white/30 pl-4">
                          Ofertas<br/>De Empleo<br/>Disponibles
                        </div>
                      </div>
                    </div>

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
                </div>
              )}

              {/* VISTA 2: OFERTAS DE EMPLEO (TABLA DIRECTORIO) */}
              {activeTab === "ofertas" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Encabezado y Filtros */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      <div>
                        <span className="text-fepv-blue font-bold text-sm tracking-widest uppercase mb-1 block">Buscador Oficial</span>
                        <h2 className="font-display font-bold text-3xl text-fepv-darkblue uppercase">Busca Oportunidades</h2>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <span className="text-xs font-bold text-gray-600 flex items-center gap-1"><span className="text-fepv-green text-lg">✓</span> Verificada</span>
                          <span className="text-xs font-bold text-gray-600 flex items-center gap-1"><span className="text-fepv-blue text-lg">●</span> Gratuita</span>
                        </div>
                      </div>
                      
                      {/* Filtros */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <select 
                          value={filterMunicipio}
                          onChange={(e) => { setFilterMunicipio(e.target.value); setCurrentPage(1); }}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-fepv-blue focus:border-fepv-blue block w-full sm:w-48 p-3 outline-none"
                        >
                          <option value="">Todos los Municipios</option>
                          {uniqueMunicipios.map((m, idx) => (
                            <option key={idx} value={m}>{m}</option>
                          ))}
                        </select>
                        <div className="relative w-full sm:w-64">
                          <input 
                            type="text" 
                            placeholder="Buscar cargo o palabra clave..." 
                            value={filterCargo}
                            onChange={(e) => { setFilterCargo(e.target.value); setCurrentPage(1); }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-fepv-blue focus:border-fepv-blue block w-full p-3 pl-10 outline-none"
                          />
                          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                        </div>
                        <button 
                          onClick={handleExport}
                          disabled={isExporting || currentOfertas.length === 0}
                          className="bg-[#2d7a2d] hover:bg-[#1e5c1e] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isExporting ? "Generando..." : "⬇️ Exportar Imagen"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tabla */}
                  {filteredOfertas.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center shadow-sm">
                      <span className="text-6xl mb-4 block">📭</span>
                      <h3 className="text-xl font-bold text-gray-700">No se encontraron ofertas</h3>
                      <p className="text-gray-500 mt-2">Intenta ajustar los filtros de búsqueda.</p>
                      <button onClick={() => { setFilterCargo(""); setFilterMunicipio(""); }} className="mt-4 text-fepv-blue font-bold hover:underline">Limpiar Filtros</button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead>
                            <tr className="bg-[#002f6c] text-white text-xs uppercase tracking-wider">
                              <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">#</th>
                              <th className="px-4 py-4 font-bold border-r border-[#001f4d]">Código</th>
                              <th className="px-4 py-4 font-bold w-1/3 border-r border-[#001f4d]">Vacantes</th>
                              <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">Rango Salarial</th>
                              <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">Cantidad</th>
                              <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">Municipio</th>
                              <th className="px-4 py-4 font-bold text-center border-r border-[#001f4d]">Vencimiento</th>
                              <th className="px-4 py-4 font-bold text-center">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 text-sm">
                            {currentOfertas.map((o, idx) => {
                              const st = (o.estado || "").toLowerCase().trim();
                              const isUrgent = st.includes("urgente");
                              return (
                                <tr key={idx} className={`transition-colors ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-fepv-light/20`}>
                                  <td className="px-4 py-4 font-bold text-gray-500 text-center border-r border-gray-200">
                                    <div className="bg-[#8cc63f] text-white w-7 h-7 rounded-lg flex items-center justify-center mx-auto">{(currentPage - 1) * itemsPerPage + idx + 1}</div>
                                  </td>
                                  <td className="px-4 py-4 font-mono text-xs text-gray-600 border-r border-gray-200">{o.codigo_vacante || '-'}</td>
                                  <td className="px-4 py-4 border-r border-gray-200">
                                    <div className="font-bold text-[#002f6c]">{o.titulo_vacante || o.cargo || 'Sin título'}</div>
                                    <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">{o.nombre_prestador || 'Agencia de Empleo'}</div>
                                    {isUrgent && <span className="inline-block mt-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">URGENTE</span>}
                                  </td>
                                  <td className="px-4 py-4 font-bold text-gray-700 text-center border-r border-gray-200">{o.rango_salarial || 'A Convenir'}</td>
                                  <td className="px-4 py-4 text-center font-black text-lg text-[#002f6c] border-r border-gray-200">{o.cantidad_vacantes || '1'}</td>
                                  <td className="px-4 py-4 text-gray-700 uppercase font-bold text-xs tracking-wider text-center border-r border-gray-200">{o.municipio || 'CESAR'}</td>
                                  <td className="px-4 py-4 text-gray-600 text-xs text-center border-r border-gray-200">{o.fecha_vencimiento || '-'}</td>
                                  <td className="px-4 py-4 text-center">
                                    {o.url_detalle_vacante || o.enlace ? (
                                      <Link 
                                        href={o.url_detalle_vacante || o.enlace || "#"} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-[#002f6c] hover:bg-[#001f4d] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
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

                      {/* Controles de Paginación */}
                      <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600 font-medium">
                          Mostrando <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredOfertas.length)}</span> de <span className="font-bold">{filteredOfertas.length}</span> ofertas
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                             disabled={currentPage === 1}
                             className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors"
                           >
                             Anterior
                           </button>
                           <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-[#002f6c]">
                             {currentPage} / {totalPages}
                           </div>
                           <button 
                             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                             disabled={currentPage === totalPages}
                             className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors"
                           >
                             Siguiente
                           </button>
                        </div>
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
