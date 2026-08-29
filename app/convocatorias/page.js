"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchGoogleSheetData, GOOGLE_SHEETS_CONVOCATORIAS_CSV, GOOGLE_SHEETS_OFERTAS_CSV, GOOGLE_SHEETS_AGENCIAS_EMPLEO_CSV, getDirectDriveImageUrl } from "../../lib/api";
import { useGlobalConfig } from "../../components/ConfigContext";
import { toJpeg } from "html-to-image";

function OportunidadesClient() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [convocatorias, setConvocatorias] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros y Paginación
  const [filterMunicipio, setFilterMunicipio] = useState("");
  const [filterCargo, setFilterCargo] = useState("");
  const [filterSalario, setFilterSalario] = useState("");
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
        const [dataConvs, dataOfertas, dataAgencias] = await Promise.all([
          fetchGoogleSheetData(GOOGLE_SHEETS_CONVOCATORIAS_CSV),
          fetchGoogleSheetData(GOOGLE_SHEETS_OFERTAS_CSV),
          fetchGoogleSheetData(GOOGLE_SHEETS_AGENCIAS_EMPLEO_CSV)
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

        if (dataAgencias && dataAgencias.length > 0) {
          const normalizedAgencias = dataAgencias.map(row => {
            const obj = {};
            for (let k in row) {
              obj[k.toLowerCase().trim()] = row[k];
            }
            return obj;
          });
          // Solo tomar los que tengan nombre
          const validAgencias = normalizedAgencias.filter(a => a.nombre);
          setAgencias(validAgencias);
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
  const uniqueSalarios = Array.from(new Set(ofertas.map(o => (o.salario || "A convenir").trim()).filter(Boolean))).sort();
  const uniqueMunicipios = Object.keys(municipiosMap).sort();

  // Lógica de Paginación y Filtrado
  const filteredOfertas = ofertas.filter(o => {
    const matchMun = filterMunicipio === "" || (o.municipio || "").toLowerCase().includes(filterMunicipio.toLowerCase());
    const matchCargo = filterCargo === "" || (o.titulo_vacante || o.cargo || "").toLowerCase().includes(filterCargo.toLowerCase());
    const matchSal = filterSalario === "" || (o.salario || "").toLowerCase().includes(filterSalario.toLowerCase());
    return matchMun && matchCargo && matchSal;
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

      {/* HEADER SECTION (IMAGEN COMPLETAMENTE VISIBLE SIN RECORTES) */}
      <section className="relative bg-fepv-darkblue overflow-hidden w-full">
        {bgImageUrl ? (
          /* Si hay imagen configurada, se muestra como etiqueta <img> para que el contenedor adapte su altura automáticamente y NUNCA se recorte */
          <img 
            src={bgImageUrl} 
            alt="Banner de Oportunidades" 
            className="w-full h-auto object-contain block"
          />
        ) : (
          /* Fallback por defecto si no hay imagen */
          <div className="flex items-center justify-center min-h-[250px] pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10 text-white">
              <span className="text-fepv-green font-bold tracking-wider uppercase text-sm drop-shadow-md">Portal de Oportunidades</span>
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight drop-shadow-lg">
                Encuentra tu próximo desafío
              </h1>
              <p className="text-gray-200 max-w-2xl mx-auto text-base sm:text-lg drop-shadow-md">
                Explora las vacantes de empleo en el Cesar, oportunidades de voluntariado y convocatorias exclusivas de la Fundación.
              </p>
            </div>
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

                  <div ref={printRefResumen} className="bg-gray-50/50 p-6 sm:p-10 space-y-8 rounded-3xl" style={{ fontFamily: 'sans-serif' }}>
                    
                    {/* Header Principal (Diseño Fiel al Original) */}
                    <div className="bg-[#002f6c] rounded-3xl text-white relative shadow-[0_20px_50px_rgba(0,47,108,0.2)] overflow-hidden flex flex-col md:flex-row">
                      
                      {/* Caja Blanca del Logo (Izquierda) */}
                      <div className="bg-white p-8 md:p-12 md:rounded-br-[80px] flex items-center justify-center shrink-0 w-full md:w-[35%] relative z-10 shadow-lg">
                         <img src="/fepv.org.co/logo.png" alt="Logo FEPV" style={{ height: '120px', width: 'auto', objectFit: 'contain' }} />
                      </div>
                      
                      {/* Textos y Pill (Derecha) */}
                      <div className="p-8 md:p-12 flex flex-col justify-center flex-1 z-10 text-center md:text-left">
                        <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95] tracking-tight mb-6">
                          Oportunidades<br/>
                          <span className="text-[#8cc63f] drop-shadow-sm">De Empleo</span><br/>
                          En El Cesar
                        </h2>
                        <div>
                          <div className="inline-flex items-center gap-2 bg-[#001736] border border-[#003876] text-white font-bold px-6 py-3 rounded-full text-sm sm:text-base shadow-inner">
                            <svg className="w-5 h-5 text-[#8cc63f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Impulsamos oportunidades, construimos futuro
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bento Box: Métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Ofertas Disponibles */}
                      <div 
                        className="bg-gradient-to-br from-[#2d7a2d] to-[#1e521e] rounded-3xl p-8 flex items-center justify-between shadow-[0_15px_40px_rgba(45,122,45,0.2)] transform transition-transform hover:scale-[1.02] cursor-pointer relative overflow-hidden" 
                        onClick={() => setActiveTab("ofertas")}
                      >
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg>
                        </div>
                        <div className="relative z-10 space-y-1 text-white">
                          <div className="text-sm font-bold tracking-widest uppercase opacity-80 mb-2 flex items-center gap-2">
                             <div className="w-2 h-2 bg-[#8cc63f] rounded-full animate-pulse"></div> 
                             Activas Hoy
                          </div>
                          <div className="text-7xl sm:text-8xl font-black leading-none drop-shadow-md">{totalOfertas}</div>
                        </div>
                        <div className="relative z-10 text-right">
                           <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 inline-block shadow-inner border border-white/20">
                             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                           </div>
                           <div className="mt-4 text-white font-black text-xl uppercase tracking-wider leading-tight">
                             Ofertas De<br/>Empleo
                           </div>
                        </div>
                      </div>

                      {/* Rango Salarial */}
                      <div className="bg-white rounded-3xl p-8 flex items-center gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                        <div className="w-20 h-20 bg-gradient-to-br from-[#002f6c] to-[#0052b8] text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 border border-blue-400/30 relative z-10 shrink-0">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="relative z-10">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                             Rango Salarial Promedio
                          </div>
                          <div className="text-3xl sm:text-4xl font-black text-[#002f6c] leading-tight mb-1 tracking-tight">
                            $ 1.5 a $4
                          </div>
                          <div className="text-xl font-bold text-gray-500 mb-2">millones</div>
                          <div className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full inline-block">(Según cargo y experiencia)</div>
                        </div>
                      </div>
                    </div>

                    {/* Municipios */}
                    <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                      <div className="bg-gray-50/80 px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-[#2d7a2d]/10 rounded-xl flex items-center justify-center text-[#2d7a2d]">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                           </div>
                           <h3 className="font-black text-lg text-gray-800 uppercase tracking-widest">Municipios Disponibles</h3>
                         </div>
                      </div>
                      <div className="p-8 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 w-full relative z-10">
                          {uniqueMunicipios.length > 0 ? (
                            <div className="columns-2 sm:columns-3 gap-x-8 gap-y-4 space-y-4">
                              {uniqueMunicipios.map((m, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-bold uppercase tracking-wider break-inside-avoid bg-gray-50/50 p-2 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                                  <div className="w-2 h-2 bg-[#8cc63f] rounded-sm transform rotate-45"></div>
                                  {m}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 text-center">No hay municipios disponibles por el momento.</p>
                          )}
                        </div>
                        <div className="hidden md:flex w-1/3 justify-center relative">
                           {/* Decorative Map Graphic using simple CSS/SVG */}
                           <div className="relative w-40 h-40">
                             <div className="absolute inset-0 bg-[#8cc63f]/20 rounded-full blur-2xl"></div>
                             <svg className="relative z-10 w-full h-full text-[#2d7a2d] drop-shadow-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                             </svg>
                             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 animate-bounce z-20">
                               <svg className="w-12 h-12 text-[#002f6c] drop-shadow-md" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Agencias Aliadas */}
                    <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gray-50 w-full h-1/2 -z-10"></div>
                      <div className="text-center mb-8">
                         <span className="inline-block bg-[#002f6c] text-white text-xs font-bold px-6 py-2 rounded-full uppercase tracking-widest shadow-md">
                           Agencias de Empleo Aliadas
                         </span>
                      </div>
                      {agencias.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                          {agencias.map((agencia, i) => {
                            const imgUrl = agencia.url_imagen ? getDirectDriveImageUrl(agencia.url_imagen) : null;
                            return (
                              <Link 
                                key={i} 
                                href={agencia.url || "#"} 
                                target={agencia.url ? "_blank" : "_self"} 
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform cursor-pointer"
                              >
                                {imgUrl ? (
                                  <img src={imgUrl} alt={agencia.nombre} className="h-16 w-auto object-contain mb-2 drop-shadow-sm" />
                                ) : (
                                  <span className="font-black text-2xl text-[#002f6c] tracking-tight text-center">{agencia.nombre}</span>
                                )}
                                {agencia.eslogan && (
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 text-center">
                                    {agencia.eslogan}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                          <div className="flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform cursor-pointer">
                             <span className="font-black text-3xl text-[#0065ff] tracking-tight">Computrabajo</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform cursor-pointer">
                             <span className="font-black text-4xl text-[#6e28d9] tracking-tight lowercase">magneto</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform cursor-pointer">
                             <span className="font-black text-2xl text-red-600 uppercase tracking-tighter">Comfacesar</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Features Inferiores */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: "✓", title: "Información", sub: "Verificada", color: "text-[#2d7a2d]", bg: "bg-[#2d7a2d]/10" },
                        { icon: "🎁", title: "Totalmente", sub: "Gratuita", color: "text-[#0065ff]", bg: "bg-[#0065ff]/10" },
                        { icon: "👥", title: "Disponible", sub: "Para todos", color: "text-orange-500", bg: "bg-orange-500/10" },
                        { icon: "🤝", title: "Comprometidos", sub: "Con tu futuro", color: "text-[#2d7a2d]", bg: "bg-[#2d7a2d]/10" },
                      ].map((feature, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-full flex items-center justify-center text-xl mb-3`}>
                             {feature.icon}
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase">{feature.title}</span>
                          <span className="text-sm font-black text-gray-800">{feature.sub}</span>
                        </div>
                      ))}
                    </div>
                  
                  </div>
                  
                  {/* Botón Ver Convocatorias */}
                  <div className="pt-4">
                    <button 
                      onClick={() => setActiveTab("convocatorias")}
                      className="w-full bg-gradient-to-r from-[#002f6c] to-[#004e9a] p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all text-center group border border-[#001f4d] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <h3 className="font-display font-black text-3xl text-white mb-2 group-hover:text-[#8cc63f] transition-colors flex justify-center items-center gap-4">
                        Ver Convocatorias de la Fundación 
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-sm group-hover:bg-[#8cc63f] group-hover:text-[#002f6c] transition-all">➔</div>
                      </h3>
                      <p className="text-blue-100/80 font-medium">Participa en proyectos sociales, formaciones y becas exclusivas.</p>
                    </button>
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
                        <div className="mt-4 bg-blue-50/80 border-l-2 border-[#002f6c] p-3 rounded-r text-xs text-gray-600 max-w-2xl text-justify">
                          <strong>Aviso Legal:</strong> La FEPV actúa exclusivamente como canal de difusión de estas ofertas (SENA, Comfacesar, etc). No intervenimos en la selección ni garantizamos contratación. Toda postulación es bajo responsabilidad del usuario ante la entidad emisora.
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
                        <select value={filterSalario} onChange={(e) => { setFilterSalario(e.target.value); setCurrentPage(1); }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-fepv-blue focus:border-fepv-blue block w-full sm:w-48 p-3 outline-none"><option value="">Cualquier Salario</option>{uniqueSalarios.map((s, idx) => (<option key={idx} value={s}>{s}</option>))}</select>
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
                                <tr key={idx} className={`transition-colors ${idx % 2 === 0 ? 'bg-[#002f6c]/[0.03]' : 'bg-[#8cc63f]/[0.05]'} hover:bg-[#002f6c]/10`}>
                                  <td className="px-4 py-4 font-bold text-gray-500 text-center border-r border-gray-200">
                                    <div className="bg-[#8cc63f] text-white w-7 h-7 rounded-lg flex items-center justify-center mx-auto">{(currentPage - 1) * itemsPerPage + idx + 1}</div>
                                  </td>
                                  <td className="px-4 py-4 font-mono text-xs text-gray-600 border-r border-gray-200">{o.codigo_vacante || '-'}</td>
                                  <td className="px-4 py-4 border-r border-gray-200">
                                    <div className="flex items-center gap-3">
                                      {o.url_imagen && (
                                        <div className="w-12 h-12 shrink-0 bg-white border border-gray-200 rounded-md p-1 flex items-center justify-center overflow-hidden shadow-sm">
                                          <img src={o.url_imagen} alt="Logo" className="w-full h-full object-contain" />
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-bold text-[#002f6c] leading-tight">{o.titulo_vacante || o.cargo || 'Sin título'}</div>
                                        <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">{o.nombre_prestador || 'Agencia de Empleo'}</div>
                                        {isUrgent && <span className="inline-block mt-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">URGENTE</span>}
                                      </div>
                                    </div>
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
                  <div className="flex flex-col mb-6 gap-6">
                    <div>
                      <h2 className="font-display font-bold text-3xl text-fepv-darkblue">Convocatorias FEPV</h2>
                      <p className="text-gray-500 mt-1">Participa en nuestros proyectos sociales, becas y voluntariados, y accede a ofertas externas.</p>
                    </div>
                    
                    {/* Descargo de Responsabilidad Legal */}
                    <div className="bg-blue-50/80 border-l-4 border-[#002f6c] p-5 rounded-r-xl shadow-sm">
                      <div className="flex gap-4">
                        <span className="text-2xl mt-1">⚖️</span>
                        <div>
                           <p className="text-sm text-gray-700 font-medium leading-relaxed text-justify">
                             <strong className="text-[#002f6c] block mb-1">Aviso Legal y Descargo de Responsabilidad:</strong>
                             La Fundación Encuentros para la Vida (FEPV) actúa exclusivamente como un <strong>canal de difusión y puente informativo</strong>. Las ofertas de empleo, programas o convocatorias pertenecientes a entidades de terceros (tales como el SENA, Comfacesar u otras empresas e instituciones) publicadas en este portal son de entera y exclusiva responsabilidad de las organizaciones emisoras. La FEPV no interviene en los procesos de selección, no actúa como bolsa de empleo directa para estos terceros y no garantiza vinculación laboral alguna, por lo que <strong>se exime expresamente de cualquier responsabilidad jurídica, laboral, civil o contractual</strong> derivada de la postulación, participación o resultados en dichas ofertas externas. Toda información debe ser verificada en los canales oficiales de cada entidad ofertante.
                           </p>
                        </div>
                      </div>
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
                            
                            {(() => {
                              const isClosed = st.includes("CERRADA");
                              
                              if (isClosed) {
                                return (
                                  <button disabled className="w-full text-center bg-gray-200 text-gray-500 font-bold py-3 rounded-xl cursor-not-allowed text-sm shadow-inner">
                                    Convocatoria Cerrada
                                  </button>
                                );
                              }

                              if (c.enlace || c.enlace_formulario) {
                                return (
                                  <Link 
                                    href={c.enlace || c.enlace_formulario || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block text-center bg-fepv-orange hover:bg-[#d96704] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
                                  >
                                    Ver Detalles / Inscribirse
                                  </Link>
                                );
                              }

                              return (
                                <button disabled className="w-full text-center bg-gray-100 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed text-sm">
                                  Próximamente
                                </button>
                              );
                            })()}
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
