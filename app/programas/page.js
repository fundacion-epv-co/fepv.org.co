"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGoogleSheetData, GOOGLE_SHEETS_PROGRAMAS_CSV, GOOGLE_SHEETS_CONVOCATORIAS_CSV } from "../../lib/api";

const MOCK_PROJECTS = [
  {
    id: "salud-mental",
    category: "salud-mental",
    title: "PAPSIVI (Programa de Atención Psicosocial y Salud Integral a Víctimas)",
    desc: "Implementación del modelo de atención psicosocial a nivel individual, familiar y comunitario para la dignificación de víctimas en el departamento del Cesar.",
    obj: "Mitigar las afectaciones psicosociales y los daños a la salud física y mental de las víctimas del conflicto armado.",
    population: "Víctimas del conflicto armado, familias vulnerables",
    location: "Agustín Codazzi, Cesar",
    allies: "Cooperación nacional, entes territoriales de salud",
    status: "Activo"
  },
  {
    id: "educacion",
    category: "educacion",
    title: "Escuela de Formación y Competencias Ciudadanas",
    desc: "Talleres y cursos continuos que empoderan a las comunidades con herramientas de liderazgo, resolución de conflictos, democracia participativa y habilidades blandas.",
    obj: "Capacitar a líderes comunitarios y jóvenes en técnicas de autogestión territorial.",
    population: "Líderes comunales, jóvenes de juntas de acción local",
    location: "Agustín Codazzi (Cesar)",
    allies: "Instituciones educativas locales, SENA",
    status: "Activo"
  },
  {
    id: "ambiente",
    category: "ambiente",
    title: "Eco-Encuentros Para la Vida",
    desc: "Acciones colectivas de educación ambiental escolar, reforestación de cuencas hidrográficas y capacitación sobre separación en la fuente y reciclaje en Codazzi.",
    obj: "Promover la conciencia ecológica y recuperar zonas degradadas por la deforestación local.",
    population: "Comunidad escolar, comités ambientales comunales",
    location: "Agustín Codazzi y Serranía del Perijá",
    allies: "Organizaciones comunitarias y Corpocesar",
    status: "Activo"
  },
  {
    id: "bienestar-animal",
    category: "bienestar-animal",
    title: "Cuidado de Huellas & Salud Animal Comunitaria",
    desc: "Sensibilización sobre tenencia responsable de mascotas, realización de jornadas de desparasitación y articulación de brigadas de esterilización animal.",
    obj: "Reducir la proliferación de animales sin hogar y prevenir problemas de salud pública asociados en barrios vulnerables.",
    population: "Familias con mascotas, animales callejeros de sectores vulnerables",
    location: "Agustín Codazzi",
    allies: "Clínicas veterinarias aliadas, fundaciones protectoras locales",
    status: "Activo"
  },
  {
    id: "emprendimiento",
    category: "emprendimiento",
    title: "Programa de Autonomía Económica & Emprendimiento Social",
    desc: "Capacitación técnica y financiera a mujeres cabeza de hogar y jóvenes desempleados para formular planes de negocio y coordinar redes de comercio justo.",
    obj: "Fortalecer la capacidad productiva e ingresos autónomos de las familias del municipio.",
    population: "Mujeres cabeza de hogar, jóvenes emprendedores",
    location: "Agustín Codazzi",
    allies: "Cámara de Comercio de Valledupar, Cooperantes privados",
    status: "Activo"
  }
];

