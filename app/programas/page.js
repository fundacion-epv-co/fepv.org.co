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
    location: "Agustín Codazzi, Becerril, San Diego, La Paz (Cesar)",
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
    location: "Agustín Codazzi y Serranía del Perijá (Zonas rurales)",
    allies: "Organizaciones comunitarias y Corporación Autónoma Regional",
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
            category: item.id || "salud-mental", // id mapea a la categoría
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

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-4.5xl">
            Programas y Proyectos
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Explora las iniciativas de impacto territorial que la FEPV implementa en salud mental, educación, ambiente, bienestar animal e inclusión.
          </p>
        </div>
      </section>

      {/* Navegación y Filtros */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`fepv-btn py-2 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id 
                    ? "bg-fepv-green text-white shadow-md shadow-fepv-green/10" 
                    : "bg-white text-fepv-gray hover:bg-fepv-light/20 border border-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo de Proyectos */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-fepv-green border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-fepv-gray/75">Cargando programas y proyectos...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-md mx-auto space-y-4">
            <span className="text-5xl block">📂</span>
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">No se encontraron proyectos</h3>
            <p className="text-xs text-fepv-gray/70">
              Estamos estructurando nuevos proyectos en esta categoría. Muy pronto estarán publicados.
            </p>
            <button 
              onClick={() => setSelectedCategory("all")}
              className="fepv-btn fepv-btn-primary py-2 text-xs"
            >
              Ver todos los programas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((p) => {
              // Buscar convocatorias asociadas a este programa específico
              const relatedOpps = oportunidades.filter(opp => 
                (opp.programa && opp.programa.toLowerCase().trim() === p.category.toLowerCase().trim()) ||
                (opp.programa && opp.programa.toLowerCase().trim() === p.title.toLowerCase().trim())
              );

              return (
                <div 
                  key={p.id}
                  className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Indicador de Estado Activo */}
                  <div className="absolute top-6 right-6 flex items-center gap-1 text-[10px] font-bold text-fepv-green bg-fepv-light px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-fepv-green rounded-full animate-ping"></span>
                    {p.status}
                  </div>

                  <div className="space-y-4">
                    {/* Categoría badge */}
                    <span className="inline-block text-[10px] font-bold text-fepv-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                      {categories.find(c => c.id === p.category)?.name || "Programa"}
                    </span>
                    
                    <h3 className="font-display font-bold text-lg sm:text-xl text-fepv-darkblue pr-12 leading-tight">
                      {p.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-fepv-gray/85 leading-relaxed">
                      {p.desc}
                    </p>

                    <div className="border-t border-gray-100 pt-4 space-y-3 text-xs text-fepv-gray/80">
                      {p.obj && (
                        <p>
                          <strong>🎯 Objetivo:</strong> {p.obj}
                        </p>
                      )}
                      {p.population && (
                        <p>
                          <strong>👥 Población:</strong> {p.population}
                        </p>
                      )}
                      {p.location && (
                        <p>
                          <strong>📍 Municipio:</strong> {p.location}
                        </p>
                      )}
                      {p.allies && (
                        <p>
                          <strong>🤝 Co-operantes / Aliados:</strong> {p.allies}
                        </p>
                      )}
                    </div>

                    {/* VINCULACIÓN EN VIVO DE CONVOCATORIAS / EMPLEOS */}
                    {relatedOpps.length > 0 && (
                      <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-100 space-y-3">
                        <h4 className="text-[10px] font-bold text-fepv-darkblue uppercase tracking-widest flex items-center gap-1.5">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          Convocatorias y Vacantes Activas
                        </h4>
                        <div className="space-y-2">
                          {relatedOpps.map(opp => (
                            <div key={opp.id} className="bg-gray-50 border border-gray-150 p-3 rounded-2xl flex justify-between items-center gap-3">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-fepv-green uppercase tracking-wider bg-fepv-light px-1.5 py-0.5 rounded inline-block">
                                  {opp.categoria}
                                </span>
                                <p className="text-xs font-bold text-fepv-darkblue leading-tight">{opp.title}</p>
                                {opp.deadline && (
                                  <p className="text-[10px] text-fepv-gray/60 font-medium">Plazo: {opp.deadline}</p>
                                )}
                              </div>
                              <a 
                                href={opp.enlace_formulario || opp.enlace_drive || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[10px] font-bold bg-fepv-green hover:bg-fepv-darkblue text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                              >
                                Postularse
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <Link 
                      href={`/participa?rol=beneficiario&programa=${p.id}`}
                      className="fepv-btn fepv-btn-primary py-2 px-6 text-xs"
                    >
                      Quiero participar
                    </Link>
                    <Link 
                      href="/contacto"
                      className="text-xs text-fepv-green hover:underline font-semibold"
                    >
                      Solicitar información
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Resumen Final de Incidencia */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-10 bg-fepv-light/20 rounded-3xl border border-fepv-green/10">
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