export default function Programas() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProgramId, setActiveProgramId] = useState(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const categories = [
    { id: "all", name: "Todos los programas", icon: "🌐" },
    { id: "salud-mental", name: "Salud Mental", icon: "🧠" },
    { id: "educacion", name: "Educación", icon: "📚" },
    { id: "inclusion", name: "Inclusión & Derechos", icon: "🤝" },
    { id: "ambiente", name: "Medio Ambiente", icon: "🌱" },
    { id: "bienestar-animal", name: "Bienestar Animal", icon: "🐾" },
    { id: "emprendimiento", name: "Emprendimiento", icon: "💼" }
  ];

  useEffect(() => {
    async function loadProgramasData() {
      setIsLoading(true);

      // Cargar Oportunidades para cruce
      let activeOpps = [];
      try {
        const oppsData = await fetchGoogleSheetData(GOOGLE_SHEETS_CONVOCATORIAS_CSV);
        if (oppsData && oppsData.length > 0) {
          activeOpps = oppsData.map(item => ({
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
          })).filter(opp => opp.status.toLowerCase().trim() === "abierta");
          setOportunidades(activeOpps);
        }
      } catch (e) {
        console.error("Error cargando convocatorias para programas", e);
      }

      // Cargar Programas
      try {
        const progData = await fetchGoogleSheetData(GOOGLE_SHEETS_PROGRAMAS_CSV);
        if (progData && progData.length > 0) {
          const mapped = progData.map(item => ({
            id: item.id || `PROG-${Math.random()}`,
            category: item.id || "salud-mental", 
            title: item.titulo || "",
            desc: item.descripcion || "",
            obj: item.objetivo || "",
            population: item.poblacion || "",
            location: item.lugar || "",
            allies: item.aliados || "",
            status: item.estado || "Activo"
          }));
          setProjects(mapped);
        } else {
          setProjects(MOCK_PROJECTS);
        }
      } catch (e) {
        console.error("Error cargando programas", e);
        setProjects(MOCK_PROJECTS);
      }

      setIsLoading(false);
    }
    loadProgramasData();
  }, []);

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  // Seleccionar automáticamente el primer programa al cargar o cambiar categoría
  useEffect(() => {
    if (filteredProjects.length > 0) {
      const currentExists = filteredProjects.some(p => p.id === activeProgramId);
      if (!currentExists) {
        setActiveProgramId(filteredProjects[0].id);
      }
    } else {
      setActiveProgramId(null);
    }
  }, [filteredProjects, activeProgramId]);

  const activeProgram = projects.find(p => p.id === activeProgramId);

  // Buscar convocatorias asociadas al programa activo
  const activeProgramOpps = activeProgram 
    ? oportunidades.filter(opp => 
        (opp.programa && opp.programa.toLowerCase().trim() === activeProgram.category.toLowerCase().trim()) ||
        (opp.programa && opp.programa.toLowerCase().trim() === activeProgram.title.toLowerCase().trim())
      )
    : [];

  const handleProgramSelect = (id) => {
    setActiveProgramId(id);
    setMobileDetailOpen(true);
  };

  return (
    <div className="w-full bg-gray-50 pb-20 min-h-screen">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-4.5xl">
            Programas y Proyectos
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Explora las líneas de acción de la FEPV y las ofertas activas en cada área para tu desarrollo y bienestar.
          </p>
        </div>
      </section>

      {/* Filtros de Categorías */}
      <section className="py-8 bg-white border-b border-gray-150 sticky top-[72px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`fepv-btn py-2 px-3 sm:px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-xl transition-all duration-300 ${
                  selectedCategory === cat.id 
                    ? "bg-fepv-green text-white shadow-md shadow-fepv-green/10 scale-105" 
                    : "bg-gray-50 text-fepv-gray hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard General */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-fepv-green border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-fepv-gray/70">Cargando programas...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 max-w-md mx-auto space-y-4">
            <span className="text-5xl block">📂</span>
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">No hay programas en esta sección</h3>
            <p className="text-xs text-fepv-gray/70">
              Estamos diseñando nuevos proyectos institucionales. Muy pronto estarán cargados en esta categoría.
            </p>
            <button 
              onClick={() => setSelectedCategory("all")}
              className="fepv-btn fepv-btn-primary py-2 text-xs"
            >
              Ver todos los programas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: Listado de Programas */}
            <div className="lg:col-span-5 space-y-4 max-h-[80vh] lg:overflow-y-auto pr-2 custom-scrollbar">
              <h2 className="font-display font-bold text-sm text-fepv-gray/70 uppercase tracking-widest px-1">
                Líneas de Acción ({filteredProjects.length})
              </h2>
              <div className="space-y-3">
                {filteredProjects.map((p) => {
                  const isSelected = activeProgramId === p.id;
                  
                  // Contar convocatorias asociadas
                  const oppCount = oportunidades.filter(opp => 
                    (opp.programa && opp.programa.toLowerCase().trim() === p.category.toLowerCase().trim()) ||
                    (opp.programa && opp.programa.toLowerCase().trim() === p.title.toLowerCase().trim())
                  ).length;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleProgramSelect(p.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                        isSelected 
                          ? "bg-white border-fepv-green/45 shadow-md scale-[1.01]" 
                          : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                      }`}
                    >
                      {/* Borde izquierdo activo */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-fepv-green"></div>
                      )}

                      <div className="flex items-start gap-4">
                        <span className="text-2xl p-2.5 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-fepv-light transition-colors">
                          {categories.find(c => c.id === p.category)?.icon || "📋"}
                        </span>
                        
                        <div className="space-y-1 flex-grow">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold text-fepv-blue uppercase tracking-widest">
                              {categories.find(c => c.id === p.category)?.name}
                            </span>
                            
                            {oppCount > 0 && (
                              <span className="text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                <span className="w-1 h-1 bg-white rounded-full"></span>
                                {oppCount} {oppCount === 1 ? 'oferta' : 'ofertas'}
                              </span>
                            )}
                          </div>

                          <h3 className="font-display font-bold text-sm text-fepv-darkblue group-hover:text-fepv-green transition-colors leading-snug">
                            {p.title}
                          </h3>
                          
                          <p className="text-xs text-fepv-gray/70 line-clamp-2">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMNA DERECHA: Espacio del Programa (Detalle en Desktop) */}
            <div className="hidden lg:block lg:col-span-7">
              {activeProgram ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md space-y-6 text-left relative overflow-hidden animate-in fade-in duration-300">
                  
                  {/* Badge de estado en esquina */}
                  <span className="absolute top-8 right-8 flex items-center gap-1.5 text-[10px] font-bold text-fepv-green bg-fepv-light px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-fepv-green rounded-full animate-ping"></span>
                    {activeProgram.status}
                  </span>

                  {/* Cabecera de Programa */}
                  <div className="space-y-2 pr-20">
                    <span className="inline-block text-[10px] font-bold text-fepv-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                      Línea {categories.find(c => c.id === activeProgram.category)?.name}
                    </span>
                    <h2 className="font-display font-bold text-2xl text-fepv-darkblue leading-tight">
                      {activeProgram.title}
                    </h2>
                  </div>

                  <div className="w-12 h-1 bg-fepv-orange rounded-full"></div>

                  {/* De qué trata */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-fepv-darkblue uppercase tracking-widest">¿De qué trata?</h4>
                    <p className="text-sm text-fepv-gray/85 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      {activeProgram.desc}
                    </p>
                  </div>

                  {/* Objetivos */}
                  {activeProgram.obj && (
                    <div className="space-y-2 bg-gradient-to-br from-fepv-light/20 to-white p-5 rounded-2xl border border-fepv-green/10">
                      <h4 className="text-xs font-bold text-fepv-green uppercase tracking-widest flex items-center gap-1.5">
                        <span>🎯</span> Objetivo del Programa
                      </h4>
                      <p className="text-xs sm:text-sm font-semibold text-fepv-darkblue leading-relaxed">
                        {activeProgram.obj}
                      </p>
                    </div>
                  )}

                  {/* Ficha Técnica del Proyecto */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {activeProgram.location && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-150/40">
                        <span className="text-xs block mb-1">📍 <strong>Lugar:</strong></span>
                        <span className="text-[11px] text-fepv-gray/90 leading-tight block">{activeProgram.location}</span>
                      </div>
                    )}
                    {activeProgram.population && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-150/40">
                        <span className="text-xs block mb-1">👥 <strong>Población:</strong></span>
                        <span className="text-[11px] text-fepv-gray/90 leading-tight block">{activeProgram.population}</span>
                      </div>
                    )}
                    {activeProgram.allies && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-150/40">
                        <span className="text-xs block mb-1">🤝 <strong>Aliados:</strong></span>
                        <span className="text-[11px] text-fepv-gray/90 leading-tight block">{activeProgram.allies}</span>
                      </div>
                    )}
                  </div>

                  {/* Convocatorias asociadas */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-fepv-darkblue uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      Vacantes y Convocatorias Activas ({activeProgramOpps.length})
                    </h4>

                    {activeProgramOpps.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeProgramOpps.map(opp => (
                          <div 
                            key={opp.id} 
                            className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-col justify-between items-start gap-3 hover:border-fepv-green/30 hover:shadow-sm transition-all"
                          >
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-fepv-green uppercase tracking-wider bg-fepv-light px-2 py-0.5 rounded inline-block">
                                {opp.categoria}
                              </span>
                              <h5 className="text-xs font-bold text-fepv-darkblue leading-tight">{opp.title}</h5>
                              {opp.deadline && (
                                <p className="text-[10px] text-fepv-gray/60 font-semibold">Cierra: {opp.deadline}</p>
                              )}
                            </div>
                            <a 
                              href={opp.enlace_formulario || opp.enlace_drive || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[10px] font-bold bg-fepv-green hover:bg-fepv-darkblue text-white px-4 py-2 rounded-xl transition-all cursor-pointer w-full text-center"
                            >
                              Postularse ahora
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-xs text-fepv-gray/70">
                          No hay vacantes de empleo ni cursos abiertos en esta línea hoy.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones principales del panel */}
                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <Link 
                      href={`/participa?rol=beneficiario&programa=${activeProgram.id}`}
                      className="fepv-btn fepv-btn-primary py-2.5 px-6 text-xs font-bold"
                    >
                      ✍️ Quiero Registrarme
                    </Link>
                    <a 
                      href={`https://wa.me/573166899250?text=Hola,%20me%20gustaria%20saber%20mas%20sobre%20el%20programa%20${encodeURIComponent(activeProgram.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-fepv-green hover:underline font-bold flex items-center gap-1"
                    >
                      💬 Consultar por WhatsApp
                    </a>
                  </div>

                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center text-fepv-gray/60">
                  Selecciona una línea de acción a la izquierda para ver su espacio detallado.
                </div>
              )}
            </div>

          </div>
        )}
      </section>

      {/* MODAL / SLIDE-OVER DE DETALLE PARA MÓVILES */}
      {mobileDetailOpen && activeProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 lg:hidden">
          <div className="bg-white w-full h-[90vh] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Header móvil */}
            <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-gray-50 flex-shrink-0">
              <span className="text-[10px] font-bold text-fepv-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                Línea {categories.find(c => c.id === activeProgram.category)?.name}
              </span>
              <button 
                onClick={() => setMobileDetailOpen(false)}
                className="text-fepv-gray hover:text-fepv-darkblue text-xs font-bold bg-gray-200/60 p-2 rounded-full cursor-pointer"
                aria-label="Cerrar detalles"
              >
                ❌ Cerrar
              </button>
            </div>

            {/* Contenido móvil scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow text-left">
              {/* Título */}
              <div className="space-y-1">
                <h2 className="font-display font-bold text-xl text-fepv-darkblue leading-tight">
                  {activeProgram.title}
                </h2>
                <span className="inline-block text-[10px] font-bold text-fepv-green bg-fepv-light px-2.5 py-0.5 rounded-full">
                  {activeProgram.status}
                </span>
              </div>

              <div className="w-12 h-1 bg-fepv-orange rounded-full"></div>

              {/* Qué trata */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-fepv-darkblue uppercase tracking-widest">¿De qué trata?</h4>
                <p className="text-xs sm:text-sm text-fepv-gray/85 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {activeProgram.desc}
                </p>
              </div>

              {/* Objetivos */}
              {activeProgram.obj && (
                <div className="space-y-2 bg-gradient-to-br from-fepv-light/20 to-white p-4 rounded-xl border border-fepv-green/10">
                  <h4 className="text-xs font-bold text-fepv-green uppercase tracking-widest">🎯 Objetivo del Programa</h4>
                  <p className="text-xs text-fepv-darkblue leading-relaxed font-semibold">
                    {activeProgram.obj}
                  </p>
                </div>
              )}

              {/* Ficha Técnica */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-fepv-darkblue uppercase tracking-widest">Ficha Técnica</h4>
                <div className="grid grid-cols-1 gap-3">
                  {activeProgram.location && (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs">
                      <strong>📍 Lugar:</strong> {activeProgram.location}
                    </div>
                  )}
                  {activeProgram.population && (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs">
                      <strong>👥 Población:</strong> {activeProgram.population}
                    </div>
                  )}
                  {activeProgram.allies && (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs">
                      <strong>🤝 Aliados:</strong> {activeProgram.allies}
                    </div>
                  )}
                </div>
              </div>

              {/* Convocatorias móviles */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-fepv-darkblue uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Vacantes y Convocatorias ({activeProgramOpps.length})
                </h4>

                {activeProgramOpps.length > 0 ? (
                  <div className="space-y-3">
                    {activeProgramOpps.map(opp => (
                      <div 
                        key={opp.id} 
                        className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center gap-3"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-fepv-green uppercase tracking-wider bg-fepv-light px-1.5 py-0.5 rounded inline-block">
                            {opp.categoria}
                          </span>
                          <h5 className="text-xs font-bold text-fepv-darkblue leading-tight">{opp.title}</h5>
                          {opp.deadline && (
                            <p className="text-[10px] text-fepv-gray/60">Plazo: {opp.deadline}</p>
                          )}
                        </div>
                        <a 
                          href={opp.enlace_formulario || opp.enlace_drive || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] font-bold bg-fepv-green text-white px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer"
                        >
                          Postularse
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-fepv-gray/70">
                      No hay ofertas vigentes el día de hoy.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones móviles */}
            <div className="p-4 border-t border-gray-150 bg-gray-50 flex items-center justify-between flex-shrink-0">
              <Link 
                href={`/participa?rol=beneficiario&programa=${activeProgram.id}`}
                onClick={() => setMobileDetailOpen(false)}
                className="fepv-btn fepv-btn-primary py-3 px-6 text-xs text-center w-1/2 font-bold"
              >
                ✍️ Registrarse
              </Link>
              <a 
                href={`https://wa.me/573166899250?text=Hola,%20me%20gustaria%20saber%20mas%20sobre%20el%20programa%20${encodeURIComponent(activeProgram.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-fepv-green hover:underline font-bold text-center w-1/2"
              >
                💬 WhatsApp
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Resumen Final de Incidencia */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-10 bg-fepv-light/20 rounded-3xl border border-fepv-green/10 mt-12">
        <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-2">¿Quieres presentar o financiar un proyecto con FEPV?</h3>
        <p className="text-xs text-fepv-gray/85 max-w-2xl mx-auto mb-6">
          Contamos con capacidad legal, técnica y contable para celebrar convenios asociativos, contratos y alianzas de cofinanciación para el desarrollo sostenible.
        </p>
        <Link href="/participa?rol=aliado" className="fepv-btn fepv-btn-primary text-xs">
          Contactar con Cooperación de FEPV
        </Link>
      </section>

    </div>
  );
}
